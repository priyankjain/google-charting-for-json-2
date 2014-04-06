<?php
header("Access-Control-Allow-Origin: *");
require_once("config.php");
$mysqli = new mysqli($config['host'],$config['user'],$config['pass'],$config['database'],"3306");
if($mysqli->connect_errno > 0)
{
	echo "Error connecting to database";
	exit;
}
$stmt=$mysqli->prepare("select tx_id,transaction_amount,`datetime` from user_transactions where user_id=? and transaction_type='payment' order by `datetime` desc");
$user_id=htmlspecialchars(stripslashes(stripcslashes($_POST['user_id'])));
$user_id=urldecode($user_id);
$stmt->bind_param("s",$user_id);
$stmt->execute() or die("mysql");
$result=array();
$result=$stmt->get_result();
$stmt->fetch();
$stmt->close();
$row=array();
// echo $result->num_rows;
// while($resu)
if($result->num_rows==0)
{
	echo "{'error':'No such user id exists'}";
	$mysqli->close();
}
else
{	
	$ret=array();
	while($row=$result->fetch_array(MYSQL_ASSOC))
	{
		$ret[]=$row;
	}
	echo json_encode($ret);
	$mysqli->close();
	exit;
}
?>
