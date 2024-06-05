<?php

require_once("../php/commandeModel.php");
require_once("./utils/function.php");

header('Content-Type: application/json');

if (!isConnected()) {
    echo json_encode(["status" => "error", "message" => "User not logged in"]);
    exit;
}

$commande = new Commande();

try {
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $data = json_decode(file_get_contents("php://input"), true);

        if (isset($data['commandeId']) && isset($data['etat'])) {
            $commandeId = $data['commandeId'];
            $etat = $data['etat'];

            if ($commande->updateCommandeEtat($commandeId, $etat)) {
                echo json_encode(["status" => "success"]);
            } else {
                echo json_encode(["status" => "error", "message" => "Failed to update commande"]);
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
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
