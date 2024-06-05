<?php
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

include_once("/php/livreModel.php");

try {
    $livres = getLivres();
    echo json_encode([
        'status' => 'success',
        'livres' => $livres
    ]);
} catch (Exception $e) {
    error_log("Erreur dans livreController.php: " . $e->getMessage());
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
?>
