<?php
require_once("utils/db_connect.php");

class CartModel {
    private $db;

    public function __construct() {
        global $db;
        $this->db = $db;
    }

    public function addToCart($userId, $bookId) {
        $stmt = $this->db->prepare("INSERT INTO cart (ID_USER, ID_LIVRE, QUANTITE) VALUES (?, ?, 1) ON DUPLICATE KEY UPDATE QUANTITE = QUANTITE + 1");
        return $stmt->execute([$userId, $bookId]);
    }

    public function getCartItems($userId) {
        $stmt = $this->db->prepare("SELECT c.ID_LIVRE, l.NOM_LIVRE, c.QUANTITE, l.photo FROM cart c JOIN livre l ON c.ID_LIVRE = l.ID_LIVRE WHERE c.ID_USER = ?");
        $stmt->execute([$userId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function removeFromCart($userId, $bookId) {
        $stmt = $this->db->prepare("DELETE FROM cart WHERE ID_USER = ? AND ID_LIVRE = ?");
        return $stmt->execute([$userId, $bookId]);
    }
}
?>
