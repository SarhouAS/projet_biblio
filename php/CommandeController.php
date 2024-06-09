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

        if (isset($data['livreId']) && isset($data['type']) && isset($data['userId']) && isset($data['idAdresse'])) {
            $livreId = $data['livreId'];
            $type = $data['type'];
            $userId = $data['userId'];
            $idAdresse = $data['idAdresse']; // Include address ID

            // Validation des types de commande
            if (!in_array($type, ['acheter', 'emprunter'])) {
                echo json_encode(["status" => "error", "message" => "Invalid commande type"]);
                exit;
            }

            if ($commande->createCommande($userId, $livreId, $type, $idAdresse)) {
                echo json_encode(["status" => "success"]);
            } else {
                echo json_encode(["status" => "error", "message" => "Failed to create commande. Possible reasons: Database issue, invalid data, etc."]);
            }
        } elseif (isset($data['commandeId']) && isset($data['etat'])) {
            $commandeId = $data['commandeId'];
            $etat = $data['etat'];

            if ($commande->updateCommandeEtat($commandeId, $etat)) {
                echo json_encode(["status" => "success"]);
            } else {
                echo json_encode(["status" => "error", "message" => "Failed to update commande. Possible reasons: Database issue, invalid data, etc."]);
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
