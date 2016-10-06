/**
* Example showing spinners, bars and dynamic text
*/

var progress = require('..');

var myProgress = progress('{{spinner}} Loading widgets... [{{bar}}] {{percent}}%', {max: 300});

var current = 0;
var tick = function() {
	if (current == 300) { // Stop
		myProgress.remove();
	} else {
		myProgress.update(++current);
		setTimeout(tick, 50);
	}
};
setTimeout(tick, 50);
