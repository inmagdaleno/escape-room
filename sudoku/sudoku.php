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
  <title>Sudoku Geométrico</title>
  <link rel="stylesheet" href="estilos.css" />
  <style>
  @import url('https://fonts.googleapis.com/css2?family=Barriecito&family=Barrio&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');
  </style>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Rock+Salt&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A==" crossorigin="anonymous" referrerpolicy="no-referrer" />
</head>
<body>
  <!-- Botones de esquina superior izquierda -->
  <div class="esquina-superior-izquierda">
      <div class="button-group">
        <button id="btn-volver-atras" class="btn-icono-esquina" title="Volver Atrás">
          <i class="fa-solid fa-arrow-left"></i>
        </button>
        <span class="button-label">ATRÁS</span>
      </div>
      <div class="button-group" id="group-ir-adelante">
        <button id="btn-ir-adelante" class="btn-icono-esquina" title="Ir Adelante">
          <i class="fa-solid fa-arrow-right"></i>
        </button>
        <span class="button-label">ADELANTE</span>
      </div>
      <div class="button-group">
        <button id="btn-pista-extra" class="btn-icono-esquina" title="Pista Extra">
          <i class="fa-solid fa-magnifying-glass"></i>
        </button>
        <span class="button-label">PISTAS</span>
      </div>
    </div>
  
  

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
          <img id="perfil-img-preview" src="../img/avatar.png" alt="Imagen de perfil">
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
        <tbody id="ranking-body">
          <!-- Las filas del ranking se insertarán aquí con JavaScript -->
        </tbody>
      </table>
    </div>
  </div>

  <!-- Score Display -->
  <div id="score-container">Puntuación: <span id="score">100</span></div>
  <div id="timer-container" style="display: none;">Tiempo: <span id="timer">30:00</span></div>
  
  <div class="main-container">
    <div id="outerContainer">
      <div id="tableroContainer">
        <table id="sudoku"></table>
      </div>
    </div>

    <div id="dragZoneContainer">
      <h1>El Tablero de los Ancestros</h1>
      <p>Arrastra las runas hasta su posición correcta en el tablero. ¡No repitas símbolos ni en filas, ni en columnas ni en cada uno de los cuadrantes marcados en rojo!</p>
      <div id="dragZone" class="drag-zone"></div>
      <div id="smallButtonsContainer">
        <button onclick="limpiar()">Limpiar Tablero</button>
        <button onclick="verificar()">Verificar</button>
      </div>
      <div id="solveButtonContainer">
        <button onclick="iniciarResolucion()">Resolver</button>
      </div>
    </div>
  </div>
  <div id="resultado"></div>

  <!-- Modal para Pista Extra -->
  <div id="modal-pista" class="modal-overlay">
    <div class="modal-contenido">
      <span class="cerrar" id="cerrar-modal-pista">&times;</span>
      <h2>Pista Extra</h2>
      <p id="pista-explicacion"></p>
      <p id="feedback-pista" class="feedback"></p>
      <div class="modal-acciones">
        <button id="btn-confirmar-pista" class="btn-pista-primario btn-primary-gradient">Confirmar</button>
        <button id="btn-descartar-pista" class="btn-pista-secundario">Descartar</button>
      </div>
    </div>
  </div>

  <!-- Sonidos -->
  <audio id="audioClick" src="audio/click.wav" preload="auto"></audio>
    <audio id="audioError" src="audio/error.ogg" preload="auto"></audio>
    <audio id="audioSuccess" src="audio/success.wav" preload="auto"></audio>

  

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


