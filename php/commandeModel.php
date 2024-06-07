<?php

require_once("../php/utils/db_connect.php");

class Commande {
    private $db;

    public function __construct() {
        global $db;
        $this->db = $db;
    }

    public function createCommande($userId, $livreId, $type) {
        try {
            $stmt = $this->db->prepare("INSERT INTO commande (ID_USER, ID_LIVRE, TYPE) VALUES (?, ?, ?)");
            $result = $stmt->execute([$userId, $livreId, $type]);
            if (!$result) {
                $errorInfo = $stmt->errorInfo();
                throw new Exception("Database error: " . $errorInfo[2]);
            }
            return $result;
        } catch (Exception $e) {
            echo json_encode(["status" => "error", "message" => "Exception: " . $e->getMessage()]);
            return false;
        }
    }

    public function getAllCommandes() {
        try {
            $stmt = $this->db->query("SELECT * FROM commande");
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            throw new Exception("Database error: " . $e->getMessage());
        }
    }
}
?>
