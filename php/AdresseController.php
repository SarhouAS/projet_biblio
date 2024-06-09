<?php

require_once("../php/AdresseModel.php");
require_once("../php/utils/function.php");

header('Content-Type: application/json');

if (!isConnected()) {
    echo json_encode(["status" => "error", "message" => "User not logged in"]);
    exit;
}

$adresseModel = new AdresseModel();

try {
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $data = json_decode(file_get_contents("php://input"), true);

        if (isset($data['userId']) && isset($data['adresse']) && isset($data['ville']) && isset($data['code_postal'])) {
            $userId = $data['userId'];
            $adresse = $data['adresse'];
            $ville = $data['ville'];
            $codePostal = $data['code_postal'];

            $idAdresse = $adresseModel->createAdresse($userId, $adresse, $ville, $codePostal);
            if ($idAdresse) {
                echo json_encode(["status" => "success", "idAdresse" => $idAdresse]);
            } else {
                echo json_encode(["status" => "error", "message" => "Failed to save address."]);
            }
        } else {
            echo json_encode(["status" => "error", "message" => "Invalid data provided"]);
        }
    }
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => "Exception occurred: " . $e->getMessage()]);
}
?>
