<?php

require "config.php";

$uuid = $mysqli->real_escape_string($_GET['uuid']);
$local_time = $mysqli->real_escape_string($_GET['local_time']);
$action = $mysqli->real_escape_string($_GET['action']);
$data = $mysqli->real_escape_string($_GET['data']);
$device = $mysqli->real_escape_string($_GET['device']);
$os = $mysqli->real_escape_string($_GET['os']);

date_default_timezone_set('America/New_York');
$created_at = date('Y-m-d H:i:s', time());

$ip = $_SERVER['REMOTE_ADDR'];

$sql = "INSERT into log (created_at, local_time, uuid, action, data, ip, device,os) VALUES ('$created_at', '$local_time', '$uuid', '$action', '$data', '$ip', '$device','$os') ";

$mysqli->query($sql);

echo "OK"
?>