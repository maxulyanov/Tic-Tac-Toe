<?php 

define('DB_HOST', 'localhost');
define('DB_LOGIN', 'root');
<<<<<<< HEAD
define('DB_PASSWORD', '');
define('DB_NAME', 'base');
$link = mysqli_connect(DB_HOST, DB_LOGIN, DB_PASSWORD, DB_NAME);

$res;
=======
define('DB_PASSWORD', 'pass');
define('DB_NAME', 'base');
$link = mysqli_connect(DB_HOST, DB_LOGIN, DB_PASSWORD, DB_NAME);

$r;
>>>>>>> f10d70175e2f9601633f98b5ed26e1a7365921cc

if(isset($_POST['s'])){
	$s=$_POST['s'];
	$sql = "UPDATE stats SET val=val+1 WHERE id IN ($s, 1)";
	mysqli_query($link, $sql) or die(mysqli_error($link));
<<<<<<< HEAD
	$stats = getStats();
	echo $stats;
=======
	$t = getStats();
	echo $t;
>>>>>>> f10d70175e2f9601633f98b5ed26e1a7365921cc
}
function getStats(){
	global $link;
	$sql = 'SELECT val FROM stats';
	$result = mysqli_query($link, $sql) or die(mysqli_error($link));
	$count = 0;
	while($item = mysqli_fetch_assoc($result)){
		$count++;
		if($count == 1){
<<<<<<< HEAD
			$res .= '<div class="text-stats-all">Сыграно игр: '.$item["val"].'</div>';	
		}
		if($count == 2){
			$res .= '<div class="text-stats-win">Побед игроков: '.$item["val"].'</div>';	
		}
		if($count == 3){
			$res .= '<div class="text-stats-defeat">Побед AI: '.$item["val"].'</div>';	
		}
		if($count == 4){
			$res .= '<div class="text-stats-draw">Ничьих: '.$item["val"].'</div>';	
		}
	}
	return $res;
=======
			$r .= '<div class="text-stats-all">Сыграно игр: '.$item["val"].'</div>';	
		}
		if($count == 2){
			$r .= '<div class="text-stats-win">Побед игроков: '.$item["val"].'</div>';	
		}
		if($count == 3){
			$r .= '<div class="text-stats-defeat">Побед AI: '.$item["val"].'</div>';	
		}
		if($count == 4){
			$r .= '<div class="text-stats-draw">Ничьих: '.$item["val"].'</div>';	
		}
	}
	return $r;
>>>>>>> f10d70175e2f9601633f98b5ed26e1a7365921cc
}

?>