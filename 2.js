function Game() {
	var write = function(string) {
		$('#terminal').append('<p>'+string+'</p>');
		if ($('#terminal').children().length > 10) {
			$('#terminal').children(':first').remove();
		}
		

	}

	this.interpret = function(string) {
		commands = string.split(' ')
		switch(commands[0]) {
			case 'go':
				switch(commands[1]) {
					case 'west':
						write('going west');
						break;
					case 'north':
						write('going north');
						break;
					case 'east':
						write('going east');
						break;
					case 'south':
						write('going south');
						break;
					default:
						write('theres no such thing as ' + commands[1]);
				}
				break;
			default:
				write('You say bullshit, man.')
		}
	}
}

function Player() {
	
}