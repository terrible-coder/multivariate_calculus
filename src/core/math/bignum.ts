import { IndeterminateForm, DivisionByZero } from "../errors";

/**
 * Specifies a *rounding behaviour* for numerical operations on [[BigNum]]
 * which are capable of discarding some precision. This is based on the JAVA
 * implementation of rounding behaviour. Read more [here](https://docs.oracle.com/javase/8/docs/api/java/math/RoundingMode.html). 
 */
export enum RoundingMode {
	/** Rounds the number away from 0. */
	UP,
	/** Rounds the number down towards 0. */
	DOWN,
	/** Rounds the number up towards positive infinity. */
	CEIL,
	/** Rounds the number down towards negative infinity. */
	FLOOR,
	/** Rounds towards nearest neighbour. In case it is equidistant it is rounded up. */
	HALF_UP,
	/** Rounds towards nearest neighbour. In case it is equidistant it is rounded down. */
	HALF_DOWN,
	/** Rounds towards nearest neighbour. In case it is equidistant it is rounded to nearest even number. */
	HALF_EVEN,
	/** Rounding mode to assert that no rounding is necessary as an exact representation is possible. */
	UNNECESSARY
}

/**
 * An object type which holds information about the context settings that
 * describes certain rules for certain numerical operations.
 */
export type MathContext = {
	/**
	 * The number of decimal places a [[BigNum]] object should store. This does
	 * not represent the number of significant digits in the number unlike the
	 * JAVA implementation of the same concept.
	 */
	precision: number;
	/**
	 * The rounding algorithm that should be used for a particular numerical
	 * operation. Care must be taken as to when the UNNECESSARY mode is used,
	 * it will throw an exception if an exact representation of the result is
	 * not found.
	 */
	rounding: RoundingMode
}

export namespace MathContext {
	/**
	 * The default [[MathContext]] used when an exact representation cannot be
	 * achieved for some operation.
	 */
	export const DEFAULT_CONTEXT: MathContext = {
		precision: 17,
		rounding: RoundingMode.UP
	};

	/**
	 * The [[MathContext]] used for high precision calculation. Stores up to
	 * 50 places after the decimal point with [[RoundingMode.UP]] rounding algorithm.
	 */
	export const HIGH_PRECISION: MathContext = {
		precision: 50,
		rounding: RoundingMode.UP
	};

	/**
	 * The [[MathContext]] which defines how numbers are dealt with in science.
	 * It has slightly higher precision value than the default context with
	 * [[RoundingMode.HALF_EVEN]] rounding algorithm.
	 */
	export const SCIENTIFIC: MathContext = {
		precision: 20,
		rounding: RoundingMode.HALF_EVEN
	};

	/**
	 * The [[MathContext]] which defines how to deal with high precision
	 * numbers in science. It has the same precision value as the high precision one
	 * and [[RoundingMode.HALF_EVEN]] rounding algorithm.
	 */
	export const HIGH_PREC_SCIENTIFIC: MathContext = {
		precision: 50,
		rounding: RoundingMode.HALF_EVEN
	};
}

/**
 * Immutable, arbitrary precision decimal numbers. A BigNum consists of an
 * integer part and a decimal part stored as string objects. The precision of
 * the number is completely controlled by the user. A [[MathContext]] object
 * helps to specify the number of decimal places (not significant figures) the
 * user wants and what rounding algorithm should be used. Every operation is
 * carried out by an intermediate result which is then rounded to the preferred
 * number of decimal places using the preferred rounding algorithm.
 */
export class BigNum {

	/**
	 * The circle constant PI correct upto 100 decimal places.
	 * 
	 * Source: http://paulbourke.net/miscellaneous/numbers/
	 */
	public static PI = new BigNum("3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679");

	/**
	 * The constant Euler's number correct upto 100 decimal places.
	 * 
	 * Source: http://paulbourke.net/miscellaneous/numbers/
	 */
	public static E = new BigNum("2.7182818284590452353602874713526624977572470936999595749669676277240766303535475945713821785251664274");

