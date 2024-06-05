<?php
error_reporting(-1);
session_start();

require_once("utils/db_connect.php");

if ($_SERVER["REQUEST_METHOD"] != "POST") {
    echo json_encode(["success" => false, "error" => "Mauvaise méthode"]);
    die;
}

if (!isset($_POST["EMAIL"], $_POST["PWD"])) {
    echo json_encode(["success" => false, "error" => "Données manquantes"]);
    die; 
}

if (empty(trim($_POST["EMAIL"])) || empty(trim($_POST["PWD"]))) {
    echo json_encode(["success" => false, "error" => "Données vides"]);
    die;
}

$req = $db->prepare("SELECT * FROM user WHERE EMAIL = ?");
$req->execute([$_POST["EMAIL"]]);

$user = $req->fetch(PDO::FETCH_ASSOC);

if ($user && password_verify($_POST["PWD"], $user["PWD"])) {
    $_SESSION["connected"] = true;
    $_SESSION["ID_USER"] = $user["ID_USER"];

    $roleReq = $db->prepare("SELECT r.LIBELLE AS role_name FROM role r JOIN user u ON u.ID_ROLE = r.ID_ROLE WHERE u.ID_USER = ?");
    $roleReq->execute([$user["ID_USER"]]);
    $role = $roleReq->fetch(PDO::FETCH_ASSOC);

    if ($role) {
        $_SESSION["role"] = $role["role_name"];
        $user["role"] = $role["role_name"]; // Ajouter le rôle aux données utilisateur retournées
    }

    unset($user["PWD"]);

    echo json_encode(["success" => true, "user" => $user]);
} else {
    $_SESSION = [];
    session_destroy();
    echo json_encode(["success" => false, "error" => "Aucun utilisateur"]);
}
?>
