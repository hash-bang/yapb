var cliSpinners = require('cli-spinners');
var mustache = require('mustache');
var windowSize = require('window-size');

function CLIProgress(text, settings) {
	var progress = this;

	progress.settings = {
		text: '{{current}} / {{max}} [{{bar}}] {{percent%}}',
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
		percent: function() {
			var pText = Math.round(progress.settings.current / progress.settings.max * 100).toString();
			return Array(3 - pText.length).join(' ') + pText; // Left pad with spaces
		},

		spinner: '',
		spinnerTheme: 'dots',
		spinnerFrame: 0,
		refreshSpinner: function() {
			var spinnerFrames = cliSpinners[progress.settings.spinnerTheme];
			if (!spinnerFrames) throw new Error('Spinner theme not found: "' + progress.settings.spinnerTheme + '"');
			if (++progress.settings.spinnerFrame >= spinnerFrames.frames.length) progress.settings.spinnerFrame = 0;
			progress.settings.spinner = spinnerFrames.frames[progress.settings.spinnerFrame];
		},
	};


	/**
	* Return the output that will be sent to the output stream
	* return {string} The raw console-suitable output
	*/
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


	/**
	* Update and re-render the progress bar
	* This is really just a shortcut for .set() + .render(progress.format())
	* @return {Object} This object instance
	*/
	progress.update = function(val) {
		if (typeof val == 'number') {
			progress.set({current: val});
		} else {
			progress.set(val);
		}
		progress.settings.refreshSpinner();
		progress.settings.render(progress.format());
		return progress;
	};


	/**
	* Remove the bar from the screen
	* @return {Object} This object instance
	*/
	progress.remove = function() {
		progress.settings.clear();
		return progress;
	};


	/**
	* Set one or more options
	* @param {Object} val The object values to set
	* @return {Object} This object instance
	*/
	progress.set = function(val) {
		if (!val) return;
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
