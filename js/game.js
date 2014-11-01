function Game() {
	var write = function(string) {
		$('#terminal').append('<p>'+string+'</p>');
		$('#cursor').appendTo($('#terminal').children(':last-child'));

		if ($('#terminal').children().length > 10) {
			$('#terminal').children(':first').remove();
		}
	}

	this.interpret = function(string) {
		commands = string.toLowerCase().split(' ')
		switch(commands[0]) {
			case 'go':
				switch(commands[1]) {
					case 'west':
						write('Going west.');
						break;
					case 'north':
						write('Going north.');
						break;
					case 'east':
						write('Going east.');
						break;
					case 'south':
						write('Going south.');
						break;
					default:
						write('There is no such thing as ' + commands[1] + '.');
				}
				break;
			default:
				write('I dont know how to ' + commands[0] + '.')
		}
	}
}

function Player() {
	
}