import { IndeterminateForm, DivisionByZero } from "../errors";
import { parseNum, pad, decimate } from "./parsers";
import { MathContext, RoundingMode } from "./context";
import { newton_raphson } from "./numerical";

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
	 * The circle constant \\(\pi\\) correct upto 100 decimal places.
	 * 
	 * Source: http://paulbourke.net/miscellaneous/numbers/
	 */
	public static PI = new BigNum("3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679");

	/**
	 * The constant Euler's number (\\(e\\)) correct upto 100 decimal places.
	 * 
	 * Source: http://paulbourke.net/miscellaneous/numbers/
	 */
	public static E = new BigNum("2.7182818284590452353602874713526624977572470936999595749669676277240766303535475945713821785251664274");

	/**
	 * The natural logarithm of \\(10\\) correct upto 100 decimal places. This comes
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
	constructor(num: string);
	/**
	 * Creates a [[BigNum]] instance from the decimal representation of the
	 * number. This instance created will store the exact binary floating
	 * point value of the number. Even though it uses the `toString()` method
	 * to convert the number to a string it might be unpredictable at times.
	 * @param num A numeric expression.
	 */
	constructor(num: number);
	/**
	 * Creates a [[BigNum]] instance from the integral and fractional part
	 * of the number. Both the arguments are expected to be string
	 * representations of integers.
	 * @param integer The whole part of the number.
	 * @param fraction The fractional part of the number.
	 */
	constructor(integer: string, fraction: string);
	constructor(a: number | string, b?: string) {
		let num: string;
		if(b === undefined)
			if(typeof a === "number")
				num = a.toString();
			else num = a;
		else if(typeof a === "string" && typeof b === "string")
			num = a + "." + b;
		else throw new TypeError("Illegal argument type.");
		[this.integer, this.decimal] = parseNum(num);
	}

	/**
	 * Returns this number as a single string, with no decimal point.
	 * @ignore
	 */
	private get asString() {
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
		return this.decimal.length;
	}

	/**
	 * The sign of this number.
	 */
	public get sign() {
		if(this.integer === "" && this.decimal === "")
			return 0;
		if(this.integer.charAt(0) === '-')
			return -1;
		return 1;
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
			ba = pad(ba, d, "0");
		else if(d < 0)
			aa = pad(aa, -d, "0");
		return [aa, ba];
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
		if(x.precision <= context.precision)
			return x;
		const num = x.asBigInt;
		const diff = x.precision - context.precision;
		const divider = BigInt(pad("1", diff, "0"));
		let rounded = num / divider, last = num % divider;
		const one = BigInt("1"), ten = BigInt("10");
		const FIVE = BigInt(pad("5", diff - 1, "0")), ONE = BigInt(pad("1", diff - 1, "0"));
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
		return new BigNum(decimate(r, context.precision));
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
		const res = new BigNum(decimate(sum, precision));
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
		const res = new BigNum(decimate(sum, precision));
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
		const res = new BigNum(decimate(prod, precision));
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
		const a = p < 0? this.asBigInt: BigInt(pad(this.asString, p, "0")); //this.asBigInt * BigInt(Math.pow(10, precision - p1 + p2));
		const b = that.asBigInt;
		let quo = (a / b).toString();
		const res = new BigNum(decimate(quo, (p < 0)? p1: precision));
		return BigNum.round(res, context);
	}

	/**
	 * The modulo operator. The extended definition for non-integer numbers has
	 * been used. For two numbers \\(a\\) and \\(b\\),
	 * \\[a mod b = a - b\lfloor\frac{a}{b}\rfloor\\]
	 * @param that A number.
	 */
	public mod(that: BigNum) {
		const quo = this.div(that, {precision: 0, rounding: RoundingMode.FLOOR});
		return this.sub(that.mul(quo));
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
		// using Maclaurin series for sin x
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
		// using Maclaurin series for cos x
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
	 * Calculates the trigonometric tangent of a given number with rounding
	 * according to [[BigNum.MODE]].
	 * @param x A number.
	 */
	public static tan(x: BigNum): BigNum;
	/**
	 * Calculates the trigonometric tangent of a given number with rounding
	 * according to the given context settings.
	 * @param x A number.
	 * @param context The context settings to use.
	 */
	public static tan(x: BigNum, context: MathContext): BigNum;
	public static tan(x: BigNum, context=BigNum.MODE) {
		const ctx: MathContext = {
			precision: 2 * context.precision,
			rounding: context.rounding
		}
		return BigNum.round(BigNum.sin(x, ctx).div(BigNum.cos(x, ctx), ctx), context);
	}

	/**
	 * Calculates the inverse trigonometric sine of a given value with rounding
	 * according to [[BigNum.MODE]].
	 * @param x A number.
	 */
	public static asin(x: BigNum): BigNum;
	/**
	 * Calculates the inverse trigonometric sine of a given value with rounding
	 * according to the given context setings.
	 * @param x A number.
	 * @param context The context settings to use.
	 */
	public static asin(x: BigNum, context: MathContext): BigNum;
	public static asin(x: BigNum, context=BigNum.MODE) {
		/*
			asin x = sum(prod(2m+1, 0, n-1)/(n!2^n(2n+1))x^(2n+1), 0, infty)
			t_n = ((2n-1)(2n-3)...5.3.1)/(n!2^n(2n+1))x^(2n+1)
			t_n1 = ((2n+1)(2n-1)...5.3.1)/((n+1)!2^(n+1)(2n+3))x^(2n+3)
			t_n1 = t_n * ((2n+1)^2/(2(n+1)(2n+3)))x^2
		*/
		if(BigNum.abs(x).moreThan(BigNum.ONE))
			throw new Error("Undefined");
		const ctx: MathContext = {
			precision: 2 * context.precision,
			rounding: context.rounding
		}
		let sum = BigNum.ZERO;
		let x_sq = x.mul(x, ctx);
		const f = function(n: BigNum) {
			const nxt = BigNum.TWO.mul(n).add(BigNum.ONE)
			const a = nxt; //BigNum.intpow(nxt, 2);
			const b = BigNum.TWO.mul(n.add(BigNum.ONE)); //.mul(BigNum.TWO.mul(n).add(BigNum.THREE));
			const fac = a.div(b, ctx);
			return fac; //x_sq.mul(fac, ctx);
		}
		let term = x;
		let n = BigNum.ZERO;
		let fac = BigNum.ONE;
		while(n.lessThan(new BigNum("40"))) {
			sum = sum.add(term, ctx);
			fac = fac.mul(f(n));
			const term1 = fac.mul(term, ctx).mul(x_sq, ctx).div(BigNum.TWO.mul(n).add(BigNum.ONE), ctx);
			if(BigNum.abs(term1).equals(BigNum.ZERO, ctx))
				return BigNum.round(sum, context);
			term = term1;
			n = n.add(BigNum.ONE);
		}
		return BigNum.round(sum, context);
	}

	public static acos(x: BigNum): BigNum;
	public static acos(x: BigNum, context: MathContext): BigNum;
	public static acos(x: BigNum, context=BigNum.MODE) {
		const ctx: MathContext = {
			precision: 2 * context.precision,
			rounding: context.rounding
		}
		const piby2 = BigNum.PI.div(BigNum.TWO, ctx);
		return BigNum.round(piby2.sub(BigNum.asin(x, ctx), ctx), context);
	}

	/**
	 * Calculates the atan value for a number whose magnitude (absolute value)
	 * is less than unity.
	 * @param x A number.
	 * @param context The context settings to use.
	 * @ignore
	 */
	private static atan_less(x: BigNum, context: MathContext) {
		const ctx: MathContext = {
			precision: 2 * context.precision,
			rounding: context.rounding
		}
		const x_sq = x.mul(x, ctx);
		let term = x;
		let sum = BigNum.ZERO;
		let n = BigNum.ZERO;
		while(true) {
			const temp = term.div(BigNum.TWO.mul(n).add(BigNum.ONE), ctx);
			sum = sum.add(temp, ctx);
			const term1 = term.mul(x_sq).neg;
			const temp1 = term1.div(BigNum.TWO.mul(n).add(BigNum.THREE));
			if(BigNum.abs(temp1).equals(BigNum.ZERO, ctx))
				return BigNum.round(sum, context);
			term = term1;
			n = n.add(BigNum.ONE);
		}
	}

	/**
	 * Calculates the atan value for a number whose magnitude (absolute value)
	 * is greater than unity.
	 * @param x A number.
	 * @param context The context settings to use.
	 * @ignore
	 */
	private static atan_more(x: BigNum, context: MathContext) {
		const ctx: MathContext = {
			precision: 2 * context.precision,
			rounding: context.rounding
		}
		const x_sq = x.mul(x, ctx).neg;
		let term = BigNum.ONE.div(x, ctx);
		let sum = BigNum.ZERO;
		let n = BigNum.ZERO;
		while(true) {
			const temp = term.div(BigNum.TWO.mul(n).add(BigNum.ONE), ctx);
			sum = sum.add(temp, ctx);
			const term1 = term.div(x_sq, ctx);
			const temp1 = term1.div(BigNum.TWO.mul(n).add(BigNum.THREE), ctx);
			if(BigNum.abs(temp1).equals(BigNum.ZERO, ctx))
				break;
			term = term1;
			n = n.add(BigNum.ONE);
		}
		const piby2 = BigNum.PI.div(BigNum.TWO, ctx);
		let res: BigNum;
		if(x.moreThan(BigNum.ONE))
			res = piby2.sub(sum, ctx);
		else
			res = piby2.add(sum, ctx).neg;
		return BigNum.round(res, context);
	}

	/**
	 * Calculates the inverse trigonometric tangent of a given value with rounding
	 * according to [[BigNum.MODE]].
	 * @param x A number.
	 */
	public static atan(x: BigNum): BigNum;
	/**
	 * Calculates the inverse trigonometric tangent of a given value with rounding
	 * according to the given context settings.
	 * @param x A number.
	 * @param context The context settings to use.
	 */
	public static atan(x: BigNum, context: MathContext): BigNum;
	public static atan(x: BigNum, context=BigNum.MODE) {
		if(BigNum.abs(x).lessThan(BigNum.ONE))
			return BigNum.atan_less(x, context);
		if(x.equals(BigNum.ONE, context))
			return BigNum.PI.div(BigNum.FOUR, context);
		if(x.equals(BigNum.ONE.neg, context))
			return BigNum.PI.div(BigNum.FOUR, context);
		return BigNum.atan_more(x, context);
	}

	/**
	 * Calculates the hyperbolic sine of a given value with rounding according
	 * to [[BigNum.MODE]].
	 * @param x A number.
	 */
	public static sinh(x: BigNum): BigNum;
	/**
	 * Calculates the hyperbolic sine of a given value with rounding according
	 * to the given context settings.
	 * @param x A number.
	 * @param context The context settings to use.
	 */
	public static sinh(x: BigNum, context: MathContext): BigNum;
	public static sinh(x: BigNum, context=BigNum.MODE) {
		const ctx: MathContext = {
			precision: 2 * context.precision,
			rounding: context.rounding
		}
		const x_sq = x.mul(x, ctx);
		let sum = BigNum.ZERO;
		let term = x;
		let n = BigNum.ZERO;
		while(true) {
			sum = sum.add(term, ctx);
			const a = BigNum.TWO.mul(n).add(BigNum.TWO);
			const b = BigNum.TWO.mul(n).add(BigNum.THREE);
			const fac = a.mul(b);
			const term1 = term.mul(x_sq, ctx).div(fac, ctx);
			if(BigNum.abs(term1).equals(BigNum.ZERO, ctx))
				return BigNum.round(sum, context);
			term = term1;
			n = n.add(BigNum.ONE);
		}
	}

	/**
	 * Calculates the hyperbolic cosine of a given value with rounding according
	 * to [[BigNum.MODE]].
	 * @param x A number.
	 */
	public static cosh(x: BigNum): BigNum;
	/**
	 * Calculates the hyperbolic cosine of a given value with rounding according
	 * to the given context settings.
	 * @param x A number.
	 * @param context The context settings to use.
	 */
	public static cosh(x: BigNum, context: MathContext): BigNum;
	public static cosh(x: BigNum, context=BigNum.MODE) {
		const ctx: MathContext = {
			precision: 2 * context.precision,
			rounding: context.rounding
		}
		const x_sq = x.mul(x, ctx);
		let sum = BigNum.ZERO;
		let term = BigNum.ONE;
		let n = BigNum.ZERO;
		while(true) {
			sum = sum.add(term, ctx);
			const a = BigNum.TWO.mul(n).add(BigNum.TWO);
			const b = BigNum.TWO.mul(n).add(BigNum.ONE);
			const fac = a.mul(b);
			const term1 = term.mul(x_sq, ctx).div(fac, ctx);
			if(BigNum.abs(term1).equals(BigNum.ZERO, ctx))
				return BigNum.round(sum, context);
			term = term1;
			n = n.add(BigNum.ONE);
		}
	}
	
	/**
	 * Calculates the hyperbolic tangent of a given value with rounding according
	 * to the given context settings.
	 * @param x A number.
	 */
	public static tanh(x: BigNum): BigNum;
	/**
	 * Calculates the hyperbolic tangent of a given value with rounding according
	 * to the given context settings.
	 * @param x A number.
	 * @param context The context settings to use.
	 */
	public static tanh(x: BigNum, context: MathContext): BigNum;
	public static tanh(x: BigNum, context=BigNum.MODE) {
		const ctx: MathContext = {
			precision: 2 * context.precision,
			rounding: context.rounding
		}
		return BigNum.round(BigNum.sinh(x, ctx).div(BigNum.cosh(x, ctx), ctx), context);
	}

	public static asinh(x: BigNum): BigNum;
	public static asinh(x: BigNum, context: MathContext): BigNum;
	public static asinh(x: BigNum, context=BigNum.MODE) {
		const ctx: MathContext = {
			precision: 2 * context.precision,
			rounding: context.rounding
		}
		const x_sq = x.mul(x, ctx);
		let term = x, temp = x;
		let sum = BigNum.ZERO;
		let n = BigNum.ZERO;
		while(true) {
			sum = sum.add(temp, ctx);
			const a = BigNum.TWO.mul(n).add(BigNum.ONE);
			const b = BigNum.TWO.mul(n).add(BigNum.TWO);
			const fac = a.div(b, ctx).neg;
			const term1 = term.mul(fac, ctx).mul(x_sq, ctx);
			const temp1 = term1.div(BigNum.TWO.mul(n).add(BigNum.THREE), ctx);
			if(BigNum.abs(temp1).equals(BigNum.ZERO, ctx))
				return BigNum.round(sum, context);
			term = term1;
			temp = temp1;
			n = n.add(BigNum.ONE);
		}
	}

	public static atanh(x: BigNum): BigNum;
	public static atanh(x: BigNum, context: MathContext): BigNum;
	public static atanh(x: BigNum, context=BigNum.MODE) {
		const ctx: MathContext = {
			precision: 2 * context.precision,
			rounding: context.rounding
		}
		const x_sq = x.mul(x, ctx);
		let term = x, temp = x;
		let sum = BigNum.ZERO;
		let n = BigNum.ZERO;
		while(true) {
			sum = sum.add(temp, ctx);
			const term1 = term.mul(x_sq, ctx);
			const temp1 = term1.div(BigNum.TWO.mul(n).add(BigNum.THREE), ctx);
			if(BigNum.abs(temp1).equals(BigNum.ZERO, ctx))
				return BigNum.round(sum, context);
			term = term1;
			temp = temp1;
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
	 * Evaluates the natural logarithm of a given number \\(x\\)(\\(|x| < 1\\)).
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
	 * Calculates the natural logarithm (to the base \\(e\\)) of a given number
	 * with rounding according to [[BigNum.MODE]].
	 * @param x A number.
	 */
	public static ln(x: BigNum): BigNum;
	/**
	 * Calculates the natural logarithm (to the base \\(e\\)) of a given number
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
	 * Calculates the common logarithm (to the base \\(10\\)) of a given number
	 * with rounding according to [[BigNum.MODE]].
	 * @param x A number.
	 */
	public static log(x: BigNum): BigNum;
	/**
	 * Calculates the common logarithm (to the base \\(10\\)) of a given number
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
		let s = "";
		if(this.integer === "-" && this.decimal === "")
			s = "0.0";
		else if(this.integer === "-")
			s = "-0." + this.decimal;
		else
			s = (this.integer || "0") + "." + (this.decimal || "0");
		return s;
	}
}
