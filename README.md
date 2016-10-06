CLI-Progress
============
Progress bars, spinners and updating statistics for CLI processes!

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


Why?
----
I couldn't find a progress bar rendering system that did exactly what I was after.

This module provides the following over the existing solutions:

* Progress bar that auto-sizes to the terminal width using [window-size](https://github.com/jonschlinkert/window-size)
* Spinner support via [cli-spinners](https://github.com/sindresorhus/cli-spinners)
* Proper support for clearing up after itself
* [Mustache](https://github.com/janl/mustache.js) templating support
* Very simple syntax where any setting can be changed at any time - even the template
