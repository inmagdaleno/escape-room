document.addEventListener("DOMContentLoaded", () => {
  const piecesContainer = document.getElementById("pieces");
  const boardContainer = document.getElementById("board");
  const btnIrAdelante = document.getElementById("btn-ir-adelante");
  const groupIrAdelante = document.getElementById("group-ir-adelante");


  // Elementos de la interfaz
  const scoreDisplay = document.getElementById("score");
  const timerDisplay = document.getElementById("timer");

  // Modales
  const modalPerfil = document.getElementById('modal-perfil');
  const btnRanking = document.getElementById('btn-ranking');
  const modalRanking = document.getElementById('modal-ranking');
  const tbody = document.getElementById('ranking-body');

  function cargarRanking() {
    fetch('/controller/obtenerRanking.php')
      .then(res => res.json())
      .then(data => {
        tbody.innerHTML = '';
        data.forEach((jugador, i) => {
          tbody.innerHTML += `<tr>
            <td>${i+1}</td>
            <td>${jugador.nombre}</td>
            <td>${jugador.puntuacion}</td>
          </tr>`;
        });
      });
  }

  if (btnRanking && modalRanking) {
    btnRanking.addEventListener('click', () => {
      cargarRanking();
      modalRanking.classList.add('visible');
    });
  }
});

  // Estado del juego (se asume que se carga de localStorage o similar)
  let gameMode = localStorage.getItem('gameMode') || 'score'; // 'score' o 'time'
  let score = parseInt(localStorage.getItem('score')) || 400;
  let timeLeft = parseInt(localStorage.getItem('timeLeft')) || (30 * 60); // 30 minutos en segundos
  let timerInterval;

// Evento para el botón "Ir Adelante"
  if (btnIrAdelante) {
    btnIrAdelante.addEventListener('click', () => {
      mostrarTransicionMapaCompleto();
    });
  }

  const cols = 6;
  const rows = 6;

  const pieceWidth = 500 / cols;
  const pieceHeight = 500 / rows;

  const positions = [];

  // Generar posiciones (x, y) de cada pieza
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      positions.push({ x, y });
    }
  }

  // Mezclar posiciones para las piezas sueltas
  const shuffledPositions = positions
    .slice()
    .sort(() => Math.random() - 0.5);

  // Crear piezas sueltas
  shuffledPositions.forEach(pos => {
    const piece = document.createElement("div");
    piece.classList.add("piece");
    piece.setAttribute("draggable", true);
    piece.dataset.pos = `${pos.x}-${pos.y}`;

    piece.style.backgroundImage = "url('img/mapa.webp')";
    piece.style.backgroundPosition = `-${pos.x * pieceWidth}px -${pos.y * pieceHeight}px`;

    randomizePiecePosition(piece, piecesContainer.offsetWidth, piecesContainer.offsetHeight);

    piece.addEventListener("dragstart", dragStart);

    piecesContainer.appendChild(piece);
  });

  // Crear slots en el tablero
  positions.forEach(pos => {
    const slot = document.createElement("div");
    slot.classList.add("slot");
    slot.dataset.pos = `${pos.x}-${pos.y}`;

    slot.addEventListener("dragover", dragOver);
    slot.addEventListener("drop", drop);

    boardContainer.appendChild(slot);
  });

  // Add dragover and drop listeners to piecesContainer
  piecesContainer.addEventListener("dragover", dragOver);
  piecesContainer.addEventListener("drop", drop);

  // --- INICIALIZACIÓN DEL JUEGO (para score/timer) ---
  function inicializarJuegoMapa() {
    if (gameMode === 'score') {
      if (scoreDisplay) scoreDisplay.textContent = score;
      document.getElementById("score-container").style.display = "block";
      document.getElementById("timer-container").style.display = "none";
    } else if (gameMode === 'time') {
      updateTimerDisplay();
      document.getElementById("score-container").style.display = "none";
      document.getElementById("timer-container").style.display = "block";
      startTimer();
    }
    // Ocultar modales al inicio
    if (modalPerfil) modalPerfil.style.display = 'none';
    if (modalRanking) modalRanking.style.display = 'none';
  }

  // --- LÓGICA DEL TEMPORIZADOR ---
  function startTimer() {
    const endTime = localStorage.getItem('endTime');
    if (!endTime) {
      // Handle case where timer wasn't started
      return;
    }

    timerInterval = setInterval(() => {
      const remainingTime = endTime - Date.now();
      if (remainingTime <= 0) {
        clearInterval(timerInterval);
        document.getElementById('game-over-overlay').classList.remove('oculto');
        document.getElementById('game-over-video').play();
        return;
      }
      timeLeft = Math.ceil(remainingTime / 1000);
      updateTimerDisplay();
    }, 1000);
  }

  document.getElementById('btn-restart').addEventListener('click', () => {
    localStorage.removeItem('endTime');
    window.location.href = '../index.php';
  });

  function updateTimerDisplay() {
    if (timerDisplay) timerDisplay.textContent = formatTime(timeLeft);
  }

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  // --- FUNCIÓN PARA ENVIAR RESULTADOS DE LA PARTIDA ---
  function sendGameResult() {
    const gameData = {
      modo_juego: gameMode,
      pistas_usadas: 0, // No hay pistas en este puzzle
      resultado: 1 // 1 para éxito, 0 para fallo
    };

  fetch('/controller/guardarPartida.php', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(gameData),
})
.then(response => response.json())
.then(data => {
  if (data.success) {
    // Éxito: puedes mostrar un mensaje o pasar a la siguiente pantalla
    alert('¡Partida guardada con éxito!');
  } else {
    // Error: muestra el mensaje del backend al usuario
    alert('Error: ' + data.mensaje);
  }
})
.catch((error) => {
  alert('Error de conexión con el servidor.');
});

