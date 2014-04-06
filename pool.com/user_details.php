<?php
header("Access-Control-Allow-Origin: *");
require_once("config.php");
$mysqli = new mysqli($config['host'],$config['user'],$config['pass'],$config['database']);
if($mysqli->connect_errno > 0)
{
	echo "Error connecting to database";
	exit;
}
$stmt=$mysqli->prepare("select * from users where userid=?");
$user_id=htmlspecialchars(stripslashes(stripcslashes($_POST['user_id'])));
$user_id=urldecode($user_id);
$stmt->bind_param("s",$user_id);
$stmt->execute();
$result=array();
$result=$stmt->get_result();
$stmt->fetch();
$stmt->close();
$row=array();
// echo $result->num_rows;
// while($resu)
if($result->num_rows!=1)
{
	echo "{'error':'No such user id exists'}";
	$mysqli->close();
}
else
{	
	$row=$result->fetch_array(MYSQL_ASSOC);
	echo json_encode($row);
	$mysqli->close();
	exit;
}
?>
