/**
 * window.setTimeout wrapper allowing to pause & resume.
 * @see http://stackoverflow.com/a/3969760/5078169
 *
 * @version 1.0.0
 *
 * @param		function	callback							A function to be executed after the timer expires.
 * @param		int				delay									Optional. The time, in milliseconds (thousandths of a second), the timer should wait before the specified function or code is executed. Default to 0, meaning execute "immediately", or more accurately, as soon as possible.
 * @param		mixed			param1, ..., paramN		Optional. Additional parameters which are passed through to the function specified by func once the timer expires.
 */
export default class Timer {

	constructor( callback, delay ) {
		this.args			= arguments;
		this.delay		= delay,
		this.callback = callback;

		this.resume();
	}

	clear() {
		clearTimeout( this.timer );
	};

	pause() {
		this.clear();
		this.delay -= new Date() - this.start;
	};

	resume() {
		this.start = new Date();
		this.timer = setTimeout(
			() => this.callback.apply( this, Array.prototype.slice.call( this.args, 2, this.args.length ) ),
			this.delay
		);
	};
}
