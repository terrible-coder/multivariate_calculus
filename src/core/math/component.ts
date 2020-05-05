import { IndeterminateForm, DivisionByZero } from "../errors";
import { parseNum, pad, decimate, align } from "./parsers";
import { MathContext, RoundingMode } from "./context";
import { mathenv } from "../env";
import { Numerical } from "../definitions";
import { Exponent } from "./exponential/exponential";
import { TrigCyclic } from "./trigonometry/circular";
import { TrigHyperbolic } from "./trigonometry/hyperbolic";

/**
 * Type of argument accepted by [[Component]] constructor.
 * @ignore
 */
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
export class Component extends Numerical {

	/**
	 * The circle constant \\( \pi \\) correct upto 100 decimal places.
	 * 
	 * Source: http://paulbourke.net/miscellaneous/numbers/
	 */
	public static PI = new Component({integer: "3", decimal: "1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679"});

	/**
	 * The constant Euler's number (\\( e \\)) correct upto 100 decimal places.
	 * 
	 * Source: http://paulbourke.net/miscellaneous/numbers/
	 */
	public static E = new Component({integer: "2", decimal: "7182818284590452353602874713526624977572470936999595749669676277240766303535475945713821785251664274"});

	/**
	 * The natural logarithm of \\( 10 \\) correct upto 100 decimal places. This comes
	 * in very handy for natural base to common base logarithm.
	 * 
	 * Source: http://paulbourke.net/miscellaneous/numbers/
	 */
	public static ln10 = new Component({integer: "2", decimal: "3025850929940456840179914546843642076011014886287729760333279009675726096773524802359972050895982983"});

	/**
	 * The natural logarithm of \\( 2 \\) correct upto 100 decimal places.
	 */
	public static ln2 = new Component({integer: "", decimal: "6931471805599453094172321214581765680755001343602552541206800094933936219696947156058633269964186875"})

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
	 * The integer part of the number.
	 */
	readonly integer: string;
	/**
	 * The decimal part of the number.
	 */
	readonly decimal: string;

	/**
	 * Creates an instance of [[Component]] class. This is not the recommended
	 * way of creating new [[Component]] instances. For end users it is recommended
	 * that they use the [[Component.create]] function instead.
	 * @param real The value of the number in the required format.
	 */
	constructor(real: num1d) {
		super();
		this.integer = real.integer;
		this.decimal = real.decimal;
	}

