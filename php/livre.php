<?php

error_reporting(-1);
require_once("utils/db_connect.php");
require("utils/function.php");
isConnected();

function upload($files) {
    $target_dir = "../uploads/";
    $target_file = $target_dir . basename($files["photo"]["name"]);
    $uploadOk = 1;
    $imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));
    $check = getimagesize($files["photo"]["tmp_name"]);
    if ($check !== false) {
        $uploadOk = 1;
    } else {
        return false;
        $uploadOk = 0;
    }
    if (file_exists($target_file)) {
        return basename($files["photo"]["name"]);
    }
    if ($files["photo"]["size"] > 5000000) {
        return false;
        $uploadOk = 0;
    }
    if ($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg" && $imageFileType != "gif") {
        return false;
        $uploadOk = 0;
    }
    if ($uploadOk == 0) {
        return false;
    } else {
        if (move_uploaded_file($files["photo"]["tmp_name"], $target_file)) {
            return basename($files["photo"]["name"]);
        } else {
            return false;
        }
    }
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $method = $_POST;
} else {
    $method = $_GET;
}

switch ($method["choice"]) {
    case "select":
        $req = $db->prepare("SELECT * FROM livre ORDER BY ID_LIVRE DESC");
        $req->execute();
        $livres = $req->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(["success" => true, "livres" => $livres]);
        break;

    case "insert":
    case "update":
    case "delete":
        if (!isAdmin()) {
            echo json_encode(["success" => false, "error" => "Unauthorized"]);
            die;
        }
        handleAdminActions($method);
        break;

    default:
        echo json_encode(["success" => false, "error" => "Ce choix n'existe pas"]);
        break;
}

function handleAdminActions($method) {
    global $db;

    switch ($method["choice"]) {
        case "insert":
            if ($_SERVER["REQUEST_METHOD"] != "POST") {
                echo json_encode(["success" => false, "error" => "Mauvaise méthode"]);
                die;
            }
            if (!isset($method["NOM_LIVRE"], $method["QUANTITE"]) || empty(trim($method["NOM_LIVRE"])) || empty(trim($method["QUANTITE"]))) {
                echo json_encode(["success" => false, "error" => "Données manquantes"]);
                die;
            }
            $photo = false;
            if (isset($_FILES["photo"]["name"])) $photo = upload($_FILES);
            $req = $db->prepare("INSERT INTO livre (NOM_LIVRE, QUANTITE, photo) VALUES (:NOM_LIVRE, :QUANTITE, :photo)");
            $req->bindValue(":NOM_LIVRE", $method["NOM_LIVRE"]);
            $req->bindValue(":QUANTITE", $method["QUANTITE"]);
            $req->bindValue(":photo", $photo ? $photo : null);
            $req->execute();
            $livre_id = $db->lastInsertId();
            echo json_encode(["success" => true, "ID_LIVRE" => $livre_id, "photo" => $photo]);
            break;

        case "update":
            if ($_SERVER["REQUEST_METHOD"] != "POST") {
                echo json_encode(["success" => false, "error" => "Mauvaise méthode"]);
                die;
            }
            if (!isset($method["NOM_LIVRE"], $method["QUANTITE"], $method["ID_LIVRE"]) || empty(trim($method["NOM_LIVRE"])) || empty(trim($method["QUANTITE"])) || empty(trim($method["ID_LIVRE"]))) {
                echo json_encode(["success" => false, "error" => "Données manquantes"]);
                die;
            }
            $photo = false;
            if (isset($_FILES["photo"]["name"]) && !empty($_FILES["photo"]["name"])) {
                $photo = upload($_FILES);
            } else if (isset($method["currentPhoto"])) {
                $photo = $method["currentPhoto"];
            }
            $photo_req = $photo ? ", photo = :photo" : "";
            $req = $db->prepare("UPDATE livre SET NOM_LIVRE = :NOM_LIVRE, QUANTITE = :QUANTITE $photo_req WHERE ID_LIVRE = :ID_LIVRE");
            $req->bindValue(":NOM_LIVRE", $method["NOM_LIVRE"]);
            $req->bindValue(":QUANTITE", $method["QUANTITE"]);
            $req->bindValue(":ID_LIVRE", $method["ID_LIVRE"]);
            if ($photo) $req->bindValue(":photo", $photo);
            $req->execute();
            echo json_encode(["success" => true, "photo" => $photo]);
            break;

        case "delete":
            if ($_SERVER["REQUEST_METHOD"] != "POST") {
                echo json_encode(["success" => false, "error" => "Mauvaise méthode"]);
                die;
            }
            if (!isset($method["ID_LIVRE"]) || empty(trim($method["ID_LIVRE"]))) {
                echo json_encode(["success" => false, "error" => "Id manquant"]);
                die;
            }
            $req = $db->prepare("DELETE FROM livre WHERE ID_LIVRE = ?");
            $req->execute([$method["ID_LIVRE"]]);
            if ($req->rowCount()) {
                echo json_encode(["success" => true]);
            } else {
                echo json_encode(["success" => false, "error" => "Livre introuvable ou vous n'êtes pas autorisé"]);
            }
            break;
    }
}

?>
