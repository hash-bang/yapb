var progress = require('..');

var myProgress = progress('Loading widget {{current}} of {{max}}', {max: 30});

var current = 0;
var tick = function() {
	if (current == 30) { // Stop
		myProgress.remove();
	} else {
		myProgress.update(++current);
		setTimeout(tick, 50);
	}
};
setTimeout(tick, 50);
