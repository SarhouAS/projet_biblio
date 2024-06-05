<?php
require_once("./utils/db_connect.php");

class Commande {
    private $db;

    public function __construct() {
        global $db;
        $this->db = $db;
    }

    public function createCommande($userId, $type) {
        $stmt = $this->db->prepare("INSERT INTO commande (ID_USER, TYPE, ETAT) VALUES (?, ?, 'en attente')");
        return $stmt->execute([$userId, $type]);
    }

    public function getAllCommandes() {
        $stmt = $this->db->prepare("SELECT c.ID_COMMANDE, c.TYPE, c.ETAT, u.EMAIL FROM commande c JOIN user u ON c.ID_USER = u.ID_USER");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function updateCommandeEtat($commandeId, $etat) {
        $stmt = $this->db->prepare("UPDATE commande SET ETAT = ? WHERE ID_COMMANDE = ?");
        return $stmt->execute([$etat, $commandeId]);
    }
}
?>
