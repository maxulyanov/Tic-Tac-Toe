<?php
	require "php/stats.php";
?>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Игра крестики-нолики</title>
<link href='http://fonts.googleapis.com/css?family=Roboto+Condensed:300italic,400italic,700italic,400,700,300&subset=latin,cyrillic,cyrillic-ext' rel='stylesheet' type='text/css'>
<link href="css/style.css" type="text/css" rel="stylesheet">
<script src="js/jquery-1.11.1.min.js" type="text/javascript"></script>
<script src="js/script.js"></script>
</head>
<body>
	<h1>Игра &laquo;крестики-нолики&raquo;</h1>
    <div id="wrapper-game">
        <div id="settings">
        	<h3>Настройки игры:</h3>
			<div id="settings-difficulty">
				<h4>Сложность игры:</h4>
				<p>
					<a href="#" data-difficulty="0">Упрощенная</a>
					<a href="#" data-difficulty="1" class="active">Стандартная</a>
				</p>
			</div>
			<div id="settings-field-size">
				<h4>Размер поля:</h4>
				<p>
					<a href="#" class="active" data-fieldsize="3">3x3</a>
					<a href="#" data-fieldsize="4">4x4</a>
					<a href="#" data-fieldsize="5">5x5</a>
				</p>
			</div>
        </div>
        <a href="#" class="startgame">Начать игру</a>
		<div id="stats-game">
			<div>
				<h3>Общая статистика:</h3>
				<?php
					$stats = getStats();
					echo $stats;
				?>
			</div>
			<div id="info-graph">
				<h3>Инфографика:</h3>
				<div id="info-grid">
					<span class="line-x line-x-1">
						<span>0</span>
					</span>
					<span class="line-x line-x-2">
						<span>20</span>
					</span>
					<span class="line-x line-x-3">
						<span>40</span>
					</span>
					<span class="line-x line-x-4">
						<span>60</span>
					</span>
					<span class="line-x line-x-5">
						<span>80</span>
					</span>
					<span class="line-x line-x-6">
						<span>100</span>
					</span>
					<div>
						<span class="info-graph-line-1"><span></span></span>
						<span class="info-graph-line-2"><span></span></span>
						<span class="info-graph-line-3"><span></span></span>
					</div>
				</div>
			</div>
		</div>
    </div>
</body>
</html>
