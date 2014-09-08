<?php 

define('DB_HOST', 'localhost');
define('DB_LOGIN', 'root');
define('DB_PASSWORD', 'pass');
define('DB_NAME', 'base');
$link = mysqli_connect(DB_HOST, DB_LOGIN, DB_PASSWORD, DB_NAME);

$r;

if(isset($_POST['s'])){
	$s=$_POST['s'];
	$sql = "UPDATE stats SET val=val+1 WHERE id IN ($s, 1)";
	mysqli_query($link, $sql) or die(mysqli_error($link));
	$t = getStats();
	echo $t;
}
function getStats(){
	global $link;
	$sql = 'SELECT val FROM stats';
	$result = mysqli_query($link, $sql) or die(mysqli_error($link));
	$count = 0;
	while($item = mysqli_fetch_assoc($result)){
		$count++;
		if($count == 1){
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
}

?>