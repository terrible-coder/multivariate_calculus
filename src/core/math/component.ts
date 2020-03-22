import { IndeterminateForm, DivisionByZero } from "../errors";
import { parseNum, pad, decimate } from "./parsers";
import { MathContext, RoundingMode } from "./context";
import { newton_raphson } from "./numerical";

type num1d = {
	integer: string,
	decimal: string
}

/**
 * Immutable, arbitrary precision decimal numbers. A Component consists of an
 * integer part and a decimal part stored as string objects. The precision of
 * the number is completely controlled by the user. A [[MathContext]] object
 * helps to specify the number of decimal places (not significant figures) the
 * user wants and what rounding algorithm should be used. Every operation is
 * carried out by an intermediate result which is then rounded to the preferred
 * number of decimal places using the preferred rounding algorithm.
 */
export class Component {

	/**
	 * The circle constant \\(\pi\\) correct upto 100 decimal places.
	 * 
	 * Source: http://paulbourke.net/miscellaneous/numbers/
	 */
	public static PI = new Component({integer: "3", decimal: "1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679"});

	/**
	 * The constant Euler's number (\\(e\\)) correct upto 100 decimal places.
	 * 
	 * Source: http://paulbourke.net/miscellaneous/numbers/
	 */
	public static E = new Component({integer: "2", decimal: "7182818284590452353602874713526624977572470936999595749669676277240766303535475945713821785251664274"});

	/**
	 * The natural logarithm of \\(10\\) correct upto 100 decimal places. This comes
	 * in very handy for natural base to common base logarithm.
	 * 
	 * Source: http://paulbourke.net/miscellaneous/numbers/
	 */
	public static ln10 = new Component({integer: "2", decimal: "3025850929940456840179914546843642076011014886287729760333279009675726096773524802359972050895982983"});


	/**
	 * The constant zero.
	 */
	public static ZERO = new Component({integer: "", decimal: ""});
	/**
	 * The constant one.
	 */
	public static ONE = new Component({integer: "1", decimal: ""});
	/**
	 * The constant two.
	 */
	public static TWO = new Component({integer: "2", decimal: ""});
	/**
	 * The constant three.
	 */
	public static THREE = new Component({integer: "3", decimal: ""});
	/**
	 * The constant four.
	 */
	public static FOUR = new Component({integer: "4", decimal: ""});
	/**
	 * The constant five.
	 */
	public static FIVE = new Component({integer: "5", decimal: ""});
	/**
	 * The constant six.
	 */
	public static SIX = new Component({integer: "6", decimal: ""});
	/**
	 * The constant seven.
	 */
	public static SEVEN = new Component({integer: "7", decimal: ""});
	/**
	 * The constant eight.
	 */
	public static EIGHT = new Component({integer: "8", decimal: ""});
	/**
	 * The constant nine.
	 */
	public static NINE = new Component({integer: "9", decimal: ""});

	/**
	 * The default [[MathContext]] used for numerical operations related to [[Component]]
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

	constructor(real: num1d) {
		this.integer = real.integer;
		this.decimal = real.decimal;
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
	private static align(a: Component, b: Component) {
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
	public static abs(x: Component) {
		return x.integer.charAt(0) === '-'? Component.create(x.integer.substring(1) + "." + x.decimal): x;
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
	public static round(x: Component, context: MathContext) {
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
		return Component.create(decimate(r, context.precision));
	}

	/**
	 * The comparator function. This compares `this` to `that` and returns
	 * * 0 if they are equal
	 * * 1 if `this` > `that`
	 * * -1 if `this` < `that`
	 * @param that Number to compare with.
	 */
	public compareTo(that: Component) {
		const [a, b] = Component.align(this, that);
		const x = BigInt(a) - BigInt(b);
		return x > 0? 1: x < 0? -1: 0;
	}

	/**
	 * Determines whether `this` is less than `that`.
	 * @param that Number to compare with.
	 */
	public lessThan(that: Component) {
		return this.compareTo(that) === -1;
	}

	/**
	 * Determines whether `this` is more than `that`.
	 * @param that Number to compare with.
	 */
	public moreThan(that: Component) {
		return this.compareTo(that) === 1;
	}

	/**
	 * Checks whether `this` and `that` are equal numbers. Equality is checked
	 * only till the number of decimal places specified by [[Component.MODE]].
	 * @param that The number to check against.
	 */
	public equals(that: Component): boolean;
	/**
	 * Checks whether `this` and `that` are equal numbers. Equality is checked
	 * only till the number of decimal places specified by `context`.
	 * @param that The number to check against.
	 * @param context The [[MathContext]] value to use for equality check.
	 */
	public equals(that: Component, context: MathContext): boolean;
	public equals(that: Component, context = Component.MODE) {
		const A = Component.round(this, context);
		const B = Component.round(that, context);
		return A.integer === B.integer && A.decimal === B.decimal;
	}

