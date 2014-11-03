log = "";

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
					this.write('Going west.');
					this.player.x -= 1;
					break;
				case 'north':
					this.write('Going north.');
					this.player.y += 1;
					break;
				case 'east':
					this.write('Going east.');
					this.player.x += 1;
					break;
				case 'south':
					this.write('Going south.');
					this.player.y -= 1;
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
			this.world.addThing(commands[1], commands[2], "Banana");
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
			this.write('- go (north, south, east, west) - идти куда-то там;', '#D4C518');
			this.write('- objects - вывести количество заспавненных на данный момент объектов;', '#D4C518');
			this.write('- banana x y - заспавнить банан в координатах (x; y) - например "banana 3 0" заспавнит в координатах (3;0). Логично, блядь. И да, спавнится банан. Бесполезный и беспощадный;', '#D4C518');
			this.write('- map - показать карту;', '#D4C518');
			this.write('- delete id - удалить объект с определённым id;', '#D4C518');
			this.write('- look around - осмотреться', '#D4C518');
			this.write('- help - показать эту справку.', '#D4C518');
			break;
		case 'look':
			if (commands[1] == "around") {
				if (this.world.itemMap[this.player.y][this.player.x]){
					var that = this;
					this.write('Неподалёку есть: ' + this.world.itemMap[this.player.y][this.player.x].map(function(id) {
						return that.world.things[id].name;
					}));
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
	this.inventory = new Array();
}

function Thing(world, x, y, id, name) {
	this.x = x;
	this.y = y;
	this.id = id;
	this.name = name;
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

	this.addThing = function(x, y, name) {
		if (this.unusedId.length) {
			var id = this.unusedId[0];
			this.unusedId.splice(0,1);
		} else {
			var id = this.things.length;
		}
		this.things[id] = new Thing(this, x, y, id, name);
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
		//pass
	}
	this.removeThing = function (id) {
		if (this.things[id]) {
			delete this.things[id];
			this.unusedId.push(id); 
		}
	}

	this.addThing(5, 0, "Banana");
	this.addThing(5, 2, "Banana");
	this.showMap();
	game.log("Map initiated");
}