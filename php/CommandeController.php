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

        if (isset($data['livreId']) && isset($data['type'])) {
            $livreId = $data['livreId'];
            $type = $data['type'];
            $userId = $_SESSION['user_id']; // Assuming user ID is stored in session

            if ($commande->createCommande($userId, $type)) {
                echo json_encode(["status" => "success"]);
            } else {
                echo json_encode(["status" => "error", "message" => "Failed to create commande"]);
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
