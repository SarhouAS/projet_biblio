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

// Fonction de sanitisation
function sanitize($data) {
    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}

$prenom = sanitize($_POST["PRENOM"]);
$nom = sanitize($_POST["NOM"]);
$email = sanitize($_POST["EMAIL"]);

if (!isset($prenom, $nom, $email) || empty($prenom) || empty($nom) || empty($email)) {
    echo json_encode(["success" => false, "error" => "Données manquantes ou vides"]);
    die;
}

$pwdsql = '';
if (isset($_POST["PWD"]) && !empty(trim($_POST["PWD"]))) {
    $pwd = sanitize($_POST["PWD"]);
    $pwdsql = ", PWD = :PWD";

    $regex = "/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])[a-zA-Z0-9]{8,12}$/";
    if (!preg_match($regex, $pwd)) {
        echo json_encode(["success" => false, "error" => "Mot de passe au mauvais format"]);
        die;
    }

    $hash = password_hash($pwd, PASSWORD_DEFAULT);
}

$req = $db->prepare("UPDATE user SET PRENOM = :PRENOM, NOM = :NOM, EMAIL = :EMAIL $pwdsql WHERE ID_USER = :ID_USER");
$req->bindValue(":PRENOM", $prenom);
$req->bindValue(":NOM", $nom);
$req->bindValue(":EMAIL", $email);
$req->bindValue(":ID_USER", $_SESSION["ID_USER"]);

if ($pwdsql != '') {
    $req->bindValue(":PWD", $hash);
}

$req->execute();
echo json_encode(["success" => true]);

?>
