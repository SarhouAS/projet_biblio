<?php

require_once("../php/utils/db_connect.php");

class Commande {
    private $db;

    public function __construct() {
        global $db;
        $this->db = $db;
    }

    public function createCommande($userId, $livreId, $type, $idAdresse) {
        try {
            $stmt = $this->db->prepare("INSERT INTO commande (ID_USER, ID_LIVRE, TYPE, ID_ADRESSE) VALUES (?, ?, ?, ?)");
            $result = $stmt->execute([$userId, $livreId, $type, $idAdresse]);
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
            $stmt = $this->db->query("
                SELECT 
                    c.ID_COMMANDE, c.TYPE, c.ETAT, 
                    u.EMAIL, u.NOM, u.PRENOM,
                    a.ADRESSRE, a.VILLE, a.CODE_POSTAL,
                    l.NOM_LIVRE, l.photo
                FROM commande c
                JOIN user u ON c.ID_USER = u.ID_USER
                JOIN adresse a ON c.ID_ADRESSE = a.ID_ADRESSE
                JOIN livre l ON c.ID_LIVRE = l.ID_LIVRE
            ");
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            throw new Exception("Database error: " . $e->getMessage());
        }
    }

    public function updateCommandeEtat($commandeId, $etat) {
        try {
            $stmt = $this->db->prepare("UPDATE commande SET ETAT = ? WHERE ID_COMMANDE = ?");
            $result = $stmt->execute([$etat, $commandeId]);
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
}
?>
