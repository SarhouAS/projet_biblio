<?php
require_once("FavorisModel.php");
require_once("utils/function.php");

header('Content-Type: application/json');

if (!isConnected()) {
    echo json_encode(["status" => "error", "message" => "User not logged in"]);
    exit;
}

$favoris = new FavorisModel();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents("php://input"), true);
    if (isset($data['userId']) && isset($data['bookId'])) {
        if ($favoris->addToFavorites($data['userId'], $data['bookId'])) {
            echo json_encode(["status" => "success"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Failed to add to favorites"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Invalid data provided"]);
    }
} elseif ($_SERVER["REQUEST_METHOD"] == "GET") {
    if (isset($_GET['userId'])) {
        $items = $favoris->getFavorites($_GET['userId']);
        echo json_encode(["status" => "success", "items" => $items]);
    } else {
        echo json_encode(["status" => "error", "message" => "User ID not provided"]);
    }
} elseif ($_SERVER["REQUEST_METHOD"] == "DELETE") {
    $data = json_decode(file_get_contents("php://input"), true);
    if (isset($data['userId']) && isset($data['bookId'])) {
        if ($favoris->removeFromFavorites($data['userId'], $data['bookId'])) {
            echo json_encode(["status" => "success"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Failed to remove from favorites"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Invalid data provided"]);
    }
}
?>
