document.addEventListener("DOMContentLoaded", () => {
  // --- ELEMENTOS DE LA INTERFAZ ---
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
  const btnCerrarPista = document.getElementById("btn-cerrar-pista");

  // Botones de selección de modo
  const btnModoPuntuacion = document.getElementById("btn-modo-puntuacion");
  const btnModoTiempo = document.getElementById("btn-modo-tiempo");

  // Ranking
  const btnRanking = document.getElementById('btn-ranking');
  const modalRanking = document.getElementById('modal-ranking');
  const cerrarModalRanking = document.getElementById('cerrar-modal-ranking');
  const tablaRankingBody = document.querySelector('#tabla-ranking tbody');

  // Perfil
  const btnPerfil = document.getElementById('btn-perfil');
  const modalPerfil = document.getElementById('modal-perfil');
  const cerrarModalPerfil = document.getElementById('cerrar-modal-perfil');
  const btnCambiarImg = document.getElementById('btn-cambiar-img');
  const inputPerfilImg = document.getElementById('input-perfil-img');
  const perfilImgPreview = document.getElementById('perfil-img-preview');

  // Estado del juego
  let gameMode = ""; // 'score' o 'time'
  let score = 400;
  let timeLeft = 30 * 60; // 30 minutos en segundos
  let timerInterval;
  let pistasUsadasPuzzle = 0; // Pistas usadas en el puzzle actual
  let totalPistasUsadas = 0; // Pistas usadas en todo el juego
  let puzzleActual = "";

  // --- PUZZLES Y PISTAS ---
  const puzzles = {
    puzzle1: {
      modal: document.getElementById("modal1"),
      respuesta: "trece cuadrados en zeta",
      btnVer: document.getElementById("btn-ver-papel"),
      btnResolver: document.getElementById("btn-resolver-puzzle1"),
      input: document.getElementById("respuesta-puzzle1"),
      feedback: document.getElementById("feedback-puzzle1"),
      cerrarModal: document.getElementById("cerrar-modal-puzzle1"),
      escenaSiguiente: document.getElementById("escena-templo"),
    },
    // Puedes añadir más puzzles aquí
  };

  const pistas = {
    puzzle1: ["img/pista1_1.jpg", "img/pista1_2.jpg"],
    puzzle2: ["img/pista2_1.jpg", "img/pista2_2.jpg"],
    puzzle3: ["img/pista3_1.jpg", "img/pista3_2.jpg"],
    puzzle4: ["img/pista4_1.jpg", "img/pista4_2.jpg"],
  };

  // --- INICIALIZACIÓN DEL JUEGO ---
  function inicializarJuego() {
    score = 400;
    timeLeft = 30 * 60;
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
    if (pantallaOcultar) pantallaOcultar.classList.remove("visible");
    pantallaMostrar.classList.add("visible");

    const scoreContainer = document.getElementById("score-container");
    const timerContainer = document.getElementById("timer-container");
    if (pantallaMostrar !== pantallaBienvenida && pantallaMostrar !== pantallaModoJuego && pantallaMostrar !== pantallaFinal) {
      if (btnPistaExtra) btnPistaExtra.style.display = "flex";
      if (gameMode === 'score') {
        if (scoreContainer) scoreContainer.style.display = "block";
        if (timerContainer) timerContainer.style.display = "none";
      } else if (gameMode === 'time') {
        if (scoreContainer) scoreContainer.style.display = "none";
        if (timerContainer) timerContainer.style.display = "block";
      }
    } else {
      if (btnPistaExtra) btnPistaExtra.style.display = "none";
      if (scoreContainer) scoreContainer.style.display = "none";
      if (timerContainer) timerContainer.style.display = "none";
    }
  }

  // --- TEMPORIZADOR ---
  function startTimer() {
    clearInterval(timerInterval);
    const endTime = Date.now() + 30 * 60 * 1000;
    localStorage.setItem('endTime', endTime);

    timerInterval = setInterval(() => {
      const remainingTime = endTime - Date.now();
      if (remainingTime <= 0) {
        clearInterval(timerInterval);
        const overlay = document.getElementById('game-over-overlay');
        const video = document.getElementById('game-over-video');
        if (overlay) overlay.classList.remove('oculto');
        if (video) video.play();
        return;
      }
      timeLeft = Math.ceil(remainingTime / 1000);
      updateTimerDisplay();
    }, 1000);
  }

  function updateTimerDisplay() {
    if (timerDisplay) timerDisplay.textContent = formatTime(timeLeft);
  }

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  // --- ENVIAR RESULTADOS DE LA PARTIDA ---
  function sendGameResult() {
    const gameData = {
      modo_juego: gameMode,
      pistas_usadas: totalPistasUsadas,
      resultado: 1
    };
    if (gameMode === 'score') {
      gameData.puntuacion_final = score;
      gameData.tiempo_restante_final = null;
    } else if (gameMode === 'time') {
      gameData.puntuacion_final = null;
      gameData.tiempo_restante_final = timeLeft;
    }
    fetch('/controller/guardarPartida.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(gameData),
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert('¡Partida guardada con éxito!');
      } else {
        alert('Error: ' + data.mensaje);
      }
    })
    .catch(() => {
      alert('Error de conexión con el servidor.');
    });
  }

  // --- LÓGICA DE LOS PUZZLES ---
  function setupPuzzle(puzzleKey) {
    const puzzle = puzzles[puzzleKey];
    if (!puzzle) return;

    if (puzzle.btnVer) {
      puzzle.btnVer.addEventListener("click", () => {
        puzzleActual = puzzleKey;
        pistasUsadasPuzzle = 0;
        if (puzzle.modal) puzzle.modal.style.display = "flex";
        if (puzzle.input) puzzle.input.value = "";
        if (puzzle.feedback) puzzle.feedback.style.display = "none";
      });
    }

    if (puzzle.cerrarModal) {
      puzzle.cerrarModal.addEventListener("click", () => {
        if (puzzle.modal) puzzle.modal.style.display = "none";
      });
    }

    if (puzzle.btnResolver) {
      puzzle.btnResolver.addEventListener("click", () => {
        if (puzzle.input && puzzle.input.value.trim().toLowerCase() === puzzle.respuesta) {
          if (puzzle.feedback) {
            puzzle.feedback.textContent = "¡Correcto!";
            puzzle.feedback.className = "success";
            puzzle.feedback.style.display = "block";
          }
          setTimeout(() => {
            if (puzzle.modal) puzzle.modal.style.display = "none";
            const pantallaActual = puzzle.btnVer.closest(".pantalla");
            cambiarPantalla(pantallaActual, puzzle.escenaSiguiente);
            if (puzzle.escenaSiguiente === pantallaFinal) {
              sendGameResult();
              if (gameMode === 'score') {
                if (totalPistasUsadas === 0) {
                  score += 100;
                  alert("¡Felicidades! Has completado el juego sin usar pistas y ganas 100 puntos de bonus.");
                }
                if (scoreFinalDisplay) scoreFinalDisplay.textContent = score;
              } else if (gameMode === 'time') {
                clearInterval(timerInterval);
                if (scoreFinalDisplay) scoreFinalDisplay.textContent = formatTime(timeLeft);
              }
            }
          }, 1500);
        } else {
          if (gameMode === 'score') {
            score -= 10;
            if (scoreDisplay) scoreDisplay.textContent = score;
            if (puzzle.feedback) puzzle.feedback.textContent = "Incorrecto, prueba de nuevo. Has perdido 10 puntos.";
          } else if (gameMode === 'time') {
            timeLeft -= 60;
            updateTimerDisplay();
            if (puzzle.feedback) puzzle.feedback.textContent = "Incorrecto, prueba de nuevo. Has perdido 2 minutos.";
            if (timeLeft <= 0) {
              clearInterval(timerInterval);
              alert("¡Se te acabó el tiempo! No te ha dado tiempo a escapar de La Isla Efímera. Ahora quedarás atrapado en una dimensión desconocida hasta el fin de los días");
              inicializarJuego();
              return;
            }
          }
          if (puzzle.feedback) {
            puzzle.feedback.className = "error";
            puzzle.feedback.style.display = "block";
          }
        }
      });
    }
  }
  Object.keys(puzzles).forEach(setupPuzzle);

  // --- LÓGICA DE PISTAS ---
  function pedirPista() {
    if (pistasUsadasPuzzle < 2) {
      const pistaActualSrc = pistas[puzzleActual][pistasUsadasPuzzle];
      if (pistaImg) pistaImg.src = pistaActualSrc;
      if (modalPista) modalPista.style.display = "flex";
      if (gameMode === 'score') {
        score -= 25;
        if (scoreDisplay) scoreDisplay.textContent = score;
      } else if (gameMode === 'time') {
        timeLeft -= 120;
        updateTimerDisplay();
        if (timeLeft <= 0) {
          clearInterval(timerInterval);
          alert("¡Se acabó el tiempo! Fin del juego.");
          inicializarJuego();
          return;
        }
      }
      pistasUsadasPuzzle++;
      totalPistasUsadas++;
      if (feedbackPista) feedbackPista.textContent = "";
      if (btnSegundaPista) btnSegundaPista.style.display = pistasUsadasPuzzle === 1 ? "block" : "none";
    } else {
      if (feedbackPista) feedbackPista.textContent = "Ya has usado todas las pistas para este puzzle.";
      if (pistaImg) pistaImg.src = "";
      if (modalPista) modalPista.style.display = "flex";
      if (btnSegundaPista) btnSegundaPista.style.display = "none";
    }
  }

  if (btnPistaExtra) btnPistaExtra.addEventListener("click", pedirPista);
  if (btnSegundaPista) btnSegundaPista.addEventListener("click", pedirPista);
  if (btnCerrarPista) btnCerrarPista.addEventListener("click", () => (modalPista.style.display = "none"));
  if (cerrarModalPista) cerrarModalPista.addEventListener("click", () => (modalPista.style.display = "none"));

  // --- MODAL DE RANKING ---
  function cargarRanking() {
    if (!tablaRankingBody) return;
    tablaRankingBody.innerHTML = '';
    fetch('/controller/obtenerRanking.php', {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    })
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
        tablaRankingBody.innerHTML = `<tr><td colspan="3">Error al cargar el ranking: ${data.mensaje}</td></tr>`;
      }
    })
    .catch(() => {
      tablaRankingBody.innerHTML = `<tr><td colspan="3">Error de conexión al cargar el ranking.</td></tr>`;
    });
  }

  if (btnRanking) {
    btnRanking.addEventListener('click', () => {
      cargarRanking();
      if (modalRanking) modalRanking.classList.add('visible');
    });
  }
  if (cerrarModalRanking && modalRanking) {
    cerrarModalRanking.addEventListener('click', () => modalRanking.classList.remove('visible'));
  }

  // --- MODAL DE PERFIL (opcional, si tienes esta funcionalidad) ---
  if (btnPerfil && modalPerfil) {
    btnPerfil.addEventListener('click', () => modalPerfil.classList.add('visible'));
  }
  if (cerrarModalPerfil && modalPerfil) {
    cerrarModalPerfil.addEventListener('click', () => modalPerfil.classList.remove('visible'));
  }
  if (btnCambiarImg && inputPerfilImg) {
    btnCambiarImg.addEventListener('click', () => inputPerfilImg.click());
  }
  if (inputPerfilImg && perfilImgPreview) {
    inputPerfilImg.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        const reader = new FileReader();
        reader.onload = (event) => {
          perfilImgPreview.src = event.target.result;
        };
        reader.readAsDataURL(e.target.files[0]);
      }
    });
  }

  // --- EVENTOS PRINCIPALES ---
  if (btnComenzar) {
    btnComenzar.addEventListener("click", () => {
      gameMode = 'score';
      document.getElementById("score-container").style.display = "block";
      document.getElementById("timer-container").style.display = "none";
      cambiarPantalla(pantallaBienvenida, escenaPlaya);
    });
  }
  if (btnModoPuntuacion) {
    btnModoPuntuacion.addEventListener("click", () => {
      gameMode = 'score';
      document.getElementById("score-container").style.display = "block";
      document.getElementById("timer-container").style.display = "none";
      cambiarPantalla(pantallaModoJuego, pantallaBienvenida);
    });
  }
  if (btnModoTiempo) {
    btnModoTiempo.addEventListener("click", () => {
      gameMode = 'time';
      document.getElementById("score-container").style.display = "none";
      document.getElementById("timer-container").style.display = "block";
      startTimer();
      cambiarPantalla(pantallaModoJuego, pantallaBienvenida);
    });
  }
  if (btnReiniciar) {
    btnReiniciar.addEventListener("click", () => {
      inicializarJuego();
    });
  }

  // Iniciar el juego por primera vez
  inicializarJuego();
});