	/**
	 * The natural logarithm of 10 correct upto 100 decimal places. This comes
	 * in vary handy for natural base to common base logarithm.
	 * 
	 * Source: http://paulbourke.net/miscellaneous/numbers/
	 */
	public static ln10 = new BigNum("2.3025850929940456840179914546843642076011014886287729760333279009675726096773524802359972050895982983");

	/**
	 * The constant zero.
	 */
	public static ZERO = new BigNum("0");
	/**
	 * The constant one.
	 */
	public static ONE = new BigNum("1");
	/**
	 * The constant two.
	 */
	public static TWO = new BigNum("2");
	/**
	 * The constant three.
	 */
	public static THREE = new BigNum("3");
	/**
	 * The constant four.
	 */
	public static FOUR = new BigNum("4");
	/**
	 * The constant five.
	 */
	public static FIVE = new BigNum("5");
	/**
	 * The constant six.
	 */
	public static SIX = new BigNum("6");
	/**
	 * The constant seven.
	 */
	public static SEVEN = new BigNum("7");
	/**
	 * The constant eight.
	 */
	public static EIGHT = new BigNum("8");
	/**
	 * The constant nine.
	 */
	public static NINE = new BigNum("9");

	/**
	 * The default [[MathContext]] used for numerical operations related to [[BigNum]]
	 * when a context has not been mentioned separately. Reassign this value
	 * if you want to have all subsequent operations in some [[MathContext]]
	 * other than [[MathContext.DEFAULT_CONTEXT]].
	 */
	static MODE = MathContext.DEFAULT_CONTEXT;

	/**
	 * The integer part of the number.
	 */
	readonly integer: string;
	/**
	 * The decimal part of the number.
	 */
	readonly decimal: string;

	/**
	 * Creates a [[BigNum]] instance from the string representation of the number.
	 * @param num The string representation of the number in decimal system.
	 */
	constructor(num: string) {
		const parts = num.split(".");
		if(parts.length > 2)
			throw new Error("Number format exception.");
		let [integer, decimal] = parts;
		let i;
		if(integer !== undefined) {
			for(i = 0; i < integer.length; i++)
				if(integer.charAt(i) !== '0')
					break;
			integer = integer.substring(i) || "0";
		} else integer = "0";
		if(decimal !== undefined) {
			for(i = decimal.length - 1; i >= 0; i--)
				if(decimal.charAt(i) !== '0')
					break;
			decimal = decimal.substring(0, i+1) || "0";
		} else decimal = "0";
		this.integer = integer;
		this.decimal = decimal;
	}

	/**
	 * Returns this number as a single string, with no decimal point.
	 * @ignore
	 */
	private get asString() {
		if(this.integer === "0")
			return this.decimal;
		if(this.decimal === "" || this.decimal === "0")
			return this.integer;
		return this.integer + this.decimal;
	}

	/**
	 * Returns this number as an unscaled BigInt instance.
	 * @ignore
	 */
	private get asBigInt() {
		return BigInt(this.asString);
	}

	/**
	 * The number of digits after the decimal point stored by this number.
	 * @ignore
	 */
	private get precision() {
		if(this.decimal === "0")
			return 0;
		return this.decimal.length;
	}

	/**
	 * The sign of this number.
	 */
	public get sign() {
		if(this.integer === "0" && this.decimal === "0")
			return 0;
		if(this.integer.charAt(0) === '-')
			return -1;
		return 1;
	}

	/**
	 * Given a string, adds padding to the rear or front. This is an implementation
	 * to only aid with numerical operations where the numbers are stored as
	 * strings. Do not use for general use.
	 * @param s The string which is to be padded.
	 * @param n Number of times padding string must be used.
	 * @param char The padding string. It must be a single character string.
	 * @param front Flag value to indicate whether to pad at front or at rear.
	 * @ignore
	 */
	private static pad(s: string, n: number, char: string, front=false) {
		if(char.length > 1)
			throw new Error("Padding string must have only one character.");
		return front? "".padEnd(n, char) + s: s + "".padEnd(n, char);
	}

