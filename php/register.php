<?php
error_reporting(-1);

require_once("./utils/db_connect.php");

if ($_SERVER["REQUEST_METHOD"] != "POST") {
    echo json_encode(["success" => false, "error" => "Mauvaise méthode"]);
    die;
}

// Fonction de sanitisation
function sanitize($data) {
    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}

$nom = sanitize($_POST["NOM"]);
$prenom = sanitize($_POST["PRENOM"]);
$email = sanitize($_POST["EMAIL"]);
$pwd = sanitize($_POST["PWD"]);
$confirm_password = sanitize($_POST["confirm_password"]);
$role = sanitize($_POST["ROLE"]);
$acceptTerms = isset($_POST["acceptTerms"]) ? sanitize($_POST["acceptTerms"]) : '';

if (!isset($nom, $prenom, $email, $pwd, $confirm_password, $role, $acceptTerms)) {
    echo json_encode(["success" => false, "error" => "Données manquantes"]);
    die; 
}

if (empty($nom) || empty($prenom) || empty($email) || empty($pwd) || empty($confirm_password) || empty($role) || empty($acceptTerms)) {
    echo json_encode(["success" => false, "error" => "Données vides"]);
    die; 
}

if ($pwd !== $confirm_password) {
    echo json_encode(["success" => false, "error" => "Mots de passe non compatibles"]);
    die;
}

$regex = "/^[a-zA-Z0-9-+._]+@[a-zA-Z0-9-]{2,}\.[a-zA-Z]{2,}$/";

if (!preg_match($regex, $email)) {
    echo json_encode(["success" => false, "error" => "Email au mauvais format"]);
    die;
}

$regex = "/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])[a-zA-Z0-9]{8,12}$/";

if (!preg_match($regex, $pwd)) {
    echo json_encode(["success" => false, "error" => "Mot de passe au mauvais format"]);
    die;
}

$hash = password_hash($pwd, PASSWORD_DEFAULT);

$valid_roles = ["admin" => 1, "client" => 2];
if (!array_key_exists($role, $valid_roles)) {
    echo json_encode(["success" => false, "error" => "Rôle invalide"]);
    die;
}

$id_role = $valid_roles[$role];

$req = $db->prepare("INSERT INTO user(NOM, PRENOM, EMAIL, PWD, ID_ROLE) VALUES (:NOM, :PRENOM, :EMAIL, :PWD, :ID_ROLE)");

$req->bindValue(":NOM", $nom);
$req->bindValue(":PRENOM", $prenom);
$req->bindValue(":EMAIL", $email);
$req->bindValue(":PWD", $hash);
$req->bindValue(":ID_ROLE", $id_role);
$req->execute();

if ($req->rowCount()) {
    echo json_encode(["success" => true, "message" => "Inscription réussie"]);
} else {
    echo json_encode(["success" => false, "error" => "Mail déjà existant"]);
}
?>
