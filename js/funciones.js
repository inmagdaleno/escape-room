document.addEventListener("DOMContentLoaded", () => {
  // Elementos de la interfaz
  const btnComenzar = document.getElementById("btn-comenzar");
  const scoreDisplay = document.getElementById("score");
  const timerDisplay = document.getElementById("timer");
  const scoreFinalDisplay = document.getElementById("score-final");
  const btnPistaExtra = document.getElementById("btn-pista-extra");
  const btnReiniciar = document.getElementById("btn-reiniciar");

  // Pantallas
  const pantallaBienvenida = document.getElementById("pantalla-bienvenida");
  const pantallaModoJuego = document.getElementById("pantalla-modo-juego");
  const escenaPlaya = document.getElementById("escena-playa");
  const escenaJungla = document.getElementById("escena-jungla");
  const pantallaFinal = document.getElementById("pantalla-final");

  // Modales
  const modalPista = document.getElementById("modal-pista");
  const cerrarModalPista = document.getElementById("cerrar-modal-pista");
  const pistaImg = document.getElementById("pista-img");
  const feedbackPista = document.getElementById("feedback-pista");
  const btnSegundaPista = document.getElementById("btn-segunda-pista");
  const btnCerrarPista = document.getElementById("btn-cerrar-pista"); // Corregido el ID

  // Botones de selección de modo
  const btnModoPuntuacion = document.getElementById("btn-modo-puntuacion");
  const btnModoTiempo = document.getElementById("btn-modo-tiempo");

  // Estado del juego
  let gameMode = ""; // 'score' o 'time'
  let score = 400;
  let timeLeft = 30 * 60; // 30 minutos en segundos
  let timerInterval;
  let pistasUsadasPuzzle = 0; // Pistas usadas en el puzzle actual
  let totalPistasUsadas = 0; // Pistas usadas en todo el juego
  let puzzleActual = "";

  // --- INICIALIZACIÓN DEL JUEGO ---
  function inicializarJuego() {
    score = 400;
    timeLeft = 30 * 60; // 30 minutos en segundos
    totalPistasUsadas = 0;
    if (scoreDisplay) scoreDisplay.textContent = score;
    updateTimerDisplay();
    clearInterval(timerInterval);

    cambiarPantalla(null, pantallaBienvenida);
    if (modalPista) modalPista.style.display = "none";
    const scoreContainer = document.getElementById("score-container");
    if (scoreContainer) scoreContainer.style.display = "none";
    const timerContainer = document.getElementById("timer-container");
    if (timerContainer) timerContainer.style.display = "none";
    if (btnPistaExtra) btnPistaExtra.style.display = "none";
  }

  // --- NAVEGACIÓN ENTRE PANTALLAS ---
  function cambiarPantalla(pantallaOcultar, pantallaMostrar) {
    console.log(`Cambiando pantalla de ${pantallaOcultar ? pantallaOcultar.id : 'ninguna'} a ${pantallaMostrar.id}`);
    if (pantallaOcultar) pantallaOcultar.classList.remove("visible");
    pantallaMostrar.classList.add("visible");

    if (pantallaMostrar !== pantallaBienvenida && pantallaMostrar !== pantallaModoJuego && pantallaMostrar !== pantallaFinal) {
      if (btnPistaExtra) btnPistaExtra.style.display = "flex";
      const scoreContainer = document.getElementById("score-container");
      const timerContainer = document.getElementById("timer-container");
      if (gameMode === 'score') {
        if (scoreContainer) scoreContainer.style.display = "block";
        if (timerContainer) timerContainer.style.display = "none";
      } else if (gameMode === 'time') {
        if (scoreContainer) scoreContainer.style.display = "none";
        if (timerContainer) timerContainer.style.display = "block";
      }
    } else {
      if (btnPistaExtra) btnPistaExtra.style.display = "none";
      const scoreContainer = document.getElementById("score-container");
      const timerContainer = document.getElementById("timer-container");
      if (scoreContainer) scoreContainer.style.display = "none";
      if (timerContainer) timerContainer.style.display = "none";
    }
  }

  // --- LÓGICA DEL TEMPORIZADOR ---
  function startTimer() {
    timerInterval = setInterval(() => {
      timeLeft--;
      updateTimerDisplay();
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        alert("¡Se acabó el tiempo! Fin del juego.");
        inicializarJuego();
      }
    }, 1000);
  }

  window.updateTimerDisplay = function() {
    if (timerDisplay) timerDisplay.textContent = window.formatTime(window.timeLeft);
  }

  window.formatTime = function(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  // --- FUNCIÓN PARA ENVIAR RESULTADOS DE LA PARTIDA ---
  window.sendGameResult = function() {
    const gameData = {
      modo_juego: window.gameMode,
      pistas_usadas: window.totalPistasUsadas,
      resultado: 1 // 1 para partida completada
    };

    if (window.gameMode === 'score') {
      gameData.puntuacion_final = window.score;
      gameData.tiempo_restante_final = null;
    } else if (window.gameMode === 'time') {
      gameData.puntuacion_final = null;
      gameData.tiempo_restante_final = window.timeLeft;
    }
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
}

  // --- GESTIÓN DE MODALES SUPERPUESTOS ---
  let activeGameModal = null;

  function openOverlayModal(modal) {
    const modal1 = document.getElementById("modal1");
    const modalPista = document.getElementById("modal-pista");

    if (modal === modalPista && modal1 && modal1.style.display === 'flex') {
      activeGameModal = modal1;
      modal1.style.display = 'none';
    } else {
      // Ocultar temporalmente otros modales de juego activos
      const gameModals = document.querySelectorAll('.game-modal');
      gameModals.forEach(m => {
        if (m.style.display === 'flex') {
          activeGameModal = m;
          m.style.display = 'none';
        }
      });
    }
    if (modal) modal.style.display = 'flex';
  }

  function closeOverlayModal(modal) {
    if (modal) modal.style.display = 'none';
    // Restaurar el modal de juego si había uno activo
    if (activeGameModal) {
      activeGameModal.style.display = 'flex';
      activeGameModal = null;
    }
  }

  // --- MODAL DE PERFIL ---
  const btnPerfil = document.getElementById('btn-perfil');
  const modalPerfil = document.getElementById('modal-perfil');
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
  const modalRanking = document.getElementById('modal-ranking');
  const cerrarModalRanking = document.getElementById('cerrar-modal-ranking');
  const tablaRankingBody = document.querySelector('#tabla-ranking tbody');

  function cargarRanking() {
      if (!tablaRankingBody) return;
      tablaRankingBody.innerHTML = ''; // Limpiar tabla

      fetch('controller/obtenerRanking.php')
          .then(response => response.json())
          .then(data => {
              if (data.success) {
                  // Ranking por Puntuación
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

                  // Separador si hay ambos rankings
                  if (scoreRanking.length > 0 && (data.ranking.time || []).length > 0) {
                      const separatorRow = document.createElement('tr');
                      separatorRow.innerHTML = `<td colspan="3" style="text-align: center; font-weight: bold; background-color: rgba(255,255,255,0.1);">--- Ranking por Tiempo ---</td>`;
                      tablaRankingBody.appendChild(separatorRow);
                  }

                  // Ranking por Tiempo
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

  // Cierra los modales si se hace clic fuera de ellos
  window.addEventListener('click', (e) => {
      if (e.target === modalPerfil) closeOverlayModal(modalPerfil);
      if (e.target === modalRanking) closeOverlayModal(modalRanking);
  });

  // --- EVENT LISTENERS PRINCIPALES ---
  // Lógica para el botón "Comenzar la aventura"
  if (btnComenzar) {
    btnComenzar.addEventListener("click", () => {
      console.log("Clic en 'Comenzar la aventura'");
      cambiarPantalla(pantallaBienvenida, escenaPlaya);
    });
  }

  // Lógica para los botones de selección de modo
  if (btnModoPuntuacion) {
    btnModoPuntuacion.addEventListener("click", () => {
      console.log("Clic en 'Modo Puntuación'");
      gameMode = 'score';
      document.getElementById("score-container").style.display = "block";
      document.getElementById("timer-container").style.display = "none";
      cambiarPantalla(pantallaModoJuego, pantallaBienvenida);
    });
  }

  if (btnModoTiempo) {
    btnModoTiempo.addEventListener("click", () => {
      console.log("Clic en 'Modo Contrarreloj'");
      gameMode = 'time';
      document.getElementById("score-container").style.display = "none";
      document.getElementById("timer-container").style.display = "block";
      startTimer(); // Iniciar el temporizador
      cambiarPantalla(pantallaModoJuego, pantallaBienvenida);
    });
  }

  // Lógica para el botón "Jugar de nuevo"
  if (btnReiniciar) {
    btnReiniciar.addEventListener("click", () => {
      inicializarJuego();
    });
  }

  // Iniciar el juego por primera vez
  inicializarJuego();

  const modalIntroduccion = document.getElementById("modal-introduccion");
  const cerrarModalIntroduccion = document.getElementById("cerrar-modal-introduccion");

  if (cerrarModalIntroduccion) {
    cerrarModalIntroduccion.addEventListener("click", () => {
      if (modalIntroduccion) {
        modalIntroduccion.style.display = "none";
        cambiarPantalla(document.getElementById("pantalla-introduccion"), pantallaModoJuego);
      }
    });
  }
});