	/**
	 * Aligns the decimal point in the given numbers by adding padding 0's
	 * at the end of the smaller number string.
	 * @param a 
	 * @param b 
	 * @returns The strings aligned according to position of decimal point.
	 * @ignore
	 */
	private static align(a: BigNum, b: BigNum) {
		const pa = a.precision, pb = b.precision;
		const d = pa - pb;
		let aa = a.asString,
			ba = b.asString;
		if(d > 0)
			ba = BigNum.pad(ba, d, "0");
		else if(d < 0)
			aa = BigNum.pad(aa, -d, "0");
		return [aa, ba];
	}

	/**
	 * Inserts a decimal point in the string at a given index. The `index`
	 * value is calculated from the rear of the string starting from 1.
	 * @param a The number as a string.
	 * @param index The index from the rear.
	 * @ignore
	 */
	private static decimate(a: string, index: number) {
		if(index < 0)
			throw new Error("Cannot put decimal point at negative index.");
		let s = a, sgn = "";
		if(s.charAt(0) === '-') {
			s = s.substring(1);
			sgn = "-";
		}
		if(index > s.length)
			s = "0." + BigNum.pad(s, index - s.length, "0", true);
		else
			s = s.substring(0, s.length - index) + "." + s.substring(s.length - index);
		return sgn + s;
	}

	/**
	 * Evaluates the absolute value of this number.
	 * @param x The number whose absolute value is to be found.
	 * @returns The absolute value of the argument.
	 */
	public static abs(x: BigNum) {
		return x.integer.charAt(0) === '-'? new BigNum(x.integer.substring(1) + "." + x.decimal): x;
	}

	/**
	 * Rounds off a given number according to some [[MathContext]]. The different
	 * rounding algorithms implemented are identical to the ones defined by the
	 * [RoundingMode](https://docs.oracle.com/javase/8/docs/api/java/math/RoundingMode.html)
	 * class of JAVA.
	 * @param x The number to round off.
	 * @param context The [[MathContext]] which defines how the number is to be rounded.
	 * @returns The number representing the rounded value of the argument according to the given context.
	 */
	public static round(x: BigNum, context: MathContext) {
		if(x.precision > context.precision) {
			const num = x.asBigInt;
			const diff = x.precision - context.precision;
			const divider = BigInt(BigNum.pad("1", diff, "0"));
			let rounded = num / divider, last = num % divider;
			const one = BigInt("1"), ten = BigInt("10");
			const FIVE = BigInt(BigNum.pad("5", diff - 1, "0")), ONE = BigInt(BigNum.pad("1", diff - 1, "0"));
			switch(context.rounding) {
			case RoundingMode.UP:
				if(last >= ONE) rounded += one;
				else if(last <= -ONE) rounded -= one;
				break;
			case RoundingMode.DOWN:
				break;
			case RoundingMode.CEIL:
				if(last >= ONE) rounded += one;
				break;
			case RoundingMode.FLOOR:
				if(last <= -ONE) rounded -= one;
				break;
			case RoundingMode.HALF_DOWN:
				if(last > FIVE) rounded += one;
				else if(last < -FIVE) rounded -= one;
				break;
			case RoundingMode.HALF_UP:
				if(last >= FIVE) rounded += one;
				else if(last <= -FIVE) rounded -= one;
				break;
			case RoundingMode.HALF_EVEN:
				if(last > FIVE) rounded += one;
				else if(last < -FIVE) rounded -= one;
				else if(Math.abs(Number(rounded % ten)) % 2 !== 0) {
					if(last === FIVE) rounded += one;
					else if(last === -FIVE) rounded -= one;
				}
				break;
			case RoundingMode.UNNECESSARY:
				if(last > 0 || last < 0)
					throw Error("Rounding necessary. Exact representation not known.");
				break;
			}
			let r = rounded.toString();
			return new BigNum(BigNum.decimate(r, context.precision));
		} else return x;
	}

