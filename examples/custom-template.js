/**
* Example showing how to inject your own Mustache components into the template engine
* Defining your own formatters via yapb is a better idea than calculating the input yourself as drawing is throttled and will avoid unnecessary calculation overhead
*/

var progress = require('..');

var myProgress = progress('Today is {{day}} and {{#pick}}the living is easy, it is a good day to die, everything is coming up Millhouse{{/pick}}', {

	// To declare a callback simply make a function which returns a value
	day: function() {
		return (new Date).toString();
	},

	// To return a mustache template return a function
	// This example function takes a comma separated string and returns a random entry
	// For more information see the Mustache documentation - https://github.com/janl/mustache.js#functions
	pick: function() {
		return function(text, render) {
			var sayings = render(text).split(/\s*,\s*/);
			return sayings[Math.round(Math.random()*sayings.length)];
		};
	},
});

var tick = function() {
	myProgress.update();
	setTimeout(tick, 1000);
};
tick();
