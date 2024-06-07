<?php

require_once("../php/CommandeModel.php");
require_once("../php/utils/function.php");

header('Content-Type: application/json');

if (!isConnected()) {
    echo json_encode(["status" => "error", "message" => "User not logged in"]);
    exit;
}

$commande = new Commande();

try {
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $data = json_decode(file_get_contents("php://input"), true);

        if (isset($data['livreId']) && isset($data['type'])) {
            $livreId = $data['livreId'];
            $type = $data['type'];
            $userId = $_SESSION['ID_USER']; // Assuming user ID is stored in session

            // Validation des types de commande
            if (!in_array($type, ['acheter', 'emprunter'])) {
                echo json_encode(["status" => "error", "message" => "Invalid commande type"]);
                exit;
            }

            if ($commande->createCommande($userId, $livreId, $type)) {
                echo json_encode(["status" => "success"]);
            } else {
                echo json_encode(["status" => "error", "message" => "Failed to create commande. Possible reasons: Database issue, invalid data, etc."]);
            }
        } else {
            echo json_encode(["status" => "error", "message" => "Invalid data provided"]);
        }
    } elseif ($_SERVER["REQUEST_METHOD"] == "GET") {
        $commandes = $commande->getAllCommandes();
        echo json_encode(["status" => "success", "commandes" => $commandes]);
    } else {
        echo json_encode(["status" => "error", "message" => "Invalid request method"]);
    }
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => "Exception occurred: " . $e->getMessage()]);
}
?>
