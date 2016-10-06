/**
* Pretty much an entire screen of spinners, bars and assorted madness
*/

var colors = require('chalk');
var cliSpinners = require('cli-spinners');
var progress = require('..');
var windowSize = require('window-size');

// Utility function to clear the screen
var clearScreen = () => { process.stdout.cursorTo(0,0); process.stdout.clearScreenDown() };
// Utility function cto clear a line
var clearLine = line => { process.stdout.cursorTo(0, line); process.stdout.clearLine(1) };
// Utility function to pick a random item from an array
var pick = arr => arr[Math.floor(Math.random() * arr.length)];
// Utility function to choose from two choices (optional chance)
var maybe = (chance) => Math.random() * 100 > (chance || 50);
// Utility function to shuffle an array
var shuffle = arr => arr.sort(() => Math.round(Math.random()));

// Make as many progress bars as their are lines in the console (minus some breathing space)
var progressBars = [];

for (var l = 0; l < windowSize.height - 2; l++) {
	// Form what we will be outputting by mixing different elements (each has a percentage change they will appear)
	var template = [];
	while (!template.length) { // Continue until we get something meaningful
		template = shuffle([
			maybe(60) ? 'text' : '',
			maybe(50) ? 'spinner' : '',
			maybe(50) ? 'bar' : '',
			maybe(20) ? 'percent' : '',
		]
			.filter(i => !!i) // Remove empty items
		);
	}

	// Base setup per line
	var setup = {
		max: 100, // Out of 100%
		throttle: false,
		render: function(line) {
			process.stdout.write(line);
		},
		current: Math.round(Math.random() * 50),
	};

	// Setup the text template
	setup.text = template
		.map(function(el) { // For each template element...
			switch (el) {
				case 'spinner':
					var col = pick(['red', 'green', 'yellow', 'blue', 'magenta', 'cyan']);
					setup.spinnerTheme = pick(Object.keys(cliSpinners));
					return '{{#' + col + '}}{{spinner}}{{/' + col + '}}';
				case 'text':
					return (
						(maybe(60) ? pick(['Artfully', 'Deliciously', 'Intelligently', 'Willfully', 'Subtly', 'Treacherously', 'Deceitfully']) + ' ': '')
						+
						pick(['Loading', 'Thinking', 'Gesticulating', 'Calculating', 'Scheming', 'Conniving', 'Designing', 'Conspiring']) + '...'
					);
				case 'bar':
					setup.completeChar = pick(['=', '+', 'X']);
					setup.incompleteChar = pick([' ', ' ', '_', '-']);
					if (maybe(30)) { // Fancy bar?
						var col = pick(['bgWhite', 'bgRed', 'bgYellow', 'bgBlue', 'bgMagenta', 'bgCyan']); // Formatting color to use
						setup.completeChar = pick([' ', ' ', ' ', ' ', 'X', '=']);
						return '[{{#' + col + '}}{{bar.complete}}{{/' + col + '}}{{bar.incomplete}}]';
					} else {
						return '[{{bar}}]';
					}
				case 'percent': return '{{percent}}%';
			}
		})
		.join(' ');
	progressBars.push(progress(setup));
}

var tick = function() {
	progressBars.forEach(function(pb, line) {
		clearLine(line);
		var adjust = ((Math.random() * 20) - 10);
		var adjusted = Math.round(pb.settings.current + adjust);
		if (adjusted <= 0) {
			adjusted = 0;
		} else if (adjusted >= 100) {
			adjusted = 100;
		}
		pb.update(adjusted);
	});

	setTimeout(tick, 100);
};

clearScreen();
tick();
