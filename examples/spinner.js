var progress = require('..');

var myProgress = progress('{{spinner}} Playing pong', {spinnerTheme: 'pong'});

var tick = function() {
	myProgress.update();
	setTimeout(tick, 50);
};
tick();
