(function($){

	$(function(){
		

		// Глобальные переменные
		var num = 4,
			countRow = 1,
		 	countColum = 1,
		 	globalCountR = 0,
			win = false,
			init = true,
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

				if($('.cell.there').length < (num * num) && !$('#field').hasClass('endgame')){
					setTimeout(ai, speed_AiMove);				
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

						for(var i = 0; i < 2; i++){
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
								if($(checkElems).length == 2){
									checkElems.push(elem);
								}
							}
						}

						if($(checkElems).length === 3){
							$(checkElems).each(function(){
								$(this).css('background', 'red');
							})
							messWin(sign);
						}

						checkElems = [];
					};

					// В этом случае получаем ничью
					if($('.cell.there').length == (num * num)){
						messWin();
						return false;
					}
				}
			});

		};

		// Сообщение о результах игры
		function messWin(s){
			if(s == 'n'){
				alert('победил ПК!');
			}
			else if(s == 'x'){
				alert('победил игрок!');
			}
			else{
				alert('Ничья!');
			}

			win = true;

			$('#field').addClass('endgame');
			$('.whose-move').remove();
			$('<a href="#" class="startgame">' + text_startGame + '</a>').appendTo('#wrapper');
		};

		

		// Рандомный AI
		function ai(){
			var max = num * num -1;
			var min = 0;
			var rand = min - 0.5 + Math.random()*(max-min+1)
			rand = Math.round(rand);

			if(!$(arrElems[rand]).hasClass('there')){
				$(arrElems[rand]).text('O');
				$(arrElems[rand]).addClass('there');
				$(arrElems[rand]).attr('data-mark', 'n');

				init = true;
				victory('n');
				$('.whose-move').text(text_Gamer)

			}
			else{
				ai();
			}
		};


	});

})(jQuery);
