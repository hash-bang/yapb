var cliSpinners = require('cli-spinners');
var colors = require('chalk');
var mustache = require('mustache');
var stringLength = require('string-length');
var windowSize = require('window-size');

function CLIProgress(text, settings) {
	var progress = this;

	progress.settings = {
		text: '{{current}} / {{max}} [{{bar}}] {{percent}}%',
		current: 0,
		max: 100,
		stream: process.stderr,
		render: function(line) {
			progress.settings.stream.cursorTo(0);
			progress.settings.stream.clearLine(1);
			progress.settings.stream.write(line);
		},
		clear: function() {
			progress.settings.stream.clearLine(0);
			progress.settings.stream.cursorTo(0);
		},
		width: windowSize.width,
		completeChar: '=',
		incompleteChar: '-',
		percent: function() {
			var pText = Math.round(progress.settings.current / progress.settings.max * 100).toString();
			var strLen = stringLength(pText);
			if (strLen > 3) return pText; // Already over max length
			return Array(3 - strLen).join(' ') + pText; // Left pad with spaces
		},
		throttle: 50,

		// Spinner rendering {{{
		spinner: '',
		spinnerTheme: 'dots',
		spinnerFrame: 0,
		// }}}
	};

	// Map all color / style functions from chalk into the settings object (e.g. bold => chalk.bold closure) {{{
	Object.keys(colors.styles).forEach(function(style) {
		progress.settings[style] = function() {
			return function(text, render) {
				return colors[style](render(text));
			};
		};
	});
	// }}}

	/**
	* Function to refresh a spinner
	* Override this if you're using your own weird library
	*/
	progress.refreshSpinner = function() {
		var spinnerFrames = cliSpinners[progress.settings.spinnerTheme];
		if (!spinnerFrames) throw new Error('Spinner theme not found: "' + progress.settings.spinnerTheme + '"');
		if (++progress.settings.spinnerFrame >= spinnerFrames.frames.length) progress.settings.spinnerFrame = 0;
		progress.settings.spinner = spinnerFrames.frames[progress.settings.spinnerFrame];
	};

	/**
	* Return the output that will be sent to the output stream
	* return {string} The raw console-suitable output
	*/
	progress.format = function() {
		var text = mustache.render(progress.settings.text, progress.settings);
		// Rendering a bar? {{{
		if (text.indexOf('[[BAR') > -1) {
			var maxBarWidth = windowSize.width - stringLength(text);
			if (!progress.settings.max) progress.settings.max = progress.settings.current > 0 ? progress.settings.current : 0;
			var barCompleteWidth = Math.round(progress.settings.current / progress.settings.max * maxBarWidth);

			var completeBits = Array(barCompleteWidth).join(progress.settings.completeChar);
			var incompleteBits = maxBarWidth - barCompleteWidth > 0 ? Array(maxBarWidth - barCompleteWidth).join(progress.settings.incompleteChar) : '';

			text = text
				.replace(/\[\[BAR\]\]/g, completeBits + incompleteBits)
				.replace(/\[\[BAR.complete\]\]/ig, completeBits)
				.replace(/\[\[BAR.incomplete\]\]/ig, incompleteBits)
		}
		// }}}
		return text;
	};


	/**
	* Holder for the throttle timeout handle
	* This will be the setTimeout() response if we are throttling
	* @var {Object}
	*/
	progress.throttleHandle;


	/**
	* Update and re-render the progress bar
	* This is really just a shortcut for .set() + .render(progress.format())
	* @params {Object|number} Either set a number of properties or the 'current' value if passed a number
	* @return {Object} This object instance
	* @see set()
	*/
	progress.update = function(val) {
		progress.set(val);

		if (progress.settings.throttle && progress.settings.throttleSync) { // Employ sync throttling method (count from last update)
			// if (Date.now() >= progress.lastUpdate + progress.settings.throttle) progress.updateNow(); // Only allow redraw if we're within the update window
			progress.updateNow();
		} else if (progress.settings.throttle) { // Employ async throttling method (setTimeout)
			if (!progress.throttleHandle) progress.throttleHandle = setTimeout(progress.updateNow, progress.settings.throttle);
		} else { // Not using throttle anyway
			progress.updateNow();
		}

		return progress;
	};

	/**
	* Actual updater
	* This is hidden behind the update throttler so its not called too many times in one cycle
	*/
	progress.updateNow = function() {
		progress.refreshSpinner();
		progress.settings.render(progress.format());
		clearTimeout(progress.throttleHandle);
		progress.throttleHandle = null;
	};


	/**
	* Remove the bar from the screen
	* @return {Object} This object instance
	*/
	progress.remove = function() {
		clearTimeout(progress.throttleHandle); // Release any throttled redraws that may be queued
		progress.settings.clear();
		return progress;
	};


	/**
	* Set one or more options or tokens
	* NOTE: Unlike .set() this function DOES NOT refresh the progress bar
	* @params {Object|number} Either set a number of properties or the 'current' value if passed a number
	* @return {Object} This object instance
	* @see set()
	*/
	progress.set = function(val) {
		if (!val) return;
		if (typeof val == 'number') {
			progress.settings.current = val;
		} else {
			for (var k in val) {
				progress.settings[k] = val[k];
			}
			if (val.text) { // Setting the formatting text?
				progress.settings.text = progress.settings.text.replace(/\{\{bar(.*?)\}\}/g, '[[BAR$1]]'); // Remove mustache stuff as we have to calculate the width post-render
				mustache.parse(progress.settings.text);
			}
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
