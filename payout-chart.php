<?php
header("Access-Control-Allow-Origin: *");
require_once("config.php");
$mysqli = new mysqli($config['host'],$config['user'],$config['pass'],$config['database']);
if($mysqli->connect_errno > 0)
{
	echo "Error connecting to database";
	exit;
}
$period="day";
$period=htmlspecialchars(stripslashes(stripcslashes($_POST['period'])));
$period_array=array("hour"=>"HOUR","day"=>"DAY","week"=>"WEEK","month"=>"MONTH","year"=>"YEAR");
$interval=$period_array[$period];
$stmt=$mysqli->prepare("select transaction_amount,unix_timestamp(`datetime`) as `ts` from user_transactions where user_id=? and `datetime`<=now() and datetime>=date_sub(now(),interval 1 ".$interval.") and transaction_type='payment' order by `datetime` desc limit 12");
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