	/**
	 * The comparator function. This compares `this` to `that` and returns
	 * * 0 if they are equal
	 * * 1 if `this` > `that`
	 * * -1 if `this` < `that`
	 * @param that Number to compare with.
	 */
	public compareTo(that: BigNum) {
		const [a, b] = BigNum.align(this, that);
		const x = BigInt(a) - BigInt(b);
		return x > 0? 1: x < 0? -1: 0;
	}

	/**
	 * Determines whether `this` is less than `that`.
	 * @param that Number to compare with.
	 */
	public lessThan(that: BigNum) {
		return this.compareTo(that) === -1;
	}

	/**
	 * Determines whether `this` is more than `that`.
	 * @param that Number to compare with.
	 */
	public moreThan(that: BigNum) {
		return this.compareTo(that) === 1;
	}

	/**
	 * Checks whether `this` and `that` are equal numbers. Equality is checked
	 * only till the number of decimal places specified by [[BigNum.MODE]].
	 * @param that The number to check against.
	 */
	public equals(that: BigNum): boolean;
	/**
	 * Checks whether `this` and `that` are equal numbers. Equality is checked
	 * only till the number of decimal places specified by `context`.
	 * @param that The number to check against.
	 * @param context The [[MathContext]] value to use for equality check.
	 */
	public equals(that: BigNum, context: MathContext): boolean;
	public equals(that: BigNum, context = BigNum.MODE) {
		const A = BigNum.round(this, context);
		const B = BigNum.round(that, context);
		return A.integer === B.integer && A.decimal === B.decimal;
	}

	/**
	 * Determines whether `this` is less than or equal to `that`.
	 * @param that Number to compare with.
	 */
	public lessEquals(that: BigNum) {
		return this.lessThan(that) || this.equals(that);
	}

	/**
	 * Determines whether `this` is more than or equal to `that`.
	 * @param that Number to compare with.
	 */
	public moreEquals(that: BigNum) {
		return this.moreThan(that) || this.equals(that);
	}

	/**
	 * The negative value of `this`.
	 */
	public get neg() {
		if(this.integer.charAt(0) === '-')
			return new BigNum(this.integer.substring(1) + "." + this.decimal);
		return new BigNum("-" + this.toString());
	}

	/**
	 * Adds two [[BigNum]] instances. The higher precision value of the two is
	 * chosen as the precision for the result and rounding is according to
	 * [[BigNum.MODE]].
	 * @param that The number to add this with.
	 * @returns this + that.
	 */
	public add(that: BigNum): BigNum;
	/**
	 * Adds two [[BigNum]] instances. The higher precision value of the two is
	 * chosen as the precision for the result and rounding is according to the
	 * given context settings.
	 * @param that The number to add this with.
	 * @param context The context settings object to use.
	 * @returns this + that.
	 */
	public add(that: BigNum, context: MathContext): BigNum;
	public add(that: BigNum, context?: MathContext) {
		context = context || BigNum.MODE;
		const [a, b] = BigNum.align(this, that);
		let sum = (BigInt(a) + BigInt(b)).toString();
		const precision = Math.max(this.precision, that.precision);
		const res = new BigNum(BigNum.decimate(sum, precision));
		return BigNum.round(res, context);
	}

	/**
	 * Subtracts one [[BigNum]] instance from another. The higher precision value
	 * of the two is chosen as the precision for the result and rounding is
	 * according to [[BigNum.MODE]].
	 * @param that The number to subtract from this.
	 * @returns this - that.
	 */
	public sub(that: BigNum): BigNum;
	/**
	 * Subtracts one [[BigNum]] instance from another. The higher precision value
	 * of the two is chosen as the precision for the result and rounding is
	 * according to the given context settings.
	 * @param that The number to subtract from this.
	 * @param context The context settings object to use.
	 * @returns this - that.
	 */
	public sub(that: BigNum, context: MathContext): BigNum;
	public sub(that: BigNum, context?: MathContext) {
		context = context || BigNum.MODE;
		const [a, b] = BigNum.align(this, that);
		let sum = (BigInt(a) - BigInt(b)).toString();
		const precision = Math.max(this.precision, that.precision);
		const res = new BigNum(BigNum.decimate(sum, precision));
		return BigNum.round(res, context);
	}

