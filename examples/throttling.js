/**
* Example showing a progress bar limited to a 50ms refresh rate
*/

var progress = require('..');

var myProgress = progress('Being speedy... [{{bar}}] {{percent}}%', {throttle: 50}); // 50 is the default anyway but we'll make it explicit

// Update the progress bar 1000 times a second (in theory anyway)
var tick = function() {
	myProgress.update(Math.random() * 100);
	setTimeout(tick, 1);
};
tick();