	/**
	 * Returns the class whose object `this` is.
	 */
	public get classRef() {
		return Component;
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
	 * Evaluates the absolute value of this number.
	 * @param x The number whose absolute value is to be found.
	 * @returns The absolute value of the argument.
	 */
	public static abs(x: Component): Component;
	public static abs(x: Component, ...args: any[]): Component;
	public static abs(x: Component, ...args: any[]) {
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
		const divider = BigInt(pad("1", diff, "0", "end"));
		let rounded = num / divider, last = num % divider;
		const one = BigInt("1"), ten = BigInt("10");
		const FIVE = BigInt(pad("5", diff - 1, "0", "end")), ONE = BigInt(pad("1", diff - 1, "0", "end"));
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
		const [a, b] = align(this.asString, that.asString, "0", this.precision - that.precision);
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
	 * only till the number of decimal places specified by [[mathenv.mode]].
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
	public equals(that: Component, context = mathenv.mode) {
		const A = Component.round(this, context);
		const B = Component.round(that, context);
		return A.integer === B.integer && A.decimal === B.decimal;
	}

	/**
	 * Determines whether `this` is less than or equal to `that`. Equality is
	 * check according to [[mathenv.mode]].
	 * @param that Number to compare with.
	 */
	public lessEquals(that: Component): boolean;
	/**
	 * Determines whether `this` is less than or equal to `that`. Equality is
	 * checked according to the given context settings.
	 * @param that Number to compare with.
	 * @param context The context settings to use.
	 */
	public lessEquals(that: Component, context: MathContext): boolean;
	public lessEquals(that: Component, context=mathenv.mode) {
		return this.lessThan(that) || this.equals(that, context);
	}

	/**
	 * Determines whether `this` is more than or equal to `that`. Equality is
	 * checked according to [[mathenv.mode]].
	 * @param that Number to compare with.
	 */
	public moreEquals(that: Component): boolean;
	/**
	 * Determines whether `this` is more than or equal to `that`. Equality is
	 * checked according to the given context.
	 * @param that Number to compare with.
	 * @param context The context settings to use.
	 */
	public moreEquals(that: Component, context: MathContext): boolean;
	public moreEquals(that: Component, context=mathenv.mode) {
		return this.moreThan(that) || this.equals(that, context);
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
	 * [[mathenv.mode]].
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
	public add(that: Component, ...args: any[]): Component;
	public add(that: Component, ...args: any[]) {
		const context = args[0] || mathenv.mode;
		const [a, b] = align(this.asString, that.asString, "0", this.precision - that.precision);
		let sum = (BigInt(a) + BigInt(b)).toString();
		const precision = Math.max(this.precision, that.precision);
		const res = Component.create(decimate(sum, precision));
		return Component.round(res, context);
	}

	/**
	 * Subtracts one [[Component]] instance from another. The higher precision value
	 * of the two is chosen as the precision for the result and rounding is
	 * according to [[mathenv.mode]].
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
	public sub(that: Component, ...args: any[]): Component;
	public sub(that: Component, ...args: any[]) {
		const context = args[0] || mathenv.mode;
		const [a, b] = align(this.asString, that.asString, "0", this.precision - that.precision);
		let sum = (BigInt(a) - BigInt(b)).toString();
		const precision = Math.max(this.precision, that.precision);
		const res = Component.create(decimate(sum, precision));
		return Component.round(res, context);
	}

	/**
	 * Multiplies two [[Component]] instances. The sum of the precisions of the two
	 * is chosen as the precision of the result and rounding is according to
	 * [[mathenv.mode]].
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
	public mul(that: Component, ...args: any[]): Component;
	public mul(that: Component, ...args: any[]) {
		const context = args[0] || mathenv.mode;
		let prod = (this.asBigInt * that.asBigInt).toString();
		const precision = this.precision + that.precision;
		const res = Component.create(decimate(prod, precision));
		return Component.round(res, context);
	}

	/**
	 * Divides one [[Component]] instance by another with rounding according to
	 * [[mathenv.mode]].
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
	public div(that: Component, ...args: any[]): Component;
	public div(that: Component, ...args: any[]) {
		const context = args[0] || mathenv.mode;
		if(that.sign === 0) {
			if(this.sign === 0)
				throw new IndeterminateForm("Cannot determine 0/0.");
			throw new DivisionByZero("Cannot divide by zero.");
		}
		const precision = context.precision;
		const p1 = this.precision, p2 = that.precision, p = precision - p1 + p2;
		const a = p < 0? this.asBigInt: BigInt(pad(this.asString, p, "0", "end"));
		const b = that.asBigInt;
		let quo = (a / b).toString();
		const res = Component.create(decimate(quo, (p < 0)? p1: precision));
		return Component.round(res, context);
	}

	/**
	 * The modulo operator. The extended definition for non-integer numbers has
	 * been used. For two numbers \\( a \\) and \\( b \\),
	 * \\[ a mod b = a - b\lfloor\frac{a}{b}\rfloor \\]
	 * The result is rounded according to [[mathenv.mode]].
	 * @param that A number.
	 */
	public mod(that: Component): Component;
	/**
	 * The modulo operator. The extended definition for non-integer numbers has
	 * been used. For two numbers \\( a \\) and \\( b \\),
	 * \\[ a mod b = a - b\lfloor\frac{a}{b}\rfloor \\]
	 * The result is rounded according to the given context.
	 * @param that A number.
	 * @param context The context settings to use.
	 */
	public mod(that: Component, context: MathContext): Component;
	public mod(that: Component, ...args: any[]): Component;
	public mod(that: Component, ...args: any[]) {
		const context = args[0] || mathenv.mode;
		const ctx: MathContext = {
			precision: 2 * context.precision,
			rounding: context.rounding
		};
		const quo = Component.floor(this.div(that));
		const res = this.sub(that.mul(quo, ctx), ctx);
		return Component.round(res, context);
	}

	/**
	 * Raises a [[Component]] to an integer power. This function may be made
	 * private in future versions. It is adviced not to use this function
	 * except for development purposes.
	 * @param base The base number.
	 * @param index The index / exponent to which the base is to be raised.
	 * @param context The context settings to use.
	 */
	static intpow(base: Component, index: number, context=mathenv.mode) {
		const ctx: MathContext = {
			precision: 2 * context.precision,
			rounding: context.rounding
		};
		if(index !== (index|0) || index < 0)
			throw "Only defined for positive integer values of the power.";
		if(index === 0)
			return Component.ONE;
		let p = Component.ONE;
		for(let i = 0; i < index; i++)
			p = p.mul(base, ctx);
		return Component.round(p, context);
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
	public pow(ex: Component, ...args: any[]): Component;
	public pow(ex: Component, ...args: any[]) {
		const context = args[0] || mathenv.mode;
		return Exponent.pow(this, ex, context);
	}

	/**
	 * The floor function. Evaluates the greatest integer less than or equal to
	 * the given number.
	 * @param x A number.
	 */
	public static floor(x: Component) {
		return Component.round(x, {precision: 0, rounding: RoundingMode.FLOOR});
	}

	/**
	 * The ceil function. Evaluates the smallest integer greater than or equal to
	 * the given number.
	 * @param x A number.
	 */
	public static ceil(x: Component) {
		return Component.round(x, {precision: 0, rounding: RoundingMode.CEIL});
	}

	/**
	 * Calculates the exponential of a given number with rounding according to
	 * [[mathenv.mode]].
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
	public static exp(x: Component, ...args: any[]): Component;
	public static exp(x: Component, ...args: any[]) {
		const context = args[0] || mathenv.mode;
		return Exponent.exp(x, context);
	}

	/**
	 * Calculates the natural logarithm (to the base \\( e \\)) of a given number
	 * with rounding according to [[mathenv.mode]].
	 * @param x A number.
	 */
	public static ln(x: Component): Component;
	/**
	 * Calculates the natural logarithm (to the base \\( e \\)) of a given number
	 * with rounding according to the given context settings.
	 * @param x A number.
	 * @param context The context settings to use.
	 */
	public static ln(x: Component, context: MathContext): Component;
	public static ln(x: Component, ...args: any[]): Component;
	public static ln(x: Component, ...args: any[]) {
		const context = args[0] || mathenv.mode;
		return Exponent.ln(x, context);
	}

	/**
	 * Calculates the trigonometric sine with rounding according to [[mathenv.mode]].
	 * @param x A number.
	 */
	public static sin(x: Component): Component;
	/**
	 * Calculates the trigonometric sine with rounding according to the given
	 * context.
	 * @param x A number.
	 * @param context The context settings to use.
	 */
	public static sin(x: Component, context: MathContext): Component;
	public static sin(x: Component, ...args: any[]): Component;
	public static sin(x: Component, ...args: any[]) {
		const context = args[0] || mathenv.mode;
		return TrigCyclic.sin(x, context);
	}

	/**
	 * Calculates the trigonometric cosine with rounding according to
	 * [[mathenv.mode]].
	 * @param x A number.
	 */
	public static cos(x: Component): Component;
	/**
	 * Calculates the trigonometric cosine with rounding according to the given
	 * context.
	 * @param x A number.
	 * @param context The context settings to use.
	 */
	public static cos(x: Component, context: MathContext): Component;
	public static cos(x: Component, ...args: any[]): Component;
	public static cos(x: Component, ...args: any[]) {
		const context = args[0] || mathenv.mode;
		return TrigCyclic.cos(x, context);
	}

	/**
	 * Calculates the trigonometric tangent with rounding according to
	 * [[mathenv.mode]].
	 * @param x A number.
	 */
	public static tan(x: Component): Component;
	/**
	 * Calculates the trigonometric tangent with rounding according to the given
	 * context.
	 * @param x A number.
	 * @param context The context settings to use.
	 */
	public static tan(x: Component, context: MathContext): Component;
	public static tan(x: Component, ...args: any[]): Component;
	public static tan(x: Component, ...args: any[]) {
		const context = args[0] || mathenv.mode;
		return TrigCyclic.tan(x, context);
	}

	/**
	 * Calculates the inverse trigonometric sine of a number with rounding
	 * according to [[mathenv.mode]].
	 * @param x A number.
	 */
	public static asin(x: Component): Component;
	/**
	 * Calculates the inverse trigonometric sine of a number with rounding
	 * according to the given context.
	 * @param x A number.
	 * @param context The context settings to use.
	 */
	public static asin(x: Component, context: MathContext): Component;
	public static asin(x: Component, ...args: any[]): Component;
	public static asin(x: Component, ...args: any[]) {
		const context = args[0] || mathenv.mode;
		return TrigCyclic.asin(x, context);
	}

	/**
	 * Calculates the inverse trigonometric cosine of a number with rounding
	 * according to [[mathenv.mode]].
	 * @param x A number.
	 */
	public static acos(x: Component): Component;
	/**
	 * Calculates the inverse trigonometric cosine of a number with rounding
	 * according to the given context.
	 * @param x A number.
	 * @param context The context settings to use.
	 */
	public static acos(x: Component, context: MathContext): Component;
	public static acos(x: Component, ...args: any[]): Component;
	public static acos(x: Component, ...args: any[]) {
		const context = args[0] || mathenv.mode;
		return TrigCyclic.acos(x, context);
	}

	/**
	 * Calculates the inverse trigonometric tangent of a number with rounding
	 * according to [[mathenv.mode]].
	 * @param x A number.
	 */
	public static atan(x: Component): Component;
	/**
	 * Calculates the inverse trigonometric tangent of a number with rounding
	 * according to the given context.
	 * @param x A number.
	 * @param context The context settings to use.
	 */
	public static atan(x: Component, context: MathContext): Component;
	public static atan(x: Component, ...args: any[]): Component;
	public static atan(x: Component, ...args: any[]) {
		const context = args[0] || mathenv.mode;
		return TrigCyclic.atan(x, context);
	}

	/**
	 * Calculates the hyperbolic sine with rounding according to [[mathenv.mode]].
	 * @param x A number.
	 */
	public static sinh(x: Component): Component;
	/**
	 * Calculates the hyperbolic sine with rounding according to the given context.
	 * @param x A number.
	 * @param context The context settings to use.
	 */
	public static sinh(x: Component, context: MathContext): Component;
	public static sinh(x: Component, ...args: any[]): Component;
	public static sinh(x: Component, ...args: any[]) {
		const context = args[0] || mathenv.mode;
		return TrigHyperbolic.sinh(x, context);
	}

	/**
	 * Calculates the hyperbolic cosine with rounding according to [[mathenv.mode]].
	 * @param x A number.
	 */
	public static cosh(x: Component): Component;
	/**
	 * Calculates the hyperbolic cosine with rounding according to the given context.
	 * @param x A number.
	 * @param context The context settings to use.
	 */
	public static cosh(x: Component, context: MathContext): Component;
	public static cosh(x: Component, ...args: any[]): Component;
	public static cosh(x: Component, ...args: any[]) {
		const context = args[0] || mathenv.mode;
		return TrigHyperbolic.cosh(x, context);
	}

	/**
	 * Calculates the inverse hyperbolic sine with rounding according to [[mathenv.mode]].
	 * @param x A number.
	 */
	public static asinh(x: Component): Component;
	/**
	 * Calculates the inverse hyperbolic sine with rounding according to the
	 * given context.
	 * @param x A number.
	 * @param context The context settings to use.
	 */
	public static asinh(x: Component, context: MathContext): Component;
	public static asinh(x: Component, ...args: any[]): Component;
	public static asinh(x: Component, ...args: any[]) {
		const context = args[0] || mathenv.mode;
		return TrigHyperbolic.asinh(x, context);
	}

	/**
	 * Calculates the inverse hyperbolic cosine with rounding according to
	 * [[mathenv.mode]].
	 * @param x A number.
	 */
	public static acosh(x: Component): Component;
	/**
	 * Calculates the inverse hyperbolic cosine with rounding according to the
	 * given context.
	 * @param x A number.
	 * @param context The context settings to use.
	 */
	public static acosh(x: Component, context: MathContext): Component;
	public static acosh(x: Component, ...args: any[]): Component;
	public static acosh(x: Component, ...args: any[]) {
		const context = args[0] || mathenv.mode;
		return TrigHyperbolic.acosh(x, context);
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