	/**
	 * Multiplies two [[BigNum]] instances. The sum of the precisions of the two
	 * is chosen as the precision of the result and rounding is according to
	 * [[BigNum.MODE]].
	 * @param that The number to multiply this with.
	 * @returns this * that.
	 */
	public mul(that: BigNum): BigNum;
	/**
	 * Multiplies two [[BigNum]] instances. The sum of the precisions of the two
	 * is chosen as the precision of the result and rounding is according to
	 * the given context settings.
	 * @param that The number to multiply this with.
	 * @param context The context settings object to use.
	 * @returns this * that.
	 */
	public mul(that: BigNum, context: MathContext): BigNum;
	public mul(that: BigNum, context?: MathContext) {
		context = context || BigNum.MODE;
		let prod = (this.asBigInt * that.asBigInt).toString();
		const precision = this.precision + that.precision;
		const res = new BigNum(BigNum.decimate(prod, precision));
		return BigNum.round(res, context);
	}

	/**
	 * Divides one [[BigNum]] instance by another with rounding according to
	 * [[BigNum.MODE]].
	 * @param that The number to divide this by.
	 * @returns this / that.
	 */
	public div(that: BigNum): BigNum;
	/**
	 * Divides one [[BigNum]] instance by another with rounding according to the
	 * given context settings.
	 * @param that The number to divide this by.
	 * @param context The context settings object to use.
	 * @returns this / that.
	 */
	public div(that: BigNum, context: MathContext): BigNum;
	public div(that: BigNum, context?: MathContext) {
		context = context || BigNum.MODE;
		if(that.sign === 0) {
			if(this.sign === 0)
				throw new IndeterminateForm("Cannot determine 0/0.");
			throw new DivisionByZero("Cannot divide by zero.");
		}
		const precision = context.precision;
		const p1 = this.precision, p2 = that.precision, p = precision - p1 + p2;
		const a = p < 0? this.asBigInt: BigInt(BigNum.pad(this.asString, p, "0")); //this.asBigInt * BigInt(Math.pow(10, precision - p1 + p2));
		const b = that.asBigInt;
		let quo = (a / b).toString();
		const res = new BigNum(BigNum.decimate(quo, (p < 0)? p1: precision));
		return BigNum.round(res, context);
	}

	/**
	 * Raises a [[BigNum]] to an integer power. This function may be made
	 * private in future versions. It is adviced not to use this function
	 * except for development purposes.
	 * @param base The base number.
	 * @param index The index / exponent to which the base is to be raised.
	 * @param context The context settings to use.
	 */
	static intpow(base: BigNum, index: number, context=BigNum.MODE) {
		if(index !== (index|0))
			throw "Only defined for integer values of the power.";
		let p = BigNum.ONE;
		for(let i = 0; i < index; i++)
			p = p.mul(base, context);
		return p;
	}

	/**
	 * Raises `this` to the power of `ex`.
	 * @param ex A number.
	 */
	public pow(ex: BigNum): BigNum;
	/**
	 * Raises `this` to the power of `ex` using the rounding according to the
	 * given context settings.
	 * @param ex A number.
	 * @param context The context settings object to use.
	 */
	public pow(ex: BigNum, context: MathContext): BigNum;
	public pow(ex: BigNum, context=BigNum.MODE) {
		if(ex.decimal === "" || ex.decimal === "0")
			return BigNum.intpow(this, parseInt(ex.integer), context);
		const ctx: MathContext = {
			precision: 2 * context.precision,
			rounding: context.rounding
		};
		const y = ex.mul(BigNum.ln(this, ctx), ctx);
		return BigNum.round(BigNum.exp(y, ctx), context);
	}