let activeGameModal = null;

function openOverlayModal(modal) {
  const gameModals = document.querySelectorAll('.modal-overlay'); // Selecciona todos los modales con esta clase
  gameModals.forEach(m => {
    if (m.style.display === 'flex') {
      activeGameModal = m;
      m.style.display = 'none';
    }
  });
  if (modal) modal.style.display = 'flex';
}

function closeOverlayModal(modal) {
  if (modal) modal.style.display = 'none';
  if (activeGameModal) {
    activeGameModal.style.display = 'flex';
    activeGameModal = null;
  }
}

  // --- MODAL DE PERFIL ---
  const btnPerfil = document.getElementById('btn-perfil');
  const cerrarModalPerfil = document.getElementById('cerrar-modal-perfil');
  const btnCambiarImg = document.getElementById('btn-cambiar-img');
  const inputPerfilImg = document.getElementById('input-perfil-img');
  const perfilImgPreview = document.getElementById('perfil-img-preview');

  if (btnPerfil) {
      btnPerfil.addEventListener('click', () => openOverlayModal(modalPerfil));
  }
  if (cerrarModalPerfil) {
      cerrarModalPerfil.addEventListener('click', () => closeOverlayModal(modalPerfil));
  }
  if (btnCambiarImg) {
      btnCambiarImg.addEventListener('click', () => {
        if (inputPerfilImg) inputPerfilImg.click();
      });
  }

  if (inputPerfilImg) {
      inputPerfilImg.addEventListener('change', (e) => {
          if (e.target.files && e.target.files[0]) {
              const reader = new FileReader();
              reader.onload = (event) => {
                  if (perfilImgPreview) perfilImgPreview.src = event.target.result;
              };
              reader.readAsDataURL(e.target.files[0]);
          }
      });
  }

  // --- MODAL DE RANKING ---
  const btnRanking = document.getElementById('btn-ranking');
  const cerrarModalRanking = document.getElementById('cerrar-modal-ranking');
  const tablaRankingBody = document.querySelector('#tabla-ranking tbody');

  function cargarRanking() {
      if (!tablaRankingBody) return;
      tablaRankingBody.innerHTML = '';

      fetch('/controller/obtenerRanking.php', {credentials: 'include'})
          .then(response => response.json())
          .then(data => {
              if (data.success) {
                  const scoreRanking = data.ranking.score || [];
                  scoreRanking.forEach((item, index) => {
                      const row = document.createElement('tr');
                      row.innerHTML = `
                          <td>${index + 1}</td>
                          <td>${item.jugador}</td>
                          <td>${item.valor} pts</td>
                      `;
                      tablaRankingBody.appendChild(row);
                  });

                  if (scoreRanking.length > 0 && (data.ranking.time || []).length > 0) {
                      const separatorRow = document.createElement('tr');
                      separatorRow.innerHTML = `<td colspan="3" style="text-align: center; font-weight: bold; background-color: rgba(255,255,255,0.1);">--- Ranking por Tiempo ---</td>`;
                      tablaRankingBody.appendChild(separatorRow);
                  }

                  const timeRanking = data.ranking.time || [];
                  timeRanking.forEach((item, index) => {
                      const row = document.createElement('tr');
                      row.innerHTML = `
                          <td>${index + 1}</td>
                          <td>${item.jugador}</td>
                          <td>${formatTime(item.valor)}</td>
                      `;
                      tablaRankingBody.appendChild(row);
                  });

              } else {
                  console.error('Error al obtener ranking:', data.mensaje);
                  tablaRankingBody.innerHTML = `<tr><td colspan="3">Error al cargar el ranking: ${data.mensaje}</td></tr>`;
              }
          })
          .catch(error => {
              console.error('Error en la solicitud de ranking:', error);
              tablaRankingBody.innerHTML = `<tr><td colspan="3">Error de conexión al cargar el ranking.</td></tr>`;
          });
  }

  if (btnRanking) {
      btnRanking.addEventListener('click', () => {
          cargarRanking();
          openOverlayModal(modalRanking);
      });
  }

  if (cerrarModalRanking) {
      cerrarModalRanking.addEventListener('click', () => closeOverlayModal(modalRanking));
  }

  window.addEventListener('click', (e) => {
      if (e.target === modalPerfil) closeOverlayModal(modalPerfil);
      if (e.target === modalRanking) closeOverlayModal(modalRanking);
  });

  inicializarJuegoMapa();

