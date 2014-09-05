(function($){

	$(function(){
		

		// Глобальные переменные
		var num = 3,
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
		var text_Gamer = 'Ваш ход',
			text_Ai = 'Думаю...',
			text_startGame = 'Сыграть еще раз',
			speed_AiMove = 600;

		// Генерация поля для игры
		//$(document).on('click','.startgame', function(event){

			event.preventDefault();
			/*
			$('#field').remove();
			$(this).remove();
			*/

			// Генерация поля для игры
			var field = $('<div id="field">');
			for(var i = 1; i <= num * num; i++){
				var el = $('<div class="cell c-'+i+'"><span></span></div>');
				arrElems.push(el);
				$(el).appendTo(field);				
			}

			// Деление на строки
			$(arrElems).each(function(index) {
				index++;
				var resultInt = isInteger(index / num);		
				if(resultInt){
					$(this).attr('data-row', countRow);
					for(var i = 0; i < num; i++){
						$(arrElems[--index]).attr('data-row', countRow);
					}
					countRow++;
				}
			});

			// Деление на колонки
			for(var i = 0; i < num; i++){
				arrColum.push(arrElems[i]);
			}
			$(arrColum).each(function(index) {
				var innerI = globalCountR;
				$(this).attr('data-colum', countColum)
				for(var i = 0; i < num; i++){
					$(arrElems[innerI]).attr('data-colum', countColum);
					innerI = innerI + num;
				}

				globalCountR++;
				innerI = innerI + index;
				countColum++;
			});

			// Добавление поля и текста в DOM
			$(field).appendTo($('#wrapper'));
			$('<h3 class="whose-move">' + text_Gamer + '</h3>').appendTo($('#wrapper'));

		//});
	
		// Функция проверки на целое число (для корректного деления на строки)
		function isInteger(num) {
  			return (num ^ 0) === num;
		};

		// Клик игрока по полю
		$(document).on('click', '.cell', function() {
			if(!$(this).hasClass('there') && !$(field).hasClass('endgame') && init){
				$(this).addClass('there');
				$(this).attr('data-mark', 'x');
				$(this).find('span').text('X');

				init = false;
				victory('x');
				$('.whose-move').text(text_Ai);

				//Запустить анализатор хода для AI
				if(!win){
					setTimeout(analizator, speed_AiMove);
				}			
			}
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

						for(var i = 0; i < num; i++){
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
								if($(checkElems).length == (num - 1)){
									checkElems.push(elem);
								}
							}
						}

						if($(checkElems).length === num){
							$(checkElems).each(function(){
								$(this).css('background', 'red');
							})
							messWin(sign);
						}

						checkElems = [];
					};
				}
			});

			// Ничья
			if($('.cell.there').length == (num * num) && !win){
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
				$('.there[data-mark="' + mark + '"]').each(function(){
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
				for(var i = 0; i < num; i++){
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
						if($(checkElems).length == (num - 2)){
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
									for(var i = 1; i <= num; i++){
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
										var c = num+1;
									for(var i = 1; i <= num; i++){
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
			var max = num * num -1;
			var min = 0;
			var rand = min - 0.5 + Math.random()*(max-min+1)
			rand = Math.round(rand);

			if(!$(arrElems[rand]).hasClass('there')){
				$(arrElems[rand]).find('span').text('O');
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
			console.log(rand)
			if(rand !== 5){
				console.log('if')
				$(elem).addClass('there');
				$(elem).attr('data-mark', 'n');
				$(elem).find('span').text('O');
				
				init = true;
				init2 = false;
				smart = true;
				$('.whose-move').text(text_Gamer)
				victory('n');
			}
			else{
				console.log('else')
				randomAi();
				init2 = false;
				smart = true;						
			}
		};

		function difficultyRand() {
			var min = 1;
			var max = 5;
			var rand = min - 0.5 + Math.random() * (max - min + 1);
			return rand = Math.round(rand);
		}	


		// Сообщение о результах игры
		function messWin(s) {
			win = true;

			if(s == 'n'){
				console.log('победил ПК!');
			}
			else if(s == 'x'){
				console.log('победил игрок!');
			}
			else{
				console.log('Ничья!');
			}

			$('#field').addClass('endgame');
			$('.whose-move').remove();
			$('<a href="#" class="startgame">' + text_startGame + '</a>').appendTo('#wrapper');
		};


	});

})(jQuery);
