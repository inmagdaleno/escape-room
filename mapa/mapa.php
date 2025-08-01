<?php
session_start();
require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/config/database.php';
 
if (!isset($_SESSION['usuario_id'])) {
    header('Location: /admin/login.php');
    exit;
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Puzzle</title>
  <link rel="stylesheet" href="estilos.css">
  <style>
  @import url('https://fonts.googleapis.com/css2?family=Barriecito&family=Barrio&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');
  </style>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css">
</head>
</head>

<body>

  <!-- Botones de esquina superior derecha -->
  <div class="esquina-superior-derecha">
    <div class="button-group">
      <button id="btn-perfil" class="btn-icono-esquina" title="Perfil de Usuario">
        <i class="fas fa-user"></i>
      </button>
      <span class="button-label">USUARIO</span>
    </div>
    <div class="button-group">
      <button id="btn-ranking" class="btn-icono-esquina" title="Ranking">
        <i class="fas fa-trophy"></i>
      </button>
      <span class="button-label">RANKING</span>
    </div>
  </div>

  <!-- Modal para Perfil de Usuario -->
  <div id="modal-perfil" class="modal-overlay">
    <div class="modal-contenido">
      <span class="cerrar" id="cerrar-modal-perfil">&times;</span>
      <h2>Perfil de Usuario</h2>
      <span><?php echo htmlspecialchars($_SESSION['nombre']); ?></span>
      <form id="form-perfil">
        <div class="perfil-img-container">
          <img id="perfil-img-preview" src="../img/avatar.webp" alt="Imagen de perfil">
          <input type="file" id="input-perfil-img" accept="image/*" style="display: none;">
          <button type="button" id="btn-cambiar-img" class="btn-pista-secundario">Cambiar Imagen</button>
        </div>
        <div class="form-grupo">
          <label for="perfil-nombre">Nombre:</label>
          <input type="text" id="perfil-nombre" name="nombre" placeholder="Tu nombre">
        </div>
        <div class="form-grupo">
          <label for="perfil-email">Email:</label>
          <input type="email" id="perfil-email" name="email" placeholder="Tu correo electrónico">
        </div>
        <button type="submit" id="btn-guardar-perfil" class="btn-pista-primario btn-primary-gradient">Guardar Cambios</button>
      </form>
    </div>
  </div>

  <!-- Modal para Ranking -->
  <div id="modal-ranking" class="modal-overlay">
    <div class="modal-contenido">
      <span class="cerrar" id="cerrar-modal-ranking">&times;</span>
      <h2>Ranking de Jugadores</h2>
      <table id="tabla-ranking">
        <thead>
          <tr>
            <th>Puesto</th>
            <th>Jugador</th>
            <th>Puntuación</th>
          </tr>
        </thead>
        <tbody>
          <!-- Las filas del ranking se insertarán aquí con JavaScript -->
        </tbody>
      </table>
    </div>
  </div>

  <!-- Score Display -->
  <div id="score-container">Puntuación: <span id="score">100</span></div>
  <div id="timer-container" style="display: none;">Tiempo: <span id="timer">30:00</span></div>

  <!-- Botón para Volver Atrás -->

  <div class="esquina-superior-izquierda">
    <div class="button-group" id="group-ir-atras">
      <button id="btn-volver-atras" class="btn-icono-esquina" onclick="history.back()">
        <i class="fa-solid fa-arrow-left"></i>
      </button>
      <span class="button-label">ATRÁS</span>
    </div>

    <!-- Botón para Ir Adelante -->
    <div class="button-group" id="group-ir-adelante">
      <button id="btn-ir-adelante" class="btn-icono-esquina" title="Ir Adelante">
        <i class="fa-solid fa-arrow-right"></i>
      </button>
      <span class="button-label">ADELANTE</span>
    </div>
  </div>

  <h1 id="main-title">El mapa de los Secretos</h1>
  <p id="subtitle">Reconstruye el mapa arrastrando las piezas hasta el tablero. <br> Una vez completado, importantes secretos de esta isla serán desvelados</p>

  <div class="puzzle-wrapper">
    <div id="pieces-section">
      <div id="pieces" class="pieces-container"></div>
    </div>
    <div id="board-section">
      <div id="board" class="board-container"></div>
    </div>
  </div>

   <!-- Modal Mapa -->
    <div id="modal-mapa" class="modal-overlay">
        <div class="modal-content glass-effect">
            <span class="close-button" id="cerrar-mapa">&times;</span>
            <h2>¡Enhorabuena!</h2>
            <p>Has conseguido completar el mapa y reunir las 4 claves que te faltaban para salir de esta lista.<br>Date prisa en descifrar las claves y conseguir las coordenadas para que puedas escapar a tiempo. ¡El tiempo corre en tu contra!</p>
            <img src="img/mapa.webp" alt="Mapa con pistas" class="modal-image">
            <button id="btn-continuar-mapa" class="continue-button">Continuar</button>
        </div>
    </div>

  <div id="game-over-overlay" class="oculto">
    <video id="game-over-video" src="../video/isla.mp4" loop></video>
    <div class="game-over-content">
      <h1>Game Over</h1>
      <button id="btn-restart">Volver a jugar</button>
    </div>
  </div>

  <script src="funciones.js"></script>
</body>
</html>
