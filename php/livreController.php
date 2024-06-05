<?php
require_once("../php/livreModel");

header('Content-Type: application/json');

try {
    $livreModel = new Livre();
    $livres = $livreModel->getAllLivres();
    echo json_encode(["status" => "success", "livres" => $livres]);
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
