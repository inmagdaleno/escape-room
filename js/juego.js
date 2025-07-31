document.addEventListener("DOMContentLoaded", () => {
  // Elementos de la interfaz
  window.btnComenzar = document.getElementById("btn-comenzar");
  window.scoreDisplay = document.getElementById("score");
  window.timerDisplay = document.getElementById("timer");
  window.scoreFinalDisplay = document.getElementById("score-final");
  window.btnPistaExtra = document.getElementById("btn-pista-extra");
  window.btnReiniciar = document.getElementById("btn-reiniciar");

  // Pantallas
  window.pantallaBienvenida = document.getElementById("pantalla-bienvenida");
  window.pantallaModoJuego = document.getElementById("pantalla-modo-juego");
  window.escenaPlaya = document.getElementById("escena-playa");
  window.escenaJungla = document.getElementById("escena-jungla");
  window.escenaCueva = document.getElementById("escena-cueva");
  window.escenaFaro = document.getElementById("escena-faro");
  window.pantallaFinal = document.getElementById("pantalla-final");

  // Modales
  window.modalPista = document.getElementById("modal-pista");
  window.cerrarModalPista = document.getElementById("cerrar-modal-pista");
  window.pistaImg = document.getElementById("pista-img");
  window.feedbackPista = document.getElementById("feedback-pista");
  window.btnSegundaPista = document.getElementById("btn-segunda-pista");
  window.btnCerrarPista = document.getElementById("btn-cerrar-pista");

  // Botones de selección de modo
  window.btnModoPuntuacion = document.getElementById("btn-modo-puntuacion");
  window.btnModoTiempo = document.getElementById("btn-modo-tiempo");

  // Estado del juego
  window.gameMode = ""; // 'score' o 'time'
  window.score = 400;
  window.timeLeft = 30 * 60; // 30 minutos en segundos
  window.timerInterval;
  window.pistasUsadasPuzzle = 0; // Pistas usadas en el puzzle actual
  window.totalPistasUsadas = 0; // Pistas usadas en todo el juego
  window.puzzleActual = "";

  // --- INICIALIZACIÓN DEL JUEGO ---
  window.inicializarJuego = function() {
    window.score = 400;
    window.timeLeft = 30 * 60; // 30 minutos en segundos
    window.totalPistasUsadas = 0;
    if (window.scoreDisplay) window.scoreDisplay.textContent = window.score;
    window.updateTimerDisplay();
    clearInterval(window.timerInterval);

    window.cambiarPantalla(null, window.pantallaBienvenida);
    // Object.keys(puzzles).forEach(key => {
    //   const puzzle = puzzles[key];
    //   if (puzzle.modal) puzzle.modal.style.display = "none";
    // });
    if (window.modalPista) window.modalPista.style.display = "none";
    const scoreContainer = document.getElementById("score-container");
    if (scoreContainer) scoreContainer.style.display = "none";
    const timerContainer = document.getElementById("timer-container");
    if (timerContainer) timerContainer.style.display = "none";
    if (window.btnPistaExtra) window.btnPistaExtra.style.display = "none";
  }

  // --- NAVEGACIÓN ENTRE PANTALLAS ---
  window.cambiarPantalla = function(pantallaOcultar, pantallaMostrar) {
    console.log(`Cambiando pantalla de ${pantallaOcultar ? pantallaOcultar.id : 'ninguna'} a ${pantallaMostrar.id}`);
    if (pantallaOcultar) pantallaOcultar.classList.remove("visible");
    pantallaMostrar.classList.add("visible");

    if (pantallaMostrar !== window.pantallaBienvenida && pantallaMostrar !== window.pantallaModoJuego && pantallaMostrar !== window.pantallaFinal) {
      if (window.btnPistaExtra) window.btnPistaExtra.style.display = "flex";
      const scoreContainer = document.getElementById("score-container");
      const timerContainer = document.getElementById("timer-container");
      if (window.gameMode === 'score') {
        if (scoreContainer) scoreContainer.style.display = "block";
        if (timerContainer) timerContainer.style.display = "none";
      } else if (window.gameMode === 'time') {
        if (scoreContainer) scoreContainer.style.display = "none";
        if (timerContainer) timerContainer.style.display = "block";
      }
    } else {
      if (window.btnPistaExtra) window.btnPistaExtra.style.display = "none";
      const scoreContainer = document.getElementById("score-container");
      const timerContainer = document.getElementById("timer-container");
      if (scoreContainer) scoreContainer.style.display = "none";
      if (timerContainer) timerContainer.style.display = "none";
    }
  }

  // --- LÓGICA DEL TEMPORIZADOR ---
  '''  window.startTimer = function() {
    const endTime = Date.now() + 30 * 60 * 1000;
    localStorage.setItem('endTime', endTime);

    window.timerInterval = setInterval(() => {
      const remainingTime = endTime - Date.now();
      if (remainingTime <= 0) {
        clearInterval(window.timerInterval);
        document.getElementById('game-over-overlay').classList.remove('oculto');
        document.getElementById('game-over-video').play();
        return;
      }
      window.timeLeft = Math.ceil(remainingTime / 1000);
      window.updateTimerDisplay();
    }, 1000);
  }

  document.getElementById('btn-restart').addEventListener('click', () => {
    localStorage.removeItem('endTime');
    window.location.href = '/index.html';
  });''

  window.updateTimerDisplay = function() {
    if (window.gameMode !== 'time') return;

    const minTens = document.getElementById('minTens');
    const minUnits = document.getElementById('minUnits');
    const secTens = document.getElementById('secTens');
    const secUnits = document.getElementById('secUnits');

    if (!minTens || !minUnits || !secTens || !secUnits) return;

    const minutes = Math.floor(window.timeLeft / 60);
    const seconds = window.timeLeft % 60;

    const minStr = String(minutes).padStart(2, '0');
    const secStr = String(seconds).padStart(2, '0');

    minTens.textContent = minStr[0];
    minUnits.textContent = minStr[1];
    secTens.textContent = secStr[0];
    secUnits.textContent = secStr[1];
  }

  window.formatTime = function(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  

  // --- FUNCIÓN PARA ENVIAR RESULTADOS DE LA PARTIDA ---
  window.sendGameResult = function() {
    const gameData = {
      // !!! IMPORTANTE: Reemplaza 1 con el ID real del usuario logueado
      // Esto debería obtenerse de la sesión del usuario logueado
      id_usuario: 1, 
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

    fetch('controller/guardarPartida.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(gameData),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Respuesta del servidor al guardar partida:', data);
      if (data.success) {
        console.log('Partida guardada con éxito.');
      } else {
        console.error('Error al guardar partida:', data.mensaje);
      }
    })
    .catch((error) => {
      console.error('Error en la solicitud de guardar partida:', error);
    });
  }

  // --- GESTIÓN DE MODALES SUPERPUESTOS ---
  let activeGameModal = null;

  window.openOverlayModal = function(modal) {
    console.log('Attempting to open modal:', modal ? modal.id : 'null');
    // Ocultar temporalmente el modal de juego activo
    const gameModals = document.querySelectorAll('.game-modal');
    gameModals.forEach(m => {
      if (m.style.display === 'flex') {
        activeGameModal = m;
        m.style.display = 'none';
      }
    });
    if (modal) modal.style.display = 'flex';
  }

  window.closeOverlayModal = function(modal) {
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

      fetch('controller/obtenerRanking.php', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      })
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

  const btnPistaExtraModal1 = document.getElementById('btn-pista-extra-modal1');
  const modalPista = document.getElementById('modal-pista');
  const cerrarModalPista = document.getElementById('cerrar-modal-pista');
  const pistaExplicacion = document.getElementById('pista-explicacion');

  if (btnPistaExtraModal1 && modalPista) {
    btnPistaExtraModal1.addEventListener('click', () => {
      // Cambia el mensaje según el modo de juego
      if (window.gameMode === 'time') {
        pistaExplicacion.textContent = 'Para este acertijo dispones de 1 pista extra. Pero su uso supondrá una penalización de 1 minuto en tu tiempo restante.';
      } else {
        pistaExplicacion.textContent = 'Para este acertijo dispones de 1 pista extra. Pero su uso supondrá una penalización de 20 puntos en tu puntuación.';
      }
      // Centrar y mostrar el modal de pista
      modalPista.style.display = 'flex';
      modalPista.classList.remove('oculto');
      document.body.style.overflow = 'hidden';
    });
  }

  if (cerrarModalPista && modalPista) {
    cerrarModalPista.addEventListener('click', () => {
      modalPista.style.display = 'none';
      modalPista.classList.add('oculto');
      document.body.style.overflow = '';
    });
  }

  // Cerrar modal si se hace clic fuera del contenido
  if (modalPista) {
    modalPista.addEventListener('click', (e) => {
      if (e.target === modalPista) {
        modalPista.style.display = 'none';
        modalPista.classList.add('oculto');
        document.body.style.overflow = '';
      }
    });
  }

  const btnDescartarPista = document.getElementById('btn-descartar-pista');

  if (btnDescartarPista && modalPista) {
    btnDescartarPista.addEventListener('click', () => {
      modalPista.style.display = 'none';
      modalPista.classList.add('oculto');
      document.body.style.overflow = '';
    });
  }

  // Cierra los modales si se hace clic fuera de ellos
  window.addEventListener('click', (e) => {
      if (e.target === window.modalPerfil) window.closeOverlayModal(window.modalPerfil);
      if (e.target === window.modalRanking) window.closeOverlayModal(window.modalRanking);
      if (e.target === window.modalPista) window.closeOverlayModal(window.modalPista);
  });

  // Event listener para el botón global de Pistas Extras
  if (window.btnPistaExtra) {
    window.btnPistaExtra.addEventListener('click', () => {
      console.log('btnPistaExtra clicked. modalPista is:', window.modalPista);
      window.openOverlayModal(window.modalPista);
    });
  }

  // --- EVENT LISTENERS PRINCIPALES ---
  // Lógica para el botón "Comenzar la aventura"
  if (btnComenzar) {
    btnComenzar.addEventListener("click", () => {
      console.log("Clic en 'Comenzar la aventura'");
      // Redirigir directamente a la playa en modo puntuación por defecto
      gameMode = 'score';
      document.getElementById("score-container").style.display = "block";
      document.getElementById("timer-container").style.display = "none";
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
      cambiarPantalla(pantallaModoJuego, escenaPlaya);
    });
  }

  if (btnModoTiempo) {
    btnModoTiempo.addEventListener("click", () => {
      console.log("Clic en 'Modo Contrarreloj'");
      gameMode = 'time';
      document.getElementById("score-container").style.display = "none";
      document.getElementById("timer-container").style.display = "block";
      startTimer(); // Iniciar el temporizador
      cambiarPantalla(pantallaModoJuego, escenaPlaya);
    });
  }

  // Lógica para el botón "Jugar de nuevo"
  if (btnReiniciar) {
    btnReiniciar.addEventListener("click", () => {
      inicializarJuego();
    });
  }

  // Lógica para el botón "Examinar tablero" (Sudoku)
  const btnIrSudoku = document.getElementById("btn-ir-sudoku");
  if (btnIrSudoku) {
    btnIrSudoku.addEventListener("click", () => {
      window.location.href = "sudoku/sudoku.html";
    });
  }

  // Iniciar el juego por primera vez
  inicializarJuego();

  const btnConfirmarPista = document.getElementById('btn-confirmar-pista');
  const modalPistaImagen = document.getElementById('modal-pista-imagen');
  const btnCerrarPistaImagen = document.getElementById('btn-cerrar-pista-imagen');
  const cerrarModalPistaImagen = document.getElementById('cerrar-modal-pista-imagen');

  if (btnConfirmarPista) {
    btnConfirmarPista.addEventListener('click', () => {
      // Penalización según el modo de juego
      if (window.gameMode === 'time') {
        // Restar 1 minuto (60 segundos)
        window.timeLeft = Math.max(0, window.timeLeft - 60);
        window.updateTimerDisplay && window.updateTimerDisplay();
      } else if (window.gameMode === 'score') {
        // Restar 20 puntos
        window.score = Math.max(0, window.score - 20);
        if (window.scoreDisplay) window.scoreDisplay.textContent = window.score;
      }
      // Puedes mostrar feedback si quieres
      const feedbackPista = document.getElementById('feedback-pista');
      if (feedbackPista) {
        feedbackPista.textContent = '¡Has usado una pista! Se ha aplicado la penalización.';
        feedbackPista.classList.remove('success', 'error');
        feedbackPista.classList.add('warning');
      }
      // Cerrar el modal tras un breve retardo
      setTimeout(() => {
        const modalPista = document.getElementById('modal-pista');
        if (modalPista) {
          modalPista.style.display = 'none';
          modalPista.classList.add('oculto');
          document.body.style.overflow = '';
        }
        if (feedbackPista) feedbackPista.textContent = '';
      }, 1200);
      // Mostrar el modal de la imagen de pista extra
      setTimeout(() => {
        modalPistaImagen.style.display = 'flex';
        modalPistaImagen.classList.remove('oculto');
        document.body.style.overflow = 'hidden';
      }, 1200); // tras mostrar el feedback y cerrar el modal anterior
    });
  }

  function cerrarModalImagenPista() {
    modalPistaImagen.style.display = 'none';
    modalPistaImagen.classList.add('oculto');
    document.body.style.overflow = '';
  }

  if (btnCerrarPistaImagen) {
    btnCerrarPistaImagen.addEventListener('click', cerrarModalImagenPista);
  }
  if (cerrarModalPistaImagen) {
    cerrarModalPistaImagen.addEventListener('click', cerrarModalImagenPista);
  }
  // Cerrar si se hace clic fuera del contenido
  if (modalPistaImagen) {
    modalPistaImagen.addEventListener('click', (e) => {
      if (e.target === modalPistaImagen) cerrarModalImagenPista();
    });
  }

  // Cambia la pantalla según el hash de la URL
  function mostrarPantallaSegunHash() {
    // Oculta todas las pantallas
    document.querySelectorAll('.pantalla').forEach(sec => sec.classList.remove('visible'));
    // Lee el hash
    const hash = window.location.hash.replace('#', '');
    // Busca la sección correspondiente
    const seccion = document.getElementById(hash);
    if (seccion) {
      seccion.classList.add('visible');
    } else {
      // Si no existe, muestra la pantalla de bienvenida por defecto
      document.getElementById('pantalla-bienvenida').classList.add('visible');
    }
  }

  // Escucha cambios de hash y al cargar la página
  window.addEventListener('DOMContentLoaded', mostrarPantallaSegunHash);
  window.addEventListener('hashchange', mostrarPantallaSegunHash);

  // Si vuelves de sudoku.html y pulsas "Continuar", cambia el hash y muestra la jungla
  const btnContinuarSudoku = document.getElementById('btn-continuar-sudoku');
  if (btnContinuarSudoku) {
    btnContinuarSudoku.addEventListener('click', function() {
      window.location.hash = 'escena-jungla';
      mostrarPantallaSegunHash();
    });
  }
});