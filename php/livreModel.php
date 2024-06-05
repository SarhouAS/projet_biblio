<?php
require_once("../utils/db_connect.php");

class Livre {
    private $db;

    public function __construct() {
        global $db;
        $this->db = $db;
    }

    public function getAllLivres() {
        $stmt = $this->db->prepare("SELECT * FROM livres");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?>
