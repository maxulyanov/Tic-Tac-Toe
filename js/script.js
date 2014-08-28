(function($){

	$(function(){

		// Кол-во клеток в ряд - временно фиксированное значение
		var num = 4;
		var countRow = 1;
		var countColum = 1;
		var arrElems = [];
		var checkElems = [];
		var win = false;
	
		// Генерация поля для игры
		//$(document).on('click','.startgame', function(event){

			event.preventDefault();
			/*
			$('#field').remove();
			$(this).remove();
			*/

			var field = $('<div id="field">');
			for(var i = 1; i <= num * num; i++){
				
				var elem = $('<div class="cell c-'+i+'">');
				arrElems.push(elem);
				$(elem).appendTo(field);				
			}

			// row
			$(arrElems).each(function(index){

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

			// colum
			var arrColum = [];
			for(var i = 0; i < num; i++){
				arrColum.push(arrElems[i]);
			}

			var globalCountR = 0;	
			$(arrColum).each(function(index){
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

			$(field).appendTo($('#wrapper'));

		//});


		function isInteger(num){
  			return (num ^ 0) === num;
		};



		// Клик по полю
		$(document).on('click', '.cell', function(){

			if(!$(this).hasClass('there')){
				$(this).text('O');
				$(this).addClass('there');
				$(this).attr('data-mark', 'n');
				victory('n');
				if($('.cell.there').length < (num * num) && !$('#field').hasClass('endgame')){
					ii();
				}

			}

		});


		// Проверка на победу
		function victory(sign){

			$(arrElems).each(function(index){
				if($(this).hasClass('there')){

					// victory row
					if(!win){
						var dataRow = $(this).attr('data-row');
						var dataColum = $(this).attr('data-colum');
						var comboRow;
						var mark = $(this).attr('data-mark');
						for(var i = 0; i < 2; i++){
							dataColum--;
							comboRow  = $('div[data-colum ="' + dataColum + '"][data-row ="' + dataRow + '"][data-mark ="' + mark + '"]');
							if(typeof(comboRow)  !== 'undefined' && $(comboRow).hasClass('there')){
								checkElems.push(comboRow);
								if($(checkElems).length == 2){
									checkElems.push(this);
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
					}

					// victory colum
					if(!win){
						var dataRow = $(this).attr('data-row');
						var dataColum = $(this).attr('data-colum');
						var mark = $(this).attr('data-mark');
						var comboRow;
						for(var i = 0; i < 2; i++){
							dataRow--;
							comboRow  = $('div[data-colum ="' + dataColum + '"][data-row ="' + dataRow + '"][data-mark ="' + mark + '"]');
							if(typeof(comboRow)  !== 'undefined' && $(comboRow).hasClass('there')){
								checkElems.push(comboRow);
								if($(checkElems).length == 2){
									checkElems.push(this);
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
					}

					// victory dig
					if(!win){
						var dataRow = $(this).attr('data-row');
						var dataColum = $(this).attr('data-colum');
						var mark = $(this).attr('data-mark');
						for(var i = 0; i < 2; i++){
							dataColum--;
							dataRow--;
							comboRow  = $('div[data-colum ="' + dataColum + '"][data-row ="' + dataRow + '"][data-mark ="' + mark + '"]');
							if(typeof(comboRow)  !== 'undefined' && $(comboRow).hasClass('there')){
								checkElems.push(comboRow);
								if($(checkElems).length == 2){
									checkElems.push(this);
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
					}

					// victory dig 2
					if(!win){
						var dataRow = $(this).attr('data-row');
						var dataColum = $(this).attr('data-colum');
						var mark = $(this).attr('data-mark');
						for(var i = 0; i < 2; i++){
							dataColum++;
							dataRow--;
							comboRow  = $('div[data-colum ="' + dataColum + '"][data-row ="' + dataRow + '"][data-mark ="' + mark + '"]');
							if(typeof(comboRow)  !== 'undefined' && $(comboRow).hasClass('there')){
								checkElems.push(comboRow);
								if($(checkElems).length == 2){
									checkElems.push(this);
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
					}

					// ничья
					if($('.cell.there').length == (num * num)){
						messWin();
						return false;
					}
				}
			});

		};

		// сообщение о победе
		function messWin(s){
			if(s == 'x'){
				alert('победил ПК!');
			}
			else if(s == 'n'){
				alert('победил игрок!');
			}
			else{
				alert('Ничья!');
			}

			win = true;

			$('#field').addClass('endgame');
			$('<a href="#" class="startgame">Сыграть еще раз</a>').appendTo('#wrapper');
		};

		

		// На случайное
		function ii(){

			var max = num * num -1;
			var min = 0;
			var rand = min - 0.5 + Math.random()*(max-min+1)
			rand = Math.round(rand);

			if(!$(arrElems[rand]).hasClass('there')){
				$(arrElems[rand]).text('x');
				$(arrElems[rand]).addClass('there');
				$(arrElems[rand]).attr('data-mark', 'x');
				victory('x');
			}
			else{
				ii();
			}

		};


	});

})(jQuery);
