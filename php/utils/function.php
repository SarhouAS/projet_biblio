<?php

session_start();


function isConnected() {
    return isset($_SESSION['ID_USER']);
}

function isAdmin() {
    return isset($_SESSION['ID_ROLE']) && $_SESSION['ID_ROLE'] === '1';
}
?>

