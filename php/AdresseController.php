<?php

require_once("../php/utils/db_connect.php");
require_once("../php/utils/function.php");

header('Content-Type: application/json');

if (!isConnected()) {
    echo json_encode(["status" => "error", "message" => "User not logged in"]);
    exit;
}

try {
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data['adresse']) && isset($data['ville']) && isset($data['code_postal'])) {
        $adresse = $data['adresse'];
        $ville = $data['ville'];
        $code_postal = $data['code_postal'];
        $userId = $_SESSION['ID_USER'];

        $stmt = $db->prepare("INSERT INTO adresse (ID_USER, ADRESSRE, VILLE, CODE_POSTAL) VALUES (?, ?, ?, ?)");
        $result = $stmt->execute([$userId, $adresse, $ville, $code_postal]);

        if ($result) {
            echo json_encode(["status" => "success"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Failed to save address."]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Invalid data provided"]);
    }
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => "Exception: " . $e->getMessage()]);
}
?>
