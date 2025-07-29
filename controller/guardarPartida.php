<?php
require_once '../config/database.php';

header('Content-Type: application/json');

$response = ['success' => false, 'mensaje' => 'Error desconocido.'];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        $response['mensaje'] = 'Error al decodificar JSON.';
        echo json_encode($response);
        exit();
    }

    $id_usuario = $data['id_usuario'] ?? null;
    $modo_juego = $data['modo_juego'] ?? null; // 'score' o 'time'
    $pistas_usadas = $data['pistas_usadas'] ?? 0;
    $resultado = $data['resultado'] ?? 0; // 1 para completado, 0 para no completado
    $puntuacion_final = $data['puntuacion_final'] ?? null;
    $tiempo_restante_final = $data['tiempo_restante_final'] ?? null;

    // Validaciones básicas
    if (empty($id_usuario) || empty($modo_juego)) {
        $response['mensaje'] = 'Datos incompletos.';
        echo json_encode($response);
        exit();
    }

    // Convertir modo_juego a booleano para la DB (1 para puntuacion, 0 para contrarreloj)
    $modo_juego_db = ($modo_juego === 'score') ? 1 : 0;

    $database = new Database();
    $conexion = $database->getConexion();

    $stmt = $conexion->prepare("INSERT INTO partida (id_usuario, fecha_partida, pistas_usadas, puntuacion_final, resultado, modo_juego, tiempo_restante_final) VALUES (?, NOW(), ?, ?, ?, ?, ?)");

    if ($stmt === false) {
        $response['mensaje'] = 'Error al preparar la consulta: ' . $conexion->error;
        echo json_encode($response);
        $database->close();
        exit();
    }

    // Manejar valores NULL para puntuacion_final y tiempo_restante_final
    $puntuacion_final_bind = $puntuacion_final;
    $tiempo_restante_final_bind = $tiempo_restante_final;

    $stmt->bind_param("iiisii", $id_usuario, $pistas_usadas, $puntuacion_final_bind, $resultado, $modo_juego_db, $tiempo_restante_final_bind);

    if ($stmt->execute()) {
        $response['success'] = true;
        $response['mensaje'] = 'Partida guardada con éxito.';
    } else {
        $response['mensaje'] = 'Error al guardar la partida: ' . $stmt->error;
    }

    $stmt->close();
    $database->close();
} else {
    $response['mensaje'] = 'Método no permitido.';
}

echo json_encode($response);
?>