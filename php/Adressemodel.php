<?php

require_once("../php/utils/db_connect.php");

class AdresseModel {
    private $db;

    public function __construct() {
        global $db;
        $this->db = $db;
    }

    public function createAdresse($userId, $adresse, $ville, $codePostal) {
        try {
            $stmt = $this->db->prepare("INSERT INTO adresse (ID_USER, ADRESSRE, VILLE, CODE_POSTAL) VALUES (?, ?, ?, ?)");
            $stmt->execute([$userId, $adresse, $ville, $codePostal]);
            return $this->db->lastInsertId();
        } catch (Exception $e) {
            throw new Exception("Database error: " . $e->getMessage());
        }
    }
}
?>
