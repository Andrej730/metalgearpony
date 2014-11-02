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
			this.write(this.world.things.length);
			break;
		case 'banana':
			this.world.addThing(commands[1], commands[2], "Banana");
			break;
		case 'map':
			this.world.showMap();
			break;
		default:
			this.write('I dont know how to ' + commands[0] + '.');
		}
	}

	this.log = function(arg) {
		this.write(arg);
	}

	this.world = new World(this);
	this.player = new Player(this, 0, 0);
}

function Player(game, x, y){
	this.x = x;
	this.y = y;
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


	this.things = new Array();
	
	this.showMap = function() {
		this.map.forEach(function(arg) {
			game.write(arg);
		});
	}

	this.addThing = function(x, y, name) {
		this.things.push(new Thing(this, x, y, this.things.length, name));
		game.log(name+" spawned at " + x+"; "+y);
		this.map[y][x] = 2;
		
	}

	this.addThing(5, 0, "Banana");
	this.addThing(5, 2, "Banana");
	this.showMap();
	game.log("Map initiated");
}