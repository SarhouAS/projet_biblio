<?php
require_once("utils/db_connect.php");

class FavorisModel {
    private $db;

    public function __construct() {
        global $db;
        $this->db = $db;
    }

    public function addToFavorites($userId, $bookId) {
        $stmt = $this->db->prepare("INSERT INTO favoris (ID_USER, ID_LIVRE) VALUES (?, ?)");
        return $stmt->execute([$userId, $bookId]);
    }

    public function getFavorites($userId) {
        $stmt = $this->db->prepare("SELECT f.ID_LIVRE, l.NOM_LIVRE, l.photo FROM favoris f JOIN livre l ON f.ID_LIVRE = l.ID_LIVRE WHERE f.ID_USER = ?");
        $stmt->execute([$userId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function removeFromFavorites($userId, $bookId) {
        $stmt = $this->db->prepare("DELETE FROM favoris WHERE ID_USER = ? AND ID_LIVRE = ?");
        return $stmt->execute([$userId, $bookId]);
    }
}
?>
