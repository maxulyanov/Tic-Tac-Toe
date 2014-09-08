(function($) {

	$(function() {
		

		// Глобальные переменные
		var fieldSize,
			difficultySelect,
			countRow = 1,
		 	countColum = 1,
		 	globalCountR = 0,
			win = false,
			init = true,
			smart = false,
			init2,
			arrElems = [],
			checkElems = [],
			arrColum = [];

		// Переменные для быстрого изменения
		var text_Gamer = 'Текущий ход: Ваш ход',
			text_Ai = 'Текущий ход: Думаю...',
			text_startGame = 'Играть еще раз',
			speed_AiMove = 600;

		// Блок с настройками игры
		var settingsBlock = $('#settings');

		// Генерация поля для игры
		$(document).on('click','.startgame', function(event) {
			event.preventDefault();

			$('#field').remove();
			$(settingsBlock).hide(400);
			$(this).remove();
			$('.text-result').remove();

			//Получение данных для генерации
			fieldSize = parseInt($('#settings-field-size').find('a.active').attr('data-fieldsize'));
			difficultySelect = parseInt($('#settings-difficulty').find('a.active').attr('data-difficulty'));

			// Генерация поля для игры
			var field = $('<div id="field">');
			for(var i = 1; i <= fieldSize * fieldSize; i++){
				var el = $('<div class="cell c-'+i+'"><span></span></div>');
				arrElems.push(el);
				$(el).appendTo(field);				
			}

			// Деление на строки
			$(arrElems).each(function(index) {
				index++;
				var resultInt = isInteger(index / fieldSize);		
				if(resultInt){
					$(this).attr('data-row', countRow);
					for(var i = 0; i < fieldSize; i++){
						$(arrElems[--index]).attr('data-row', countRow);
					}
					countRow++;
				}
			});

			// Деление на колонки
			for(var i = 0; i < fieldSize; i++){
				arrColum.push(arrElems[i]);
			}
			$(arrColum).each(function(index) {
				var innerI = globalCountR;
				$(this).attr('data-colum', countColum)
				for(var i = 0; i < fieldSize; i++){
					$(arrElems[innerI]).attr('data-colum', countColum);
					innerI = innerI + fieldSize;
				}

				globalCountR++;
				innerI = innerI + index;
				countColum++;
			});

			// Добавление поля с игрой и текста в DOM + анимация
			$(field).css({
				'position' : 'relative',
				top: -600
			});

			$(field).appendTo($('#wrapper-game'));

			$(field).animate({
				top: 0
			}, 600, function(){
				$(field).css({
					'-moz-transform' : 'rotate(-0deg)',
					'-webkit-transform' : 'rotate(-0deg)',
					'transform' : 'rotate(-0deg)',
					'-moz-transition' : '0.3s',
					'-o-transition' : '0.3s',
					'-webkit-transition' : '0.3s',
					'transition' : '0.3s'
				});
			});

			$('<h3 class="whose-move">' + text_Gamer + '</h3>').prependTo($('#wrapper-game'));

			// Расчет ширины поля в зависимости от настроек
			var width = $('.cell').width() * fieldSize;
			$('#field, .whose-move').css('width', width+10);

		});
	
		// Функция проверки на целое число (для корректного деления на строки)
		function isInteger(fieldSize) {
  			return (fieldSize ^ 0) === fieldSize;
		};

		// Клик игрока по полю
		$(document).on('click', '.cell', function(event) {
			event.preventDefault();
			if(!$(this).hasClass('there') && !$(field).hasClass('endgame') && init){
				$(this).addClass('there');
				$(this).attr('data-mark', 'x');
				$(this).find('span').text('×');

				init = false;
				victory('x');
				$('.whose-move').text(text_Ai);

				//Запустить анализатор хода для AI
				if(!$(field).hasClass('endgame')){
					setTimeout(analizator, speed_AiMove);
				}			
			}
		});

		// Переключение активности для кнопок настроек
		$('#settings-difficulty, #settings-field-size').find('a').on('click', function(event) {
			event.preventDefault();
			$(this).parent().parent('div').find('a').removeClass('active');
			$(this).addClass('active');
		});

		// Проверка на победу
		function victory(sign) {
			$(arrElems).each(function (index) {
				if($(this).hasClass('there')){
					for(var i = 0; i < 4; i++){
						if(!win){
							innerVictory(this, i);
						}
					}

					// Функция будет вызываться из цикла и проверит все возможные комбинации
					function innerVictory(elem, line) {						
						var dataRow = $(elem).attr('data-row');
						var dataColum = $(elem).attr('data-colum');
						var combo;
						var mark = $(elem).attr('data-mark');

						for(var i = 0; i < fieldSize; i++){
							if(line == 0){
								dataColum--;
							}
							else if(line == 1){
								dataRow--;
							}
							else if(line == 2){
								dataColum--;
								dataRow--;
							}
							else if(line == 3){
								dataColum++;
								dataRow--;
							}
							
							combo  = $('div[data-colum ="' + dataColum + '"][data-row ="' + dataRow + '"][data-mark ="' + mark + '"]');
							if(typeof(combo)  !== 'undefined' && $(combo).hasClass('there')){
								checkElems.push(combo);
								if($(checkElems).length == (fieldSize - 1)){
									checkElems.push(elem);
								}
							}
						}

						if($(checkElems).length === fieldSize){
							$(checkElems).each(function() {
								$(this).css('background', 'red');
							})
							messWin(sign);
						}

						checkElems = [];
					};
				}
			});

			// Ничья
			if($('.cell.there').length == (fieldSize * fieldSize) && !$('#field').hasClass('endgame')){
				messWin();
				return false;
			}
		};
	
		// Анализатор ходов соперника
		function analizator() {
			smart = false;
			init2 = true;
			var mark;
			for(var i = 0; i < 2; i++){
				i == 0 ? mark = 'n' : mark = 'x';
				$('.there[data-mark="' + mark + '"]').each(function() {
					for(var i = 0; i < 4; i++){
						if(init2)
							innerAnalizator(this, i);
					}
				});
			}
			
			function innerAnalizator(elem, line) {
				var dataRow = $(elem).attr('data-row');
				var dataColum = $(elem).attr('data-colum');
				var warning;

				outer:
				for(var i = 0; i < fieldSize; i++){
					if(line == 0){
						dataColum--;
					}
					else if(line == 1){
						dataRow--;
					}
					else if(line == 2){
						dataColum--;
						dataRow--;
					}
					else if(line == 3){
						dataColum++;
						dataRow--;
					}
					
					warning  = $('div[data-colum ="' + dataColum + '"][data-row ="' + dataRow + '"][data-mark ="' + mark + '"]');
					if($(warning).length >= 1 && $(warning).hasClass('there')){
						checkElems.push(warning);
						if($(checkElems).length == (fieldSize - 2)){
							checkElems.push($(elem));
							for(var i=0; i<checkElems.length; i++){
								var dataRow = $(checkElems[i]).attr('data-row');
								var dataColum = $(checkElems[i]).attr('data-colum');

								if(line == 0){
									var thisElem = $('div[data-row ="' + dataRow + '"]').not('.there');
									if(thisElem.length > 0){
										smartAi(thisElem);
										break outer;
									}
								}
								else if(line == 1){
									var thisElem = $('div[data-colum ="' + dataColum + '"]').not('.there');
									if(thisElem.length > 0){
										smartAi(thisElem);
										break outer;
									}
								}
								else if(line == 2){
										var r = 1;
										var c = 1;
									for(var i = 1; i <= fieldSize; i++){
										r = i;
										c = i;
										var thisElem = $('div[data-colum ="' + c + '"][data-row ="' + r + '"]').not('.there');
										if(thisElem.length > 0){
											smartAi(thisElem);
											break outer;
										}
									}									
								}
								else if(line == 3){
										var r = 1;
										var c = fieldSize+1;
									for(var i = 1; i <= fieldSize; i++){
										r = i;
										c--;
										var thisElem = $('div[data-colum ="' + c + '"][data-row ="' + r + '"]').not('.there');
										if(thisElem.length > 0){
											smartAi(thisElem);
											break outer;
										}
									}									
								}
							}							
						}
					}
				}
				checkElems = [];
			}
			
			if(!smart && !win){
				randomAi();
			}	
		};

		// Рандомный AI
		function randomAi() {
			var max = fieldSize * fieldSize -1;
			var min = 0;
			var rand = min - 0.5 + Math.random()*(max-min+1)
			rand = Math.round(rand);

			if(!$(arrElems[rand]).hasClass('there')){
				$(arrElems[rand]).find('span').text('○');
				$(arrElems[rand]).addClass('there');
				$(arrElems[rand]).attr('data-mark', 'n');

				init = true;
				$('.whose-move').text(text_Gamer);
				victory('n');
			}
			else{
				randomAi();
			}
		};

		// Умный AI
		function smartAi(elem) {
			var rand = difficultyRand();
			if(rand !== 5){
				$(elem).addClass('there');
				$(elem).attr('data-mark', 'n');
				$(elem).find('span').text('○');
				
				init = true;
				init2 = false;
				smart = true;
				$('.whose-move').text(text_Gamer)
				victory('n');
			}
			else{
				randomAi();
				init2 = false;
				smart = true;						
			}
		};

		// Шанс ошибки хода AI
		function difficultyRand() {
			var min = 1,
				difficultyMax;
			if(difficultySelect == false){
				difficultyMax = 5;
			}
			else if(difficultySelect == true){
				difficultyMax = 4;
			}
			var rand = min - 0.5 + Math.random() * (difficultyMax - min + 1);
			return rand = Math.round(rand);
		}	


		// Сообщение о результах игры
		function messWin(s) {
			if(s == 'n'){
				$(field).before('<h3 class="text-result text-defeat">Результат: <span>Поражение!</span></h3>');
			}
			else if(s == 'x'){
				$(field).before('<h3 class="text-result text-victory">Результат: <span>Победа!</span></h3>');
			}
			else{
				$(field).before('<h3 class="text-result text-draw">Результат: <span>Ничья!</span></h3>');
			}

			win = true;

			$('#field').addClass('endgame');
			$('.whose-move').remove();
			$('<a href="#" class="startgame">' + text_startGame + '</a>').appendTo('#wrapper-game');
			$(settingsBlock).show(400);
			resetData();
		};

		// Сброс глобальных переменных в начальное состояние
		function resetData() {
			fieldSize,
			difficultySelect,
			countRow = 1,
		 	countColum = 1,
		 	globalCountR = 0,
			win = false,
			init = true,
			smart = false,
			init2,
			arrElems = [],
			checkElems = [],
			arrColum = [];
		};


	});

})(jQuery);
