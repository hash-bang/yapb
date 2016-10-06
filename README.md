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
