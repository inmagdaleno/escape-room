<?php
    // comprobar si el usuario está logueado y si no está logueado lo mandamos a login
    if (session_status() == PHP_SESSION_NONE) {
        session_start();
    }

    if(!isset($_SESSION['logueado']) || !$_SESSION['logueado']){
        header("Location: login.php");
    }
    
    $mensaje = '';
    if(isset($_SESSION['mensaje'])){
        $mensaje = $_SESSION['mensaje'];
        unset($_SESSION['mensaje']);
    }
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Panel de control</title>

</head>
<body>
     <img src="../img/atardecer.jpg" alt="atardecer en la playa">
      <div class="header">
            <div class="user-info">
                <?php if(isset($_SESSION['usuario'])): ?>
                    <span>👋 Bienvenido a la isla efímera, <strong><?php echo htmlspecialchars($_SESSION['usuario']['nombre'] ?? $_SESSION['usuario']['correo'] ?? 'Usuario'); ?></strong></span>
                <?php else: ?>
                    <span>👋 Bienvenido a la isla efímera</span>
                <?php endif; ?>

                <div class="logout-container">
                <button id="cerrarSesion">Cerrar Sesión</button>
            </div>
        </div>

        <!-- Mensaje de estado -->
        <?php if($mensaje): ?>
            <div class="mensaje"><?php echo htmlspecialchars($mensaje); ?></div>
        <?php endif; ?>

        <script src="js/sesiones.js"></script>
</body>
</html>