	/**
	 * Determines whether `this` is less than or equal to `that`.
	 * @param that Number to compare with.
	 */
	public lessEquals(that: Component) {
		return this.lessThan(that) || this.equals(that);
	}

	/**
	 * Determines whether `this` is more than or equal to `that`.
	 * @param that Number to compare with.
	 */
	public moreEquals(that: Component) {
		return this.moreThan(that) || this.equals(that);
	}

	/**
	 * The negative value of `this`.
	 */
	public get neg() {
		if(this.integer.charAt(0) === '-')
			return Component.create(this.integer.substring(1) + "." + this.decimal);
		return Component.create("-" + this.toString());
	}

	/**
	 * Adds two [[Component]] instances. The higher precision value of the two is
	 * chosen as the precision for the result and rounding is according to
	 * [[Component.MODE]].
	 * @param that The number to add this with.
	 * @returns this + that.
	 */
	public add(that: Component): Component;
	/**
	 * Adds two [[Component]] instances. The higher precision value of the two is
	 * chosen as the precision for the result and rounding is according to the
	 * given context settings.
	 * @param that The number to add this with.
	 * @param context The context settings object to use.
	 * @returns this + that.
	 */
	public add(that: Component, context: MathContext): Component;
	public add(that: Component, context?: MathContext) {
		context = context || Component.MODE;
		const [a, b] = Component.align(this, that);
		let sum = (BigInt(a) + BigInt(b)).toString();
		const precision = Math.max(this.precision, that.precision);
		const res = Component.create(decimate(sum, precision));
		return Component.round(res, context);
	}

	/**
	 * Subtracts one [[Component]] instance from another. The higher precision value
	 * of the two is chosen as the precision for the result and rounding is
	 * according to [[Component.MODE]].
	 * @param that The number to subtract from this.
	 * @returns this - that.
	 */
	public sub(that: Component): Component;
	/**
	 * Subtracts one [[Component]] instance from another. The higher precision value
	 * of the two is chosen as the precision for the result and rounding is
	 * according to the given context settings.
	 * @param that The number to subtract from this.
	 * @param context The context settings object to use.
	 * @returns this - that.
	 */
	public sub(that: Component, context: MathContext): Component;
	public sub(that: Component, context?: MathContext) {
		context = context || Component.MODE;
		const [a, b] = Component.align(this, that);
		let sum = (BigInt(a) - BigInt(b)).toString();
		const precision = Math.max(this.precision, that.precision);
		const res = Component.create(decimate(sum, precision));
		return Component.round(res, context);
	}

	/**
	 * Multiplies two [[Component]] instances. The sum of the precisions of the two
	 * is chosen as the precision of the result and rounding is according to
	 * [[Component.MODE]].
	 * @param that The number to multiply this with.
	 * @returns this * that.
	 */
	public mul(that: Component): Component;
	/**
	 * Multiplies two [[Component]] instances. The sum of the precisions of the two
	 * is chosen as the precision of the result and rounding is according to
	 * the given context settings.
	 * @param that The number to multiply this with.
	 * @param context The context settings object to use.
	 * @returns this * that.
	 */
	public mul(that: Component, context: MathContext): Component;
	public mul(that: Component, context?: MathContext) {
		context = context || Component.MODE;
		let prod = (this.asBigInt * that.asBigInt).toString();
		const precision = this.precision + that.precision;
		const res = Component.create(decimate(prod, precision));
		return Component.round(res, context);
	}

	/**
	 * Divides one [[Component]] instance by another with rounding according to
	 * [[Component.MODE]].
	 * @param that The number to divide this by.
	 * @returns this / that.
	 */
	public div(that: Component): Component;
	/**
	 * Divides one [[Component]] instance by another with rounding according to the
	 * given context settings.
	 * @param that The number to divide this by.
	 * @param context The context settings object to use.
	 * @returns this / that.
	 */
	public div(that: Component, context: MathContext): Component;
	public div(that: Component, context?: MathContext) {
		context = context || Component.MODE;
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
		const res = Component.create(decimate(quo, (p < 0)? p1: precision));
		return Component.round(res, context);
	}

	/**
	 * The modulo operator. The extended definition for non-integer numbers has
	 * been used. For two numbers \\(a\\) and \\(b\\),
	 * \\[a mod b = a - b\lfloor\frac{a}{b}\rfloor\\]
	 * @param that A number.
	 */
	public mod(that: Component) {
		const quo = this.div(that, {precision: 0, rounding: RoundingMode.FLOOR});
		return this.sub(that.mul(quo));
	}

	/**
	 * Raises a [[Component]] to an integer power. This function may be made
	 * private in future versions. It is adviced not to use this function
	 * except for development purposes.
	 * @param base The base number.
	 * @param index The index / exponent to which the base is to be raised.
	 * @param context The context settings to use.
	 */
	static intpow(base: Component, index: number, context=Component.MODE) {
		if(index !== (index|0))
			throw "Only defined for integer values of the power.";
		let p = Component.ONE;
		for(let i = 0; i < index; i++)
			p = p.mul(base, context);
		return p;
	}

