function Game() {
	this.write = function(string, color) {
		//green - 1F9822, red - C71F0B, yellow - D4C518, blue - 0C61B8
		color = typeof color !== 'undefined' ? color : "#FFF";
		$('#terminal').append('<p style="color:' + color + ';">'+string+'</p>');
		$('#cursor').appendTo($('#terminal').children(':last-child'));

		if ($('#terminal').children().length > 19) {
			$('#terminal').children(':first').remove();
		}
	}

	this.interpret = function(string) {
	commands = string.toLowerCase().split(' ');
	this.write('>'+string.toLowerCase(), '#1F9822');
	switch(commands[0]) {
		case 'go':
			switch(commands[1]) {
				case 'west':
					if (this.player.move(this.player.x-1, this.player.y)){
						this.write('Going west.');
						this.player.x -= 1;
					}
					break;
				case 'north':
					if (this.player.move(this.player.x, this.player.y+1)) {
						this.write('Going north.');
						this.player.y += 1;
					}
					break;
				case 'east':
					if (this.player.move(this.player.x+1, this.player.y)) {
						this.write('Going east.');
						this.player.x += 1;
					}
					break;
				case 'south':
					
					if (this.player.move(this.player.x, this.player.y-1)) {
						this.write('Going south.');
						this.player.y -= 1;
					}
					break;
				default:
					this.write('There is no such thing as ' + commands[1] + '.');
			}
			$('#x').text(this.player.x);
			$('#y').text(this.player.y);
			break;
		case 'objects':
			this.write(this.world.things.length-this.world.unusedId.length);
			break;
		case 'banana':
			if (typeof(commands[1]) !== 'number' || typeof(commands[2]) !== 'number') {
				this.world.addThing('banana', this.player.x, this.player.y, 1, "Banana", 'Клонированный банан.');
			} else {
				this.world.addThing('banana', commands[1], commands[2], 1, "Banana", 'Банан у вас под ногами.');
			}	
			break;
		case 'map':
			this.world.showMap();
			break;
		case 'delete':
			this.world.removeThing(commands[1]);
			this.write('Объект #'+commands[1]+' удалён.', '#C71F0B');
			break;
		case 'help':
			this.write('На данный момент есть команды:', '#D4C518');
			this.write('- go [north/south/east/west] - идти куда-то там;', '#D4C518');
			this.write('- objects - вывести количество заспавненных на данный момент объектов;', '#D4C518');
			this.write('- banana [x] [y] - заспавнить банан в координатах (x; y) - например "banana 3 0" заспавнит в координатах (3;0). Логично, блядь. И да, спавнится банан. Бесполезный и беспощадный;', '#D4C518');
			this.write('- map - показать карту;', '#D4C518');
			this.write('- delete [id] - удалить объект с определённым id;', '#D4C518');
			this.write('- look around - осмотреться;', '#D4C518');
			this.write('- take [что-то там] - взять что-то там к себе в инвентарь;', '#D4C518');
			this.write('- use [что-то там] - использовать что-то там;', '#D4C518');
			this.write('- think about [что-то там] - думать о чём-то там;', '#D4C518');
			this.write('- hp - вывести хпшечку;', '#D4C518');
			this.write('- help - показать эту справку.', '#D4C518');
			break;
		case 'take':
			if (this.world.getItemsnearPlayer('id') && this.world.getItemsnearPlayer('lcnames').indexOf(commands[1]) != -1) {
				var id = this.world.getItemsnearPlayer('id')[this.world.getItemsnearPlayer('lcnames').indexOf(commands[1])];
				this.player.take(id);
			}
			else {
				this.write('Вы не можете это взять.');
			}
			break;
		case 'hp':
			this.write(this.player.hp);
			break;
		case 'use':
			if (this.world.getItemsnearPlayer('id') && this.world.getItemsnearPlayer('lcnames').indexOf(commands[1]) != -1) {
				var id = this.world.getItemsnearPlayer('id')[this.world.getItemsnearPlayer('lcnames').indexOf(commands[1])];
				this.player.use(id);
			}
			else {
				this.write('Это нельзя использовать.');
			}
			break;
		case 'think':
			if (commands[1] == "about") {
				if (this.world.getItemsnearPlayer('lcnames').indexOf(commands[2]) != -1) {
					var id = this.world.getItemsnearPlayer('id')[this.world.getItemsnearPlayer('lcnames').indexOf(commands[2])];
					this.player.think(id);
				}
				else {
					this.write('.. Я понятия не имею о чём это ты...');
				}
				break;
			}
		case 'look':
			if (commands[1] == "around") {
				//alert(this.world.getItemsnearPlayer('id'));
				if (this.world.itemMap[this.player.y] && this.world.itemMap[this.player.y][this.player.x]){
					this.write('Неподалёку есть: ' + this.world.getItemsnearPlayer('unames').join(', ') + '.');
				}
				else {
					this.write('Ничего примечательного.')
				}
				break;
			}
		default:
			this.write('I dont know how to ' + commands[0] + '.');
		}
	}

	this.log = function(arg) {
		this.write(arg);
	}

	this.world = new World(this);
	this.player = new Player(this, 5, 0);
}

