var mustache = require('mustache');
var windowSize = require('window-size');

function CLIProgress(settings) {
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
	};

	progress.format = function() {
		var text = mustache.render(progress.settings.text, progress.settings);
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
		if (val.text) mustache.parse(progress.settings.text);
		return progress;
	};

	// Load initial settings {{{
	if (typeof settings == 'string') {
		progress.set({text: settings});
	} else {
		progress.set(settings);
	}
	// }}}
};

module.exports = function CLIProgressFactory(settings) {
	return new CLIProgress(settings);
};
