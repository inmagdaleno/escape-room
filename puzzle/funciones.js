document.addEventListener("DOMContentLoaded", () => {
  const piecesContainer = document.getElementById("pieces");
  const boardContainer = document.getElementById("board");
  const btnIrAdelante = document.getElementById("btn-ir-adelante");
  const groupIrAdelante = document.getElementById("group-ir-adelante");

  // Force display for development
  if (groupIrAdelante) groupIrAdelante.style.display = 'flex';

  // Event listener for the new "Ir Adelante" button
  if (btnIrAdelante) {
    btnIrAdelante.addEventListener('click', () => {
      window.location.href = '../index.html#escena-templo'; // Navigate to the temple scene
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
});

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
    piecesTitle.style.transition = "opacity 2s ease-out";
    piecesTitle.style.opacity = 0;
    boardTitle.style.transition = "opacity 2s ease-out";
    boardTitle.style.opacity = 0;
    piecesContainer.style.transition = "opacity 2s ease-out";
    piecesContainer.style.opacity = 0;
    subtitle.style.transition = "opacity 2s ease-out";
    subtitle.style.opacity = 0;

    setTimeout(() => {
      boardContainer.style.display = "none";
      mainTitle.style.display = "none";
      piecesTitle.style.display = "none";
      boardTitle.style.display = "none";
      piecesContainer.style.display = "none";
      subtitle.style.display = "none";

      // Change background
      document.body.style.backgroundImage = "url('img/fondo_piedra2.webp')";
      document.body.style.transition = "background-image 2s ease-in-out";

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

    }, 2000); // Match the CSS transition duration
  }
}