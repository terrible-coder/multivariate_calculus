type endpoint = {
	value: number,
	inclusive: boolean
}

export class Interval {
	/**
	 * The left endpoint of the interval.
	 */
	readonly left: endpoint;
	/**
	 * The right endpoint of the interval.
	 */
	readonly right: endpoint;

	private constructor(a: endpoint, b: endpoint) {
		this.left = a;
		this.right = b;
	}

	/**
	 * Creates and returns a closed interval onject.
	 * @param a The left side limit of the interval.
	 * @param b The right side limit of the interval.
	 */
	public static closed(a: number, b: number) {
		return new Interval({
			value: a,
			inclusive: true
		},
		{
			value: b,
			inclusive: true
		});
	}

	/**
	 * Creates and returns a closed interval onject.
	 * @param a The left side limit of the interval.
	 * @param b The right side limit of the interval.
	 */
	public static open(a: number, b: number) {
		return new Interval({
			value: a,
			inclusive: false
		},
		{
			value: b,
			inclusive: false
		});
	}

	/**
	 * Creates and returns a left-open right-closed interval onject.
	 * @param a The left side limit of the interval.
	 * @param b The right side limit of the interval.
	 */
	public static open_closed(a: number, b: number) {
		return new Interval({
			value: a,
			inclusive: false
		},
		{
			value: b,
			inclusive: true
		});
	}

	/**
	 * Creates and returns a left-closed and right-open interval onject.
	 * @param a The left side limit of the interval.
	 * @param b The right side limit of the interval.
	 */
	public static closed_open(a: number, b: number) {
		return new Interval({
			value: a,
			inclusive: true
		},
		{
			value: b,
			inclusive: false
		});
	}

	/**
	 * Checks whether the left side of the interval is open.
	 */
	public isLeftOpen() {
		return !this.left.inclusive;
	}

	/**
	 * Checks whether the left side of the interval is closed.
	 */
	public isLeftClosed() {
		return this.left.inclusive;
	}

	/**
	 * Checks whether the right side of the interval is open.
	 */
	public isRightOpen() {
		return !this.right.inclusive;
	}

	/**
	 * Checks whether the right side of the interval is closed.
	 */
	public isRightClosed() {
		return this.right.inclusive;
	}

	/**
	 * Checks whether both sides of `this` interval are open.
	 */
	public isOpen() {
		return this.isLeftOpen() && this.isRightOpen();
	}

	/**
	 * Checks whether both sides of `this` interval are closed.
	 */
	public isClosed() {
		return this.isLeftClosed() && this.isRightClosed();
	}

	/**
	 * Checks whether a given number falls within the range specified by `this`
	 * interval or not.
	 * @param x The number to check for.
	 */
	public contains(x: number) {
		if(this.isOpen())
			return this.left.value < x && x < this.right.value;
		if(this.isClosed())
			return this.left.value <= x && x <= this.right.value;
		if(this.isLeftClosed())
			return this.left.value <= x && x < this.right.value;
		if(this.isRightClosed())
			return this.left.value < x && x <= this.right.value;
	}
}