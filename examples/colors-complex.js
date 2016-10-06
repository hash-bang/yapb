/**
* Example showing how to wrap existing functions to add color
* This is unnecessarily complex to show off all the bells-and-whistles. You should look at examples/color.js for a simpler version
*/

var progress = require('..');

var myProgress = progress(
	'{{#blue}}{{spinner}}{{/blue}}' + // Blue spinner
	'{{#bold}} Loading widgets... {{/bold}}' + // Bold text
	'[{{#bgGreen}}{{bar.complete}}{{/bgGreen}}{{bar.incomplete}}]' + // Break the bar down into the complete + incomplete segments and color them seperately
	' {{#bgMagenta}}{{percent}}%{{/bgMagenta}}' // Magenta background percentage
, {
	max: 300,
	completeChar: ' ',   // } Set to clear as we're using color to show the bar
	incompleteChar: ' ', // }
});

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