	/**
	 * Raises `this` to the power of `ex`.
	 * @param ex A number.
	 */
	public pow(ex: Component): Component;
	/**
	 * Raises `this` to the power of `ex` using the rounding according to the
	 * given context settings.
	 * @param ex A number.
	 * @param context The context settings object to use.
	 */
	public pow(ex: Component, context: MathContext): Component;
	public pow(ex: Component, context=Component.MODE) {
		if(this.equals(Component.ZERO))
			return Component.ZERO;
		if(ex.decimal === "" || ex.decimal === "0")
			return Component.intpow(this, parseInt(ex.integer) || 0, context);
		const ctx: MathContext = {
			precision: 2 * context.precision,
			rounding: context.rounding
		};
		const y = ex.mul(Component.ln(this, ctx), ctx);
		return Component.round(Component.exp(y, ctx), context);
	}

	/**
	 * Calculates the exponential of a given number with rounding according to
	 * [[Component.MODE]].
	 * @param x A number.
	 */
	public static exp(x: Component): Component;
	/**
	 * Calculates the exponential of a given number with rounding according to
	 * the given context settings.
	 * @param x A number
	 * @param context The context settings to use.
	 */
	public static exp(x: Component, context: MathContext): Component;
	public static exp(x: Component, context=Component.MODE) {
		const ctx: MathContext = {
			precision: 2 * context.precision,
			rounding: context.rounding
		};
		let sum = Component.ZERO;
		let term = Component.ONE;
		let n = Component.ZERO;
		while(true) {
			sum = sum.add(term, ctx);
			const term1 = term.mul(x, ctx).div(n.add(Component.ONE), ctx);
			if(Component.abs(term1).equals(Component.ZERO, ctx))
				return Component.round(sum, context);
			term = term1;
			n = n.add(Component.ONE);
		}
	}

	/**
	 * Evaluates the natural logarithm of a given number \\(x\\)(\\(|x| < 1\\)).
	 * @param x A number.
	 * @param context The context settings to use.
	 * @ignore
	 */
	private static ln_less(x: Component, context=Component.MODE) {
		const ctx: MathContext = {
			precision: 2 * context.precision,
			rounding: context.rounding
		};
		let sum = Component.ZERO;
		let term = x;
		let n = Component.ONE;
		while(true) {
			sum = sum.add(term.div(n, ctx), ctx);
			const term1 = term.mul(x, ctx).neg;
			const term2 = term1.div(n.add(Component.ONE, ctx), ctx);
			if(Component.abs(term2).equals(Component.ZERO, ctx))
				return Component.round(sum, context);
			term = term1;
			n = n.add(Component.ONE);
		}
	}

	/**
	 * Calculates the natural logarithm (to the base \\(e\\)) of a given number
	 * with rounding according to [[Component.MODE]].
	 * @param x A number.
	 */
	public static ln(x: Component): Component;
	/**
	 * Calculates the natural logarithm (to the base \\(e\\)) of a given number
	 * with rounding according to the given context settings.
	 * @param x A number.
	 * @param context The context settings to use.
	 */
	public static ln(x: Component, context: MathContext): Component;
	public static ln(x: Component, context=Component.MODE) {
		const ctx: MathContext = {
			precision: 2 * context.precision,
			rounding: context.rounding
		};
		if(x.lessEquals(Component.ZERO))
			throw new Error("Undefined");
		if(x.lessEquals(Component.create("1.9")))
			return Component.round(
				Component.ln_less(x.sub(Component.ONE, ctx), ctx),
				context
				);
		return Component.round(newton_raphson(
			y => Component.exp(y, ctx).sub(x, ctx),
			y => Component.exp(y, ctx),
			Component.ONE,
			ctx
			),
			context);
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

export namespace Component {
	/**
	 * Creates a [[Component]] instance from the string representation of the number.
	 * @param num The string representation of the number in decimal system.
	 */
	export function create(num: number): Component;
	/**
	 * Creates a [[Component]] instance from the decimal representation of the
	 * number. This instance created will store the exact binary floating
	 * point value of the number. Even though it uses the `toString()` method
	 * to convert the number to a string it might be unpredictable at times.
	 * @param num A numeric expression.
	 */
	export function create(num: string): Component;
	/**
	 * Creates a [[Component]] instance from the integral and fractional part
	 * of the number. Both the arguments are expected to be string
	 * representations of integers.
	 * @param integer The whole part of the number.
	 * @param fraction The fractional part of the number.
	 */
	export function create(integer: string, fraction: string): Component;
	export function create(a: number|string, b?: string) {
		let num: string;
		if(b === undefined)
			if(typeof a === "number")
				num = a.toString();
			else num = a;
		else if(typeof a === "string" && typeof b === "string")
			num = a + "." + b;
		else throw new TypeError("Illegal argument type.");
		const [integer, decimal] = parseNum(num);
		return new Component({
			integer: integer,
			decimal: decimal
		});
	}
}