var mustache = require('mustache');
var windowSize = require('window-size');

function CLIProgress(text, settings) {
	var progress = this;

	progress.settings = {
		text: '{{current}} / {{max}} [BAR]',
		current: 0,
		max: 100,
		stream: process.stderr,
		render: function(line) {
			progress.settings.stream.cursorTo(0);
			progress.settings.stream.clearLine(1);
			progress.settings.stream.write(line);
		},
		clear: function() {
			progress.settings.stream.clearLine(1);
			progress.settings.stream.cursorTo(0);
		},
		width: windowSize.width,
		completeChar: '=',
		incompleteChar: '-',
	};

	progress.format = function() {
		var text = mustache.render(progress.settings.text, progress.settings);
		// Rendering a bar? {{{
		if (text.indexOf('[[BAR]]') > -1) {
			var maxBarWidth = windowSize.width - text.length;
			var barCompleteWidth = Math.round(progress.settings.current / progress.settings.max * maxBarWidth);

			text = text.replace('[[BAR]]',
				Array(barCompleteWidth).join(progress.settings.completeChar)
				+
				Array(maxBarWidth - barCompleteWidth).join(progress.settings.incompleteChar)
			);
		}
		// }}}
		return text;
	};

	progress.update = function(val) {
		if (typeof val == 'number') {
			progress.set({current: val});
		} else {
			progress.set(val);
		}
		progress.settings.render(progress.format());
		return progress;
	};

	progress.remove = function() {
		progress.settings.clear();
		return progress;
	};

	progress.set = function(val) {
		for (var k in val) {
			progress.settings[k] = val[k];
		}
		if (val.text) { // Setting the formatting text?
			progress.settings.text = progress.settings.text.replace('{{bar}}', '[[BAR]]'); // Remove mustache stuff as we have to calculate the width post-render
			mustache.parse(progress.settings.text);
		}
		return progress;
	};

	// Load initial settings {{{
	if (typeof text == 'string') {
		progress.set({text: text});
	} else {
		progress.set(text);
	}
	if (typeof settings == 'object') progress.set(settings);
	// }}}
};

module.exports = function CLIProgressFactory(text, settings) {
	return new CLIProgress(text, settings);
};
