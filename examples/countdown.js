/**
* Example showing a countdown timer - assuming we add 1 tick every 1 second
*/

var progress = require('..');
var max = 30; // What we are counting down from in seconds
max *= 4; // Multiply by four so we get a smooth update every 1/4th of a second

var myProgress = progress('{{spinner}} Countdown: {{eta}}', {
	max: max,
	spinnerTheme: 'toggle9',
});

var current = 0;
var tick = function() {
	if (current == max) { // Stop
		myProgress.remove();
	} else {
		myProgress.update(++current);
		setTimeout(tick, 250);
	}
};
tick();
