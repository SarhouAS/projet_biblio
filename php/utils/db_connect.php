<?php
$host = "localhost";
$username = "root"; 
$password = ""; 
$dbname = "biblio";

try {
    $db = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);

    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo "Erreur de connexion : " . $e->getMessage();

    die();
}
?>
