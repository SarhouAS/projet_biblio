<?php

require_once("./utils/db_connect.php");
require("./utils/function.php");

if (!isConnected()) {
    echo json_encode(["success" => false, "error" => "Vous devez être connecté pour effectuer cette opération."]);
    die;
}

if ($_SERVER["REQUEST_METHOD"] != "POST") {
    echo json_encode(["success" => false, "error" => "Mauvaise méthode"]);
    die;
}

if (!isset($_POST["PRENOM"], $_POST["NOM"], $_POST["EMAIL"]) || empty(trim($_POST["PRENOM"])) || empty(trim($_POST["NOM"])) || empty(trim($_POST["EMAIL"]))) {
    echo json_encode(["success" => false, "error" => "Données manquantes ou vides"]);
    die;
}

$pwdsql = '';
if (isset($_POST["PWD"]) && !empty(trim($_POST["PWD"]))) {
    $pwdsql = ", PWD = :PWD";

    $regex = "/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])[a-zA-Z0-9]{8,12}$/";
    if (!preg_match($regex, $_POST["PWD"])) {
        echo json_encode(["success" => false, "error" => "Mot de passe au mauvais format"]);
        die;
    }

    $hash = password_hash($_POST["PWD"], PASSWORD_DEFAULT);
}

$req = $db->prepare("UPDATE user SET PRENOM = :PRENOM, NOM = :NOM, EMAIL = :EMAIL $pwdsql WHERE ID_USER = :ID_USER");
$req->bindValue(":PRENOM", $_POST["PRENOM"]);
$req->bindValue(":NOM", $_POST["NOM"]);
$req->bindValue(":EMAIL", $_POST["EMAIL"]);
$req->bindValue(":ID_USER", $_SESSION["ID_USER"]);

if ($pwdsql != '') {
    $req->bindValue(":PWD", $hash);
}

$req->execute();
echo json_encode(["success" => true]);

?>
