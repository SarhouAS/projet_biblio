<?php

error_reporting(-1);

require_once("../utils/db_connect.php");
require("../utils/function.php");

isConnected();
isAdmin();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $method = $_POST;
} else {
    $method = $_GET;
}

switch ($method["choice"]) {
    case 'select':

        $req = $db->query("SELECT ID_USER, NOM, PRENOM, EMAIL FROM user");
        $users = $req->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(["success" => true, "user" => $users]);
        break;

    case 'select_id':

        if (!isset($method["ID_USER"]) || empty(trim($method["ID_USER"]))) {
            echo json_encode(["success" => false, "error" => "Id manquant"]);
            die;
        }

        $req = $db->prepare("SELECT ID_USER, NOM, PRENOM, EMAIL FROM user WHERE ID_USER = ?");
        $req->execute([$method["ID_USER"]]);
        $user = $req->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            echo json_encode(["success" => true, "user" => $user]);
        } else {
            echo json_encode(["success" => false, "error" => "User not found"]);
        }
        break;

    case 'update':

        if (!isset($method["PRENOM"], $method["NOM"], $method["EMAIL"], $method["ID_USER"]) ||
            empty(trim($method["PRENOM"])) || empty(trim($method["NOM"])) || empty(trim($method["EMAIL"])) || empty(trim($method["ID_USER"]))) {

            echo json_encode(["success" => false, "error" => "Données manquantes"]);
            die; 
        }

        $regex = "/^[a-zA-Z0-9-+._]+@[a-zA-Z0-9-]{2,}\.[a-zA-Z]{2,}$/";
        if (!preg_match($regex, $method["EMAIL"])) {
            echo json_encode(["success" => false, "error" => "Email au mauvais format"]);
            die;
        }

        $req = $db->prepare("UPDATE user SET PRENOM = :PRENOM, NOM = :NOM, EMAIL = :EMAIL WHERE ID_USER = :ID_USER");
        $req->bindValue(":PRENOM", $method["PRENOM"]);
        $req->bindValue(":NOM", $method["NOM"]);
        $req->bindValue(":EMAIL", $method["EMAIL"]);
        $req->bindValue(":ID_USER", $method["ID_USER"]);
        $req->execute();

        echo json_encode(["success" => true]);
        break;

    case "search":
        break;

    default:
        echo json_encode(["success" => false, "error" => "Ce choix n'existe pas"]);
        break;
}
