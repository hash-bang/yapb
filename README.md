CLI-Progress
============
Progress bars, spinners and updating statistics for CLI processes!


**Features**

* Progress bar that auto-sizes to the terminal width using [window-size](https://github.com/jonschlinkert/window-size)
* Spinner support via [cli-spinners](https://github.com/sindresorhus/cli-spinners)
* Proper support for clearing up after itself
* [Mustache](https://github.com/janl/mustache.js) templating support
* Very simple syntax where any setting can be changed at any time - even the template
* 'Lazy' initialization of values, you can setup the progress bar before knowing any of the data you will be feeding into it (setting the 'maximum' is usually required by all other progress libraries)
* Works fully without any 'raw' values - use it purely for spinners or other dynamic text
* Works in a [fully synchronous environment](examples/throttling-sync.js)


```javascript
var progress = require('cli-progress');

var myProgress = progress('{{spinner}} Loading widgets... [{{bar}}] {{percent}}%', {max: 300});

var current = 0;
var tick = function() {
	if (current == 300) { // Stop at 300 ticks
		myProgress.remove();
	} else {
		myProgress.update(++current);
		setTimeout(tick, 50);
	}
};
setTimeout(tick, 50);
```

See the [examples folder](examples/) for more.


Settings
========
Settings are simple keys stored in `progressBar.settings`.
You can define your own properties, tokens and templates as needed at any time. See the [Mustache documentation](https://github.com/janl/mustache.js) for more information.


| Key              | Type     | Default          | Description                                                                                                                 |
|------------------|----------|------------------|-----------------------------------------------------------------------------------------------------------------------------|
| `text`           | string   | `'{{current}} / {{max}} [{{bar}}] {{percent}}%'` | The template to use when rendering the object                                               |
| `current`        | number   | 0                | The 'current' progress. This can be any number lower than `max`                                                             |
| `max`            | number   | 100              | The 'max' progress value. This should always be higher or equal to `current`                                                |
| `stream`         | Stream   | `process.stderr` | What output stream to use                                                                                                   |
| `render`         | Function | *see code*       | The render function used to output the object to the screen. The default version clears the active line and paints the output with the result of `format()` |
| `clear`          | Function | *see code*       | The function to invoke on any `remove()` call. The default version resets the current line                                  |
| `width`          | number   | *result of windowSize.width* | The terminal width. This should be automatically calculated                                                     |
| `completeChar`   | string   | `=`              | The character to use when rendering a progress bar. This character represents the left-most 'done' portion of the bar       |
| `incompleteChar` | string   | `=`              | The character to use when rendering a progress bar. This character represents the right-most 'not done' portion of the bar  |
| `percent`        | Function | *see code*       | Simple pre-prepared template function to return a number between 0 - 100 representing the process of `current / max * 100`  |
| `throttle`       | number   | 50               | Restrict redrawing to this many milliseconds. Set this to any falsy value to disable throttling                             |
| `throttleSync`   | boolean  | false            | Set this to true if the bar needs redrawing in a synchronous environment where tick'd redraws are unavailable               |
| `spinner`        | Function | *see code*       | Spinner rendering function. This function is called on each draw phase to return the current spinner                        |
| `spinnerTheme`   | string   | `dots`           | The spinner theme within [cli-spinners](https://github.com/sindresorhus/cli-spinners) to use when drawing the spinner       |
| `spinnerFrame`   | number   | 0                | The current spinner animation frame. This is used by the `spinner` callback to store its current position                   |
| `startTime`      | number   | `Date.now()`     | Timestamp in milliseconds when the object was created (used to calculate `eta`)                                             |
| `eta`            | Function | *see code*       | The render function used to calculate and output the estimated completion time using `startTime` and `current` as a guide   |



API
===

update([settings|current value])
--------------------------------
Main function to accept optional updated settings or a single new `current` value.
This function will also redraw the object on the screen after update.
If you wish to update settings *without* redrawing use `set()` instead.


set([settings|current value])
-----------------------------
Update the settings or a new `current` value.
Unlike `update()` this function *does not* redraw the object. Use `update()` for that.


remove()
--------
Remove the object from the screen.


format()
--------
Return the current, formatted text representing the object.


updateNow()
-----------
Function to force an update, even if its not scheduled (because of throttling).