	/**
	 * Calculates the trigonometric sine of a given number with rounding
	 * according to [[BigNum.MODE]].
	 * @param x A number.
	 */
	public static sin(x: BigNum): BigNum;
	/**
	 * Calculates the trigonometric sine of a given number with rounding
	 * according to the given context settings.
	 * @param x A number.
	 * @param context The context settings to use.
	 */
	public static sin(x: BigNum, context: MathContext): BigNum;
	public static sin(x: BigNum, context=BigNum.MODE) {
		/*
			sin x = sum((-1)^n * x^(2n+1) / (2n+1)!, 0, infty)
			t_n = ((-1)^n / (2n+1)!) * x^(2n+1)
			t_n1 = ((-1)^n+1 / (2n+3)!) * x^(2n+3)
			t_n1 = - (t_n/(2n+3)(2n+2)) * x^2
		*/
		const ctx: MathContext = {
			precision: 2 * context.precision,
			rounding: context.rounding
		};
		const x_sq = x.mul(x, ctx);
		let sum = BigNum.ZERO;
		let term = x;
		let n = BigNum.ZERO;
		while(true) {
			sum = sum.add(term, ctx);
			const a = BigNum.TWO.mul(n).add(BigNum.THREE);
			const b = BigNum.TWO.mul(n).add(BigNum.TWO);
			const f = a.mul(b).neg;
			const term1 = term.mul(x_sq, ctx).div(f, ctx);
			if(BigNum.abs(term1).equals(BigNum.ZERO, ctx))
				return BigNum.round(sum, context);
			term = term1;
			n = n.add(BigNum.ONE);
		}
	}

	/**
	 * Calculates the trigonometric cosine of a given number with rounding
	 * according to [[BigNum.MODE]].
	 * @param x A number.
	 */
	public static cos(x: BigNum): BigNum;
	/**
	 * Calculates the trigonometric cosine of a given number with rounding
	 * according to the given context settings.
	 * @param x A number.
	 * @param context The context settings to use.
	 */
	public static cos(x: BigNum, context: MathContext): BigNum;
	public static cos(x: BigNum, context=BigNum.MODE) {
		/*
			cos x = sum((-1)^n * x^(2n) / (2n)!, 0, infty)
			t_n = (-1)^n * x^(2n) / (2n)!
			t_n1 = (-1)^n+1 * x^(2n+2) / (2n + 2)!
			t_n1 = - (t_n / (2n + 1)(2n + 2)) * x^2
		*/
		const ctx: MathContext = {
			precision: 2 * context.precision,
			rounding: context.rounding
		};
		const x_sq = x.mul(x, ctx);
		let sum = BigNum.ZERO;
		let term = BigNum.ONE;
		let n = BigNum.ZERO;
		while(true) {
			sum = sum.add(term, ctx);
			const a = BigNum.TWO.mul(n).add(BigNum.ONE);
			const b = BigNum.TWO.mul(n).add(BigNum.TWO);
			const f = a.mul(b).neg;
			const term1 = term.mul(x_sq, ctx).div(f, ctx);
			if(BigNum.abs(term1).equals(BigNum.ZERO, ctx))
				return BigNum.round(sum, context);
			term = term1;
			n = n.add(BigNum.ONE);
		}
	}

	/**
	 * Calculates the exponential of a given number with rounding according to
	 * [[BigNum.MODE]].
	 * @param x A number.
	 */
	public static exp(x: BigNum): BigNum;
	/**
	 * Calculates the exponential of a given number with rounding according to
	 * the given context settings.
	 * @param x A number
	 * @param context The context settings to use.
	 */
	public static exp(x: BigNum, context: MathContext): BigNum;
	public static exp(x: BigNum, context=BigNum.MODE) {
		const ctx: MathContext = {
			precision: 2 * context.precision,
			rounding: context.rounding
		};
		let sum = BigNum.ZERO;
		let term = BigNum.ONE;
		let n = BigNum.ZERO;
		while(true) {
			sum = sum.add(term, ctx);
			const term1 = term.mul(x, ctx).div(n.add(BigNum.ONE), ctx);
			if(BigNum.abs(term1).equals(BigNum.ZERO, ctx))
				return BigNum.round(sum, context);
			term = term1;
			n = n.add(BigNum.ONE);
		}
	}

