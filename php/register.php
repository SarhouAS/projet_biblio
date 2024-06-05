<?php
error_reporting(-1);

require_once("./utils/db_connect.php");

if ($_SERVER["REQUEST_METHOD"] != "POST") {
    echo json_encode(["success" => false, "error" => "Mauvaise méthode"]);
    die;
}

if (!isset($_POST["NOM"], $_POST["PRENOM"], $_POST["EMAIL"], $_POST["PWD"], $_POST["confirm_password"], $_POST["ROLE"])) {
    echo json_encode(["success" => false, "error" => "Données manquantes"]);
    die; 
}

if (
    empty(trim($_POST["NOM"])) ||
    empty(trim($_POST["PRENOM"])) ||
    empty(trim($_POST["EMAIL"])) ||
    empty(trim($_POST["PWD"])) ||
    empty(trim($_POST["confirm_password"])) ||
    empty(trim($_POST["ROLE"]))
) {
    echo json_encode(["success" => false, "error" => "Données vides"]);
    die; 
}

if ($_POST["PWD"] !== $_POST["confirm_password"]) {
    echo json_encode(["success" => false, "error" => "Mots de passe non compatibles"]);
    die;
}

$regex = "/^[a-zA-Z0-9-+._]+@[a-zA-Z0-9-]{2,}\.[a-zA-Z]{2,}$/";

if (!preg_match($regex, $_POST["EMAIL"])) {
    echo json_encode(["success" => false, "error" => "Email au mauvais format"]);
    die;
}

$regex = "/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])[a-zA-Z0-9]{8,12}$/";

if (!preg_match($regex, $_POST["PWD"])) {
    echo json_encode(["success" => false, "error" => "Mot de passe au mauvais format"]);
    die;
}

$hash = password_hash($_POST["PWD"], PASSWORD_DEFAULT);

$role = $_POST["ROLE"];

$valid_roles = ["admin" => 1, "client" => 2];
if (!array_key_exists($role, $valid_roles)) {
    echo json_encode(["success" => false, "error" => "Rôle invalide"]);
    die;
}

$id_role = $valid_roles[$role];

$req = $db->prepare("INSERT INTO user(NOM, PRENOM, EMAIL, PWD, ID_ROLE) VALUES (:NOM, :PRENOM, :EMAIL, :PWD, :ID_ROLE)");

$req->bindValue(":NOM", $_POST["NOM"]);
$req->bindValue(":PRENOM", $_POST["PRENOM"]);
$req->bindValue(":EMAIL", $_POST["EMAIL"]);
$req->bindValue(":PWD", $hash);
$req->bindValue(":ID_ROLE", $id_role);
$req->execute();

if ($req->rowCount()) {
    echo json_encode(["success" => true, "message" => "Inscription réussie"]);
} else {
    echo json_encode(["success" => false, "error" => "Mail déjà existant"]);
}
?>
