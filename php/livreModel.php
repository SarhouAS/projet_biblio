<?php
include_once("./utils/db_connect.php");

function getLivres() {
    global $db;

    try {
        $stmt = $db->query('SELECT * FROM livre');
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (Exception $e) {
        error_log("Erreur dans livreModel.php: " . $e->getMessage());
        throw $e;
    }
}
?>
