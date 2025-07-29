document.addEventListener("DOMContentLoaded", () => {
  const puzzles = {
    puzzle1: {
      modal: document.getElementById("modal1"),
      respuesta: "reune las coordenadas",
      btnVer: document.getElementById("btn-ver-papel"),
      btnResolver: document.getElementById("btn-resolver-puzzle1"),
      input: document.getElementById("respuesta-puzzle1"),
      feedback: document.getElementById("feedback-puzzle1"),
      cerrarModal: document.getElementById("cerrar-modal-puzzle1"),
      escenaSiguiente: document.getElementById("escena-jungla"),
    },
    puzzle2: {
      modal: document.getElementById("modal2"),
      respuesta: "unmapa",
      btnVer: document.getElementById("btn-ver-puzzle2"),
      btnResolver: document.getElementById("btn-resolver-puzzle2"),
      input: document.getElementById("respuesta-puzzle2"),
      feedback: document.getElementById("feedback-puzzle2"),
      cerrarModal: document.getElementById("cerrar-modal-puzzle2"),
      escenaSiguiente: document.getElementById("escena-cueva"),
    },
    puzzle3: {
      modal: document.getElementById("modal3"),
      respuesta: "ninguno",
      btnVer: document.getElementById("btn-ver-puzzle3"),
      btnResolver: document.getElementById("btn-resolver-puzzle3"),
      input: document.getElementById("respuesta-puzzle3"),
      feedback: document.getElementById("feedback-puzzle3"),
      cerrarModal: document.getElementById("cerrar-modal-puzzle3"),
      escenaSiguiente: document.getElementById("escena-faro"),
    },
    puzzle4: {
      modal: document.getElementById("modal4"),
      respuesta: "unaaguja",
      btnVer: document.getElementById("btn-ver-puzzle4"),
      btnResolver: document.getElementById("btn-resolver-puzzle4"),
      input: document.getElementById("respuesta-puzzle4"),
      feedback: document.getElementById("feedback-puzzle4"),
      cerrarModal: document.getElementById("cerrar-modal-puzzle4"),
      escenaSiguiente: document.getElementById("pantalla-final"),
    },
  };

  const pistas = {
    puzzle1: ["img/pista1_1.jpg", "img/pista1_2.jpg"],
    puzzle2: ["img/pista2_1.jpg", "img/pista2_2.jpg"],
    puzzle3: ["img/pista3_1.jpg", "img/pista3_2.jpg"],
    puzzle4: ["img/pista4_1.jpg", "img/pista4_2.jpg"],
  };

  // --- LÓGICA DE LOS PUZZLES ---
  function setupPuzzle(puzzleKey) {
    const puzzle = puzzles[puzzleKey];

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
              sendGameResult(); // Enviar resultado al finalizar el juego
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
            timeLeft -= 120; // Resta 2 minutos
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
        timeLeft -= 120; // Resta 2 minutos
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

  if (btnPistaExtra) {
    btnPistaExtra.addEventListener("click", pedirPista);
  }
  if (btnSegundaPista) {
    btnSegundaPista.addEventListener("click", pedirPista);
  }
  if (btnCerrarPista) {
    btnCerrarPista.addEventListener("click", () => (modalPista.style.display = "none"));
  }
  if (cerrarModalPista) {
    cerrarModalPista.addEventListener("click", () => (modalPista.style.display = "none"));
  }
});