	/**
	 * Evaluates the natural logarithm of a given number `x` (`|x| < 1`).
	 * @param x A number.
	 * @param context The context settings to use.
	 * @ignore
	 */
	private static ln_less(x: BigNum, context=BigNum.MODE) {
		const ctx: MathContext = {
			precision: 2 * context.precision,
			rounding: context.rounding
		};
		let sum = BigNum.ZERO;
		let term = x;
		let n = BigNum.ONE;
		while(true) {
			sum = sum.add(term.div(n, ctx), ctx);
			const term1 = term.mul(x, ctx).neg;
			const term2 = term1.div(n.add(BigNum.ONE, ctx), ctx);
			if(BigNum.abs(term2).equals(BigNum.ZERO, ctx))
				return BigNum.round(sum, context);
			term = term1;
			n = n.add(BigNum.ONE);
		}
	}

	/**
	 * Calculates the natural logarithm (to the base `e`) of a given number
	 * with rounding according to [[BigNum.MODE]].
	 * @param x A number.
	 */
	public static ln(x: BigNum): BigNum;
	/**
	 * Calculates the natural logarithm (to the base `e`) of a given number
	 * with rounding according to the given context settings.
	 * @param x A number.
	 * @param context The context settings to use.
	 */
	public static ln(x: BigNum, context: MathContext): BigNum;
	public static ln(x: BigNum, context=BigNum.MODE) {
		const ctx: MathContext = {
			precision: 2 * context.precision,
			rounding: context.rounding
		};
		if(x.lessEquals(BigNum.ZERO))
			throw "Undefined";
		if(x.lessThan(BigNum.TWO))
			return BigNum.round(
				BigNum.ln_less(x.sub(BigNum.ONE, ctx), ctx),
				context
				);
		return BigNum.round(newton_raphson(
			y => BigNum.exp(y, ctx).sub(x, ctx),
			y => BigNum.exp(y, ctx),
			BigNum.ONE,
			ctx
			),
			context);
	}

	/**
	 * Calculates the common logarithm (to the base `10`) of a given number
	 * with rounding according to [[BigNum.MODE]].
	 * @param x A number.
	 */
	public static log(x: BigNum): BigNum;
	/**
	 * Calculates the common logarithm (to the base `10`) of a given number
	 * with rounding according to the given context settings.
	 * [[MathContext]].
	 * @param x A number.
	 * @param context The context settings to use.
	 */
	public static log(x: BigNum, context: MathContext): BigNum;
	public static log(x: BigNum, context=BigNum.MODE) {
		const ctx: MathContext = {
			precision: 2 * context.precision,
			rounding: context.rounding
		};
		const y = BigNum.ln(x, ctx).div(BigNum.ln10, ctx);
		return BigNum.round(y, context);
	}

	/**
	 * The canonical representation of the number as a string.
	 * @returns The string representation of `this`.
	 */
	public toString() {
		return this.integer + "." + this.decimal;
	}
}

/**
 * Uses the Newton-Raphson algorithm to find the root of a given equation.
 * The exact derivative (found analytically) is assumed to be known.
 * @param f Function whose root is to be found
 * @param f_ The derivative of `f`.
 * @param x The initial trial solution.
 * @returns The root of the given function `f` correct upto the number of decimal
 * 			places specified by the default [[MathContext]].
 * @ignore
 */
function newton_raphson(f: (x: BigNum)=>BigNum, f_: (x: BigNum)=>BigNum, x: BigNum, context=BigNum.MODE) {
	const ctx: MathContext = {
		precision: 2 * context.precision,
		rounding: context.rounding
	};
	let X = x;
	let Y: BigNum;
	while(true) {
		if(f(X).equals(BigNum.ZERO, ctx))
			return BigNum.round(X, context);
		Y = new BigNum(X.toString());
		X = X.sub(f(X).div(f_(X), ctx), ctx);
		if(X.equals(Y, ctx))
			return BigNum.round(X, context);
	}
}