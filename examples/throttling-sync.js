/**
* Example showing a progress bar limited to a 50ms refresh rate
* Unlike the original throttling example this one shows how to throttle for synchronous operations
* Since sync operations stall the main Node thread we have to deploy a different method to update the progress bar
*
* WARNING: This example will only run if the Node version != 4 because of the bug https://github.com/nodejs/node/issues/1741
*/

var progress = require('..');

var myProgress = progress('Being speedy... [{{bar}}] {{percent}}%', {throttle: 50, throttleSync: true});

while (true) {
	myProgress.update(Math.random() * 100);
}