let draggedPiece = null;

// Load audio files
const clickSound = new Audio('audios/click.wav');
const errorSound = new Audio('audios/error.ogg');
const successSound = new Audio('audios/success.wav');

function randomizePiecePosition(piece, containerWidth, containerHeight) {
  const padding = 20; // Padding from the container edges
  const effectiveWidth = containerWidth - 2 * padding;
  const effectiveHeight = containerHeight - 2 * padding;

  const randomX = padding + Math.random() * (effectiveWidth - piece.offsetWidth);
  const randomY = padding + Math.random() * (effectiveHeight - piece.offsetHeight);
  const randomRotation = Math.random() * 360;

  piece.style.left = `${randomX}px`;
  piece.style.top = `${randomY}px`;
  piece.style.transform = `rotate(${randomRotation}deg)`;
}

function dragStart(e) {
  draggedPiece = e.target;
  draggedPiece.style.zIndex = 1000; // Bring to front
  resetBordersOnDragStart();
  clickSound.play();
}

function dragOver(e) {
  e.preventDefault(); // Necesario para permitir drop
}

function drop(e) {
  e.preventDefault();

  const target = e.target;

  // If dropping onto a slot (board)
  if (target.classList.contains("slot") && !target.hasChildNodes()) {
    // Clear incorrect-slot from previous parent if it was a slot
    if (draggedPiece.parentNode && draggedPiece.parentNode.classList.contains("slot")) {
      draggedPiece.parentNode.classList.remove("incorrect-slot");
      draggedPiece.parentNode.classList.remove("correct-slot"); // Also remove correct-slot
    }

    target.appendChild(draggedPiece);
    draggedPiece.style.position = 'static'; // Reset position for slot
    draggedPiece.style.transform = 'none'; // Reset rotation
    draggedPiece.style.left = '0';
    draggedPiece.style.top = '0';
    draggedPiece.style.zIndex = 'auto';

    // Check for correctness and apply border class
    if (target.dataset.pos === draggedPiece.dataset.pos) {
      target.classList.add("correct-slot");
      target.classList.remove("incorrect-slot");
      successSound.play();
    } else {
      target.classList.add("incorrect-slot");
      errorSound.play();
    }

    checkWin();
  } else if (target.id === "pieces" || target.classList.contains("piece")) { // If dropping onto piecesContainer or another piece within it
    // Clear incorrect-slot from previous parent if it was a slot
    if (draggedPiece.parentNode && draggedPiece.parentNode.classList.contains("slot")) {
      draggedPiece.parentNode.classList.remove("incorrect-slot");
      draggedPiece.parentNode.classList.remove("correct-slot"); // Also remove correct-slot
    }

    const piecesContainer = document.getElementById("pieces");
    piecesContainer.appendChild(draggedPiece);
    randomizePiecePosition(draggedPiece, piecesContainer.offsetWidth, piecesContainer.offsetHeight);
    draggedPiece.style.zIndex = 'auto';
  }
}

