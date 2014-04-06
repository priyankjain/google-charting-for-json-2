<?php
header("Access-Control-Allow-Origin: *");
require_once("config.php");
$mysqli = new mysqli($config['host'],$config['user'],$config['pass'],$config['database'], "3306");
if($mysqli->connect_errno > 0)
{
	echo "Error connecting to database";
		die('Connect Error: ' . mysqli_connect_error());
	exit;
}
if(!$result=$mysqli->query("select * from users"))
{
	echo "Error executing query";
	exit;
}
$json=array();
while($row=$result->fetch_assoc())
{
	$json[][$row['userid']]=(double)$row['24hour_profit'];
}
echo json_encode($json);
?>
