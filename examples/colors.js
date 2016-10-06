/**
* Very simple color example
* Since we're using Mustache for rendering we have to use {{#COLOR}}text{{/COLOR}} formatting
* See https://github.com/chalk/chalk for details of what colors / styles are available
*/

var progress = require('..');

var myProgress = progress('{{#blue}}{{spinner}}{{/blue}} Doing crazy stuff...', {spinnerTheme: 'bouncingBall'});

var tick = function() {
	myProgress.update();
	setTimeout(tick, 80);
};
tick();