function resetBordersOnDragStart() {
  const slots = document.querySelectorAll(".slot");
  slots.forEach(slot => {
    slot.classList.remove("correct-slot"); 
  });
}

function checkWin() {
  const slots = document.querySelectorAll(".slot");
  let correct = 0;
  slots.forEach(slot => {
    if (
      slot.hasChildNodes() &&
      slot.dataset.pos === slot.firstChild.dataset.pos
    ) {
      correct++;
    }
  });

  if (correct === 36) {
    const boardContainer = document.getElementById("board");
    const mainTitle = document.getElementById("main-title");
    const piecesTitle = document.getElementById("pieces-title");
    const boardTitle = document.getElementById("board-title");
    const piecesContainer = document.getElementById("pieces");
    const subtitle = document.getElementById("subtitle");

    // Hide existing elements
    boardContainer.style.transition = "opacity 2s ease-out, transform 2s ease-out";
    boardContainer.style.opacity = 0;
    boardContainer.style.transform = "scale(0.8)";
    mainTitle.style.transition = "opacity 2s ease-out";
    mainTitle.style.opacity = 0;
    // piecesTitle.style.transition = "opacity 2s ease-out";
    // piecesTitle.style.opacity = 0;
    boardTitle.style.transition = "opacity 2s ease-out";
    boardTitle.style.opacity = 0;
    piecesContainer.style.transition = "opacity 2s ease-out";
    piecesContainer.style.opacity = 0;
    subtitle.style.transition = "opacity 2s ease-out";
    subtitle.style.opacity = 0;

    setTimeout(() => {
      boardContainer.style.visibility = "hidden";
      mainTitle.style.visibility = "hidden";
      // piecesTitle.style.visibility = "hidden";
      boardTitle.style.visibility = "hidden";
      piecesContainer.style.visibility = "hidden";
      subtitle.style.visibility = "hidden";

      // Change background
      document.body.classList.add('fondo-piedra2');
      

      // Display victory message
      const victoryMessage = document.createElement("h1");
      victoryMessage.textContent = "¡Enhorabuena, has completado el mapa!";
      victoryMessage.style.opacity = 0;
      victoryMessage.style.transition = "opacity 2s ease-in";
      document.body.appendChild(victoryMessage);

      // Simple confetti effect (CSS based)
      const confetti = document.createElement("div");
      confetti.classList.add("confetti");
      document.body.appendChild(confetti);

      setTimeout(() => {
        victoryMessage.style.opacity = 1;
        confetti.style.opacity = 1; // Make confetti visible
      }, 100); // Small delay to allow elements to be appended

      sendGameResult(); 

    }, 2000); // Match the CSS transition duration
  }
}

function mostrarTransicionMapaCompleto() {
  // Selecciona todos los elementos principales excepto el body
  const elementosOcultar = [
    document.getElementById('main-title'),
    document.getElementById('subtitle'),
    document.querySelector('.puzzle-wrapper'),
  ].filter(Boolean);

   // Desvanece los elementos
  elementosOcultar.forEach(el => {
    el.style.transition = 'opacity 1.5s cubic-bezier(.4,0,.2,1)';
    el.style.opacity = '0';
  });

  // Espera a que termine el desvanecimiento antes de ocultar y cambiar el fondo
  setTimeout(() => {
    elementosOcultar.forEach(el => {
      el.style.visibility = 'hidden';
    });

    // Cambia el fondo con transición suave usando la clase CSS
    document.body.classList.add('fondo-piedra2');

    // Crea el botón "Examinar Mapa" y lo muestra suavemente
    const btnExaminar = document.createElement('button');
    btnExaminar.id = 'btn-examinar-mapa';
    btnExaminar.textContent = 'Examinar Mapa';
    btnExaminar.className = 'btn-pista-primario btn-primary-gradient';
    btnExaminar.style.opacity = '0';
    btnExaminar.style.transition = 'opacity 1.5s cubic-bezier(.4,0,.2,1)';
    document.body.appendChild(btnExaminar);

    setTimeout(() => {
      btnExaminar.style.opacity = '1';
    }, 100); // Pequeño retardo para activar la transición

  }, 1600); // Espera a que termine el fade-out antes de cambiar el fondo y mostrar el botón
}};