function Player(game, x, y){
	this.x = x;
	this.y = y;
	this.hp = 9;

	this.inventory = new Array();

	this.gameOfLife = new Array();

	this.dead = function() {
		if (this.gameOfLife['Death'])
			return true;
		return false;
	}

	this.move = function(direction) {
		if (this.dead){
			game.write('Вы мертвы.', '#C71F0B');
			return false;
		}
		return true;
	}

	this.die = function(id) {
		game.write('Вы мертвы.', '#C71F0B');
		this.hp = 0;
		this.gameOfLife['Death'] = true;
	}

	this.take = function(id) {
		this.inventory.push(id);
		game.world.removeFromMap(id);
	}

	this.think = function(id) {
		game.write('..' + game.world.things[id].thought + '..');
	}

	this.use = function(id) {
		game.world.things[id].use();
	}
}

function Thing(args) {
	//world[0], x[1], y[2], id[3], quanity[4], name[5], thought[6], use[7]
	this.world = args[0];
	this.x = args[1];
	this.y = args[2];
	this.id = args[3];
	this.quantity = args[4]
	this.name = args[5];
	this.thought = args[6];
	this.use = args[7];
}

function ThingClasses(game, thingClass, world, x, y, id, quantity, name, thought) {
	//Banana
	switch (thingClass){
		case 'banana':
			if (name)
				var name = name;
			else
				var name = 'Banana';

			if (quantity)
				var quantity = quantity;
			else
				var quantity = 1;

			if (thought)
				var thought = thought;
			else 
				var thought = 'Duplicated банан. Ходит поверье, что восполняет здоровье... Но если обожраться - тебе пиздец.';

			var use = function() {
				if (!game.player.gameOfLife['banana'])
					game.player.gameOfLife['banana'] = 1;
				else 
					game.player.die();

				if (game.player.hp < 10)
					game.player.hp += 1;
			}
			return [world, x, y, id, quantity, name, thought, use];
	}
}


function World(game) {
	this.map = [[0, 0, 1, 0, 0, 0, 0, 0], 
				[0, 0, 0, 0, 0, 0, 0, 0], 
				[0, 0, 0, 0, 0, 0, 0, 0], 
				[0, 0, 0, 0, 0, 0, 0, 0], 
				[0, 0, 0, 0, 0, 0, 0, 0], 
				[0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0]];

	this.itemMap = new Array();
	this.things = new Array();

	this.unusedId = new Array();
	this.showMap = function() {
		this.map.forEach(function(arg) {
			game.write(arg);
		});
	}

	this.getItemsnearPlayer = function(arg) {
		switch (arg) {
			case 'id':
				return this.itemMap[game.player.y][game.player.x];
			case 'lcnames': //lowercase names
				return this.getItemsnearPlayer('id').map(function(id) {
						return this.things[id].name.toLowerCase();
					}, this);
			case 'names':
				return this.getItemsnearPlayer('id').map(function(id) {
						return this.things[id].name;
					}, this);
			case 'unames': //unique names
				return this.getItemsnearPlayer('names').filter(function(value, index, self) { 
        			return self.indexOf(value) === index;
   				});
		}
	}

	this.addThing = function(thingClass, x, y, quantity, name, thought) {
		if (this.unusedId.length) {
			var id = this.unusedId[0];
			this.unusedId.splice(0,1);
		} else {
			var id = this.things.length;
		}
		if (thingClass == 'None'){
			this.things[id] = new Thing([this, x, y, id, quantity, name, thought]);
		} else {
			this.things[id] = new Thing(ThingClasses(game, thingClass, this, x, y, id, quantity, name, thought));
		}

		game.log(name+" spawned at " + x+"; "+y);

		if (!this.itemMap[y]) {
			this.itemMap[y] = new Array();
		}
		if (!this.itemMap[y][x]) {
			this.itemMap[y][x] = new Array();
		}
		this.itemMap[y][x].push(id);
		this.map[y][x] = 2;
		
	}

	this.removeFromMap = function(id) {
		this.itemMap[this.things[id].y][this.things[id].x].splice(
			this.itemMap[this.things[id].y][this.things[id].x].indexOf(id), 1);
		if (this.itemMap[this.things[id].y][this.things[id].x].length == 0) {
			this.itemMap[this.things[id].y][this.things[id].x] = undefined;
		}
	}

	this.removeThing = function (id) {
		if (this.things[id]) {
			delete this.things[id];
			this.unusedId.push(id); 
		}
	}

	this.addThing('banana', 5, 0, 1, "UsefulBanana");
	this.addThing('banana', 5, 0, 1, 'UsefulBanana#2');
	this.addThing('None', 5, 2, 1, "Banana", 'Загадочный банан.');
	this.showMap();
	game.log("Map initiated");
}