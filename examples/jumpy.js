/**
* Example progress bar that jumps around and never finishes
*/

var progress = require('..');

var myProgress = progress('Procrastinating [{{bar}}]', {max: 75});

var current = 0;
var tick = function() {
	myProgress.update(Math.random() * 75);
	setTimeout(tick, 50);
};
setTimeout(tick, 50);
