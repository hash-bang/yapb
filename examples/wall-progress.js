/**
* An entire screen of progress bars randomly filling
*/

var colors = require('chalk');
var cliSpinners = require('cli-spinners');
var progress = require('..');
var windowSize = require('window-size');

// Utility function to clear the screen
var clearScreen = () => { process.stdout.cursorTo(0,0); process.stdout.clearScreenDown() };
// Utility function cto clear a line
var clearLine = line => { process.stdout.cursorTo(0, line); process.stdout.clearLine(1) };

// Make as many progress bars as their are lines in the console (minus some breathing space)
var progressBars = Array(windowSize.height - 2).fill(
	progress('{{spinner}} [{{bar}}] {{percent}}%', {
		throttle: false,
		render: function(line) {
			process.stdout.write(line);
		},
		spinnerTheme: 'dots',
		current: 0,
		max: 100,
	})
);

var tick = function() {
	progressBars.forEach(function(pb, line) {
		clearLine(line);
		var adjust = ((Math.random() * 6) - 3);
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
