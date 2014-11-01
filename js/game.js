function Game() {
	this.player = new Player(0,0);
	var write = function(string, color) {
		//green - 1F9822, red - C71F0B, yellow - D4C518, blue - 0C61B8
		color = typeof color !== 'undefined' ? color : "#FFF";
		$('#terminal').append('<p style="color:' + color + ';">'+string+'</p>');
		$('#cursor').appendTo($('#terminal').children(':last-child'));

		if ($('#terminal').children().length > 19) {
			$('#terminal').children(':first').remove();
		}
	}

	this.interpret = function(string) {
		commands = string.toLowerCase().split(' ')
		write('>'+string.toLowerCase(), '#1F9822')
		switch(commands[0]) {
			case 'go':
				switch(commands[1]) {
					case 'west':
						write('Going west.');
						this.player.x -= 1;
						break;
					case 'north':
						write('Going north.');
						this.player.y += 1;
						break;
					case 'east':
						write('Going east.');
						this.player.x += 1;
						break;
					case 'south':
						write('Going south.');
						this.player.y -= 1;
						break;
					default:
						write('There is no such thing as ' + commands[1] + '.');
				}
				$('#x').text(this.player.x);
				$('#y').text(this.player.y);
				break;
			default:
				write('I dont know how to ' + commands[0] + '.')
		}
	}
}

function Player(x, y) {
	this.x = x;
	this.y = y;

	this.getInfo = function() {
		alert('i am exist');
	}
}