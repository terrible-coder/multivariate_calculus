// import { MathContext } from "./context";
import { trimZeroes, align, pad } from "./parsers";
import { Component } from "./component";

/**
 * Immutable higher dimensional numbers.
 */
export class BigNum {

	/**
	 * The components of the number represented by this object. The first one
	 * (at index 0) is the real component and the rest are the components of
	 * the imaginary units.
	 */
	readonly components: Component[];
	/**
	 * The dimension in which this number belongs. The dimension must always be
	 * a power of 2.
	 */
	readonly dim: number;

	/**
	 * Creates a higher dimensional number from its components.
	 * @param values The components of the number.
	 */
	constructor(...values: Component[]);
	/**
	 * Creates a higher dimensional number from its components.
	 * @param values The components of the number.
	 */
	constructor(values: Component[]);
	constructor(...values: Component[] | [Component[]]) {
		let args: Component[];
		const temp = values[0];
		if(temp instanceof Array)
			args = temp;
		else args = <Array<Component>>values;
		args = trimZeroes<Component>(args, "end", Component.ZERO);
		this.dim = Math.pow(2, Math.ceil(Math.log2(args.length)));
		this.components = pad(args, this.dim - args.length, Component.ZERO, "end");
	}

	/**
	 * Checks whether `this` and `that` are equal numbers. Equality is defined
	 * component wise. That is, two numbers \(a\) and \(b\) are equal
	 * if and only if
	 * \(a_i = b_i \forall i\)
	 * @param that The number to check against.
	 */
	public equal(that: BigNum) {
		if(this.dim !== that.dim)
			return false;
		const n = that.dim;
		for(let i = 0; i < n; i++)
			if(!this.components[i].equals(that.components[i]))
				return false;
		return true;
	}

	/**
	 * The negative of `this`.
	 */
	public get neg() {
		return new BigNum(this.components.map(x => x.neg));
	}

	/**
	 * Adds two [[BigNum]] instances. Addition is defined component-wise.
	 * That is, for two numbers \(a\) and \(b\), their addition is defined as
	 * \(a + b = \sum_i a_i + b_i\)
	 * @param that The number to add this with.
	 * @returns this + that.
	 */
	public add(that: BigNum) {
		let [a, b] = align(this.components, that.components, Component.ZERO, this.dim - that.dim);
		const sum: Component[] = [];
		for(let i = 0; i < a.length; i++)
			sum.push(a[i].add(b[i]));
		return new BigNum(sum);
	}


	// /**
	//  * Calculates the trigonometric sine of a given number with rounding
	//  * according to [[Component.MODE]].
	//  * @param x A number.
	//  */
	// public static sin(x: BigNum): BigNum;
	// /**
	//  * Calculates the trigonometric sine of a given number with rounding
	//  * according to the given context settings.
	//  * @param x A number.
	//  * @param context The context settings to use.
	//  */
	// public static sin(x: BigNum, context: MathContext): BigNum;
	// public static sin(x: BigNum, context=Component.MODE) {
	// 	// using Maclaurin series for sin x
	// 	const ctx: MathContext = {
	// 		precision: 2 * context.precision,
	// 		rounding: context.rounding
	// 	};
	// 	const x_sq = x.mul(x, ctx);
	// 	let sum = BigNum.ZERO;
	// 	let term = x;
	// 	let n = BigNum.ZERO;
	// 	while(true) {
	// 		sum = sum.add(term, ctx);
	// 		const a = BigNum.TWO.mul(n).add(BigNum.THREE);
	// 		const b = BigNum.TWO.mul(n).add(BigNum.TWO);
	// 		const f = a.mul(b).neg;
	// 		const term1 = term.mul(x_sq, ctx).div(f, ctx);
	// 		if(BigNum.abs(term1).equals(BigNum.ZERO, ctx))
	// 			return BigNum.round(sum, context);
	// 		term = term1;
	// 		n = n.add(BigNum.ONE);
	// 	}
	// }
	//
	// /**
	//  * Calculates the trigonometric cosine of a given number with rounding
	//  * according to [[Component.MODE]].
	//  * @param x A number.
	//  */
	// public static cos(x: BigNum): BigNum;
	// /**
	//  * Calculates the trigonometric cosine of a given number with rounding
	//  * according to the given context settings.
	//  * @param x A number.
	//  * @param context The context settings to use.
	//  */
	// public static cos(x: BigNum, context: MathContext): BigNum;
	// public static cos(x: BigNum, context=Component.MODE) {
	// 	// using Maclaurin series for cos x
	// 	const ctx: MathContext = {
	// 		precision: 2 * context.precision,
	// 		rounding: context.rounding
	// 	};
	// 	const x_sq = x.mul(x, ctx);
	// 	let sum = BigNum.ZERO;
	// 	let term = BigNum.ONE;
	// 	let n = BigNum.ZERO;
	// 	while(true) {
	// 		sum = sum.add(term, ctx);
	// 		const a = BigNum.TWO.mul(n).add(BigNum.ONE);
	// 		const b = BigNum.TWO.mul(n).add(BigNum.TWO);
	// 		const f = a.mul(b).neg;
	// 		const term1 = term.mul(x_sq, ctx).div(f, ctx);
	// 		if(BigNum.abs(term1).equals(BigNum.ZERO, ctx))
	// 			return BigNum.round(sum, context);
	// 		term = term1;
	// 		n = n.add(BigNum.ONE);
	// 	}
	// }
	//
	// /**
	//  * Calculates the trigonometric tangent of a given number with rounding
	//  * according to [[Component.MODE]].
	//  * @param x A number.
	//  */
	// public static tan(x: BigNum): BigNum;
	// /**
	//  * Calculates the trigonometric tangent of a given number with rounding
	//  * according to the given context settings.
	//  * @param x A number.
	//  * @param context The context settings to use.
	//  */
	// public static tan(x: BigNum, context: MathContext): BigNum;
	// public static tan(x: BigNum, context=Component.MODE) {
	// 	const ctx: MathContext = {
	// 		precision: 2 * context.precision,
	// 		rounding: context.rounding
	// 	}
	// 	return BigNum.round(BigNum.sin(x, ctx).div(BigNum.cos(x, ctx), ctx), context);
	// }
	//
	// /**
	//  * Calculates the inverse trigonometric sine of a given value with rounding
	//  * according to [[Component.MODE]]. This method right now works good
	//  * only for values much smaller than unity. For values close to unity
	//  * this method converges very slowly to the result. This will be fixed in
	//  * future updates.
	//  * @param x A number.
	//  */
	// public static asin(x: BigNum): BigNum;
	// /**
	//  * Calculates the inverse trigonometric sine of a given value with rounding
	//  * according to the given context setings. This method right now works good
	//  * only for values much smaller than unity. For values close to unity
	//  * this method converges very slowly to the result. This will be fixed in
	//  * future updates.
	//  * @param x A number.
	//  * @param context The context settings to use.
	//  */
	// public static asin(x: BigNum, context: MathContext): BigNum;
	// public static asin(x: BigNum, context=Component.MODE) {
	// 	if(BigNum.abs(x).moreThan(BigNum.ONE))
	// 		throw new Error("Undefined");
	// 	if(x.equals(BigNum.ONE, context))
	// 		return BigNum.PI.div(BigNum.TWO, context);
	// 	if(x.equals(BigNum.ONE.neg, context))
	// 		return BigNum.PI.div(BigNum.TWO, context).neg;
	// 	const ctx: MathContext = {
	// 		precision: 2 * context.precision,
	// 		rounding: context.rounding
	// 	}
	// 	return BigNum.round(newton_raphson(
	// 		y => BigNum.sin(y, ctx).sub(x, ctx),
	// 		y => BigNum.cos(y, ctx),
	// 		BigNum.ZERO,
	// 		ctx
	// 		), context);
	// }
	//
	// /**
	//  * Calculates the inverse trigonometric cosine of a given value with rounding
	//  * according to [[Component.MODE]]. This method right now works good
	//  * only for values much smaller than unity. For values close to unity
	//  * this method converges very slowly to the result. This will be fixed in
	//  * future updates.
	//  * @param x A number.
	//  * @param context The context settings to use.
	//  */
	// public static acos(x: BigNum): BigNum;
	// /**
	//  * Calculates the inverse trigonometric cosine of a given value with rounding
	//  * according to the given context settings. This method right now works good
	//  * only for values much smaller than unity. For values close to unity
	//  * this method converges very slowly to the result. This will be fixed in
	//  * future updates.
	//  * @param x A number.
	//  * @param context The context settings to use.
	//  */
	// public static acos(x: BigNum, context: MathContext): BigNum;
	// public static acos(x: BigNum, context=Component.MODE) {
	// 	const ctx: MathContext = {
	// 		precision: 2 * context.precision,
	// 		rounding: context.rounding
	// 	}
	// 	const piby2 = BigNum.PI.div(BigNum.TWO, ctx);
	// 	return BigNum.round(piby2.sub(BigNum.asin(x, ctx), ctx), context);
	// }
	//
	// /**
	//  * Calculates the atan value for a number whose magnitude (absolute value)
	//  * is less than unity.
	//  * @param x A number.
	//  * @param context The context settings to use.
	//  * @ignore
	//  */
	// private static atan_less(x: BigNum, context: MathContext) {
	// 	const ctx: MathContext = {
	// 		precision: 2 * context.precision,
	// 		rounding: context.rounding
	// 	}
	// 	const x_sq = x.mul(x, ctx);
	// 	let term = x;
	// 	let sum = BigNum.ZERO;
	// 	let n = BigNum.ZERO;
	// 	while(true) {
	// 		const temp = term.div(BigNum.TWO.mul(n).add(BigNum.ONE), ctx);
	// 		sum = sum.add(temp, ctx);
	// 		const term1 = term.mul(x_sq).neg;
	// 		const temp1 = term1.div(BigNum.TWO.mul(n).add(BigNum.THREE));
	// 		if(BigNum.abs(temp1).equals(BigNum.ZERO, ctx))
	// 			return BigNum.round(sum, context);
	// 		term = term1;
	// 		n = n.add(BigNum.ONE);
	// 	}
	// }
	//
	// /**
	//  * Calculates the atan value for a number whose magnitude (absolute value)
	//  * is greater than unity.
	//  * @param x A number.
	//  * @param context The context settings to use.
	//  * @ignore
	//  */
	// private static atan_more(x: BigNum, context: MathContext) {
	// 	const ctx: MathContext = {
	// 		precision: 2 * context.precision,
	// 		rounding: context.rounding
	// 	}
	// 	const x_sq = x.mul(x, ctx).neg;
	// 	let term = BigNum.ONE.div(x, ctx);
	// 	let sum = BigNum.ZERO;
	// 	let n = BigNum.ZERO;
	// 	while(true) {
	// 		const temp = term.div(BigNum.TWO.mul(n).add(BigNum.ONE), ctx);
	// 		sum = sum.add(temp, ctx);
	// 		const term1 = term.div(x_sq, ctx);
	// 		const temp1 = term1.div(BigNum.TWO.mul(n).add(BigNum.THREE), ctx);
	// 		if(BigNum.abs(temp1).equals(BigNum.ZERO, ctx))
	// 			break;
	// 		term = term1;
	// 		n = n.add(BigNum.ONE);
	// 	}
	// 	const piby2 = BigNum.PI.div(BigNum.TWO, ctx);
	// 	let res: BigNum;
	// 	if(x.moreThan(BigNum.ONE))
	// 		res = piby2.sub(sum, ctx);
	// 	else
	// 		res = piby2.add(sum, ctx).neg;
	// 	return BigNum.round(res, context);
	// }
	//
	// /**
	//  * Calculates the inverse trigonometric tangent of a given value with rounding
	//  * according to [[Component.MODE]].
	//  * @param x A number.
	//  */
	// public static atan(x: BigNum): BigNum;
	// /**
	//  * Calculates the inverse trigonometric tangent of a given value with rounding
	//  * according to the given context settings.
	//  * @param x A number.
	//  * @param context The context settings to use.
	//  */
	// public static atan(x: BigNum, context: MathContext): BigNum;
	// public static atan(x: BigNum, context=Component.MODE) {
	// 	if(BigNum.abs(x).lessThan(BigNum.ONE))
	// 		return BigNum.atan_less(x, context);
	// 	if(x.equals(BigNum.ONE, context))
	// 		return BigNum.PI.div(BigNum.FOUR, context);
	// 	if(x.equals(BigNum.ONE.neg, context))
	// 		return BigNum.PI.div(BigNum.FOUR, context);
	// 	return BigNum.atan_more(x, context);
	// }
	//
	// /**
	//  * Calculates the hyperbolic sine of a given value with rounding according
	//  * to [[Component.MODE]].
	//  * @param x A number.
	//  */
	// public static sinh(x: BigNum): BigNum;
	// /**
	//  * Calculates the hyperbolic sine of a given value with rounding according
	//  * to the given context settings.
	//  * @param x A number.
	//  * @param context The context settings to use.
	//  */
	// public static sinh(x: BigNum, context: MathContext): BigNum;
	// public static sinh(x: BigNum, context=Component.MODE) {
	// 	const ctx: MathContext = {
	// 		precision: 2 * context.precision,
	// 		rounding: context.rounding
	// 	}
	// 	const x_sq = x.mul(x, ctx);
	// 	let sum = BigNum.ZERO;
	// 	let term = x;
	// 	let n = BigNum.ZERO;
	// 	while(true) {
	// 		sum = sum.add(term, ctx);
	// 		const a = BigNum.TWO.mul(n).add(BigNum.TWO);
	// 		const b = BigNum.TWO.mul(n).add(BigNum.THREE);
	// 		const fac = a.mul(b);
	// 		const term1 = term.mul(x_sq, ctx).div(fac, ctx);
	// 		if(BigNum.abs(term1).equals(BigNum.ZERO, ctx))
	// 			return BigNum.round(sum, context);
	// 		term = term1;
	// 		n = n.add(BigNum.ONE);
	// 	}
	// }
	//
	// /**
	//  * Calculates the hyperbolic cosine of a given value with rounding according
	//  * to [[Component.MODE]].
	//  * @param x A number.
	//  */
	// public static cosh(x: BigNum): BigNum;
	// /**
	//  * Calculates the hyperbolic cosine of a given value with rounding according
	//  * to the given context settings.
	//  * @param x A number.
	//  * @param context The context settings to use.
	//  */
	// public static cosh(x: BigNum, context: MathContext): BigNum;
	// public static cosh(x: BigNum, context=Component.MODE) {
	// 	const ctx: MathContext = {
	// 		precision: 2 * context.precision,
	// 		rounding: context.rounding
	// 	}
	// 	const x_sq = x.mul(x, ctx);
	// 	let sum = BigNum.ZERO;
	// 	let term = BigNum.ONE;
	// 	let n = BigNum.ZERO;
	// 	while(true) {
	// 		sum = sum.add(term, ctx);
	// 		const a = BigNum.TWO.mul(n).add(BigNum.TWO);
	// 		const b = BigNum.TWO.mul(n).add(BigNum.ONE);
	// 		const fac = a.mul(b);
	// 		const term1 = term.mul(x_sq, ctx).div(fac, ctx);
	// 		if(BigNum.abs(term1).equals(BigNum.ZERO, ctx))
	// 			return BigNum.round(sum, context);
	// 		term = term1;
	// 		n = n.add(BigNum.ONE);
	// 	}
	// }
	//
	// /**
	//  * Calculates the hyperbolic tangent of a given value with rounding according
	//  * to the given context settings.
	//  * @param x A number.
	//  */
	// public static tanh(x: BigNum): BigNum;
	// /**
	//  * Calculates the hyperbolic tangent of a given value with rounding according
	//  * to the given context settings.
	//  * @param x A number.
	//  * @param context The context settings to use.
	//  */
	// public static tanh(x: BigNum, context: MathContext): BigNum;
	// public static tanh(x: BigNum, context=Component.MODE) {
	// 	const ctx: MathContext = {
	// 		precision: 2 * context.precision,
	// 		rounding: context.rounding
	// 	}
	// 	return BigNum.round(BigNum.sinh(x, ctx).div(BigNum.cosh(x, ctx), ctx), context);
	// }
	//
	// /**
	//  * Calculates the exponential of a given number with rounding according to
	//  * [[Component.MODE]].
	//  * @param x A number.
	//  */
	// public static exp(x: BigNum): BigNum;
	// /**
	//  * Calculates the exponential of a given number with rounding according to
	//  * the given context settings.
	//  * @param x A number
	//  * @param context The context settings to use.
	//  */
	// public static exp(x: BigNum, context: MathContext): BigNum;
	// public static exp(x: BigNum, context=Component.MODE) {
	// 	const ctx: MathContext = {
	// 		precision: 2 * context.precision,
	// 		rounding: context.rounding
	// 	};
	// 	let sum = BigNum.ZERO;
	// 	let term = BigNum.ONE;
	// 	let n = BigNum.ZERO;
	// 	while(true) {
	// 		sum = sum.add(term, ctx);
	// 		const term1 = term.mul(x, ctx).div(n.add(BigNum.ONE), ctx);
	// 		if(BigNum.abs(term1).equals(BigNum.ZERO, ctx))
	// 			return BigNum.round(sum, context);
	// 		term = term1;
	// 		n = n.add(BigNum.ONE);
	// 	}
	// }
	//
	// /**
	//  * Evaluates the natural logarithm of a given number \\(x\\)(\\(|x| < 1\\)).
	//  * @param x A number.
	//  * @param context The context settings to use.
	//  * @ignore
	//  */
	// private static ln_less(x: BigNum, context=Component.MODE) {
	// 	const ctx: MathContext = {
	// 		precision: 2 * context.precision,
	// 		rounding: context.rounding
	// 	};
	// 	let sum = BigNum.ZERO;
	// 	let term = x;
	// 	let n = BigNum.ONE;
	// 	while(true) {
	// 		sum = sum.add(term.div(n, ctx), ctx);
	// 		const term1 = term.mul(x, ctx).neg;
	// 		const term2 = term1.div(n.add(BigNum.ONE, ctx), ctx);
	// 		if(BigNum.abs(term2).equals(BigNum.ZERO, ctx))
	// 			return BigNum.round(sum, context);
	// 		term = term1;
	// 		n = n.add(BigNum.ONE);
	// 	}
	// }
	//
	// /**
	//  * Calculates the natural logarithm (to the base \\(e\\)) of a given number
	//  * with rounding according to [[Component.MODE]].
	//  * @param x A number.
	//  */
	// public static ln(x: BigNum): BigNum;
	// /**
	//  * Calculates the natural logarithm (to the base \\(e\\)) of a given number
	//  * with rounding according to the given context settings.
	//  * @param x A number.
	//  * @param context The context settings to use.
	//  */
	// public static ln(x: BigNum, context: MathContext): BigNum;
	// public static ln(x: BigNum, context=Component.MODE) {
	// 	const ctx: MathContext = {
	// 		precision: 2 * context.precision,
	// 		rounding: context.rounding
	// 	};
	// 	if(x.lessEquals(BigNum.ZERO))
	// 		throw new Error("Undefined");
	// 	if(x.lessEquals(BigNum.real("1.9")))
	// 		return BigNum.round(
	// 			BigNum.ln_less(x.sub(BigNum.ONE, ctx), ctx),
	// 			context
	// 			);
	// 	return BigNum.round(newton_raphson(
	// 		y => BigNum.exp(y, ctx).sub(x, ctx),
	// 		y => BigNum.exp(y, ctx),
	// 		BigNum.ONE,
	// 		ctx
	// 		),
	// 		context);
	// }
	//
	// /**
	//  * Calculates the common logarithm (to the base \\(10\\)) of a given number
	//  * with rounding according to [[Component.MODE]].
	//  * @param x A number.
	//  */
	// public static log(x: BigNum): BigNum;
	// /**
	//  * Calculates the common logarithm (to the base \\(10\\)) of a given number
	//  * with rounding according to the given context settings.
	//  * [[MathContext]].
	//  * @param x A number.
	//  * @param context The context settings to use.
	//  */
	// public static log(x: BigNum, context: MathContext): BigNum;
	// public static log(x: BigNum, context=Component.MODE) {
	// 	const ctx: MathContext = {
	// 		precision: 2 * context.precision,
	// 		rounding: context.rounding
	// 	};
	// 	const y = BigNum.ln(x, ctx).div(BigNum.ln10, ctx);
	// 	return BigNum.round(y, context);
	// }

}

// export namespace BigNum {
// 	/**
// 	 * Creates a [[BigNum]] instance from the string representation of the number.
// 	 * @param num The string representation of the number in decimal system.
// 	 */
// 	export function real(num: number): BigNum;
// 	/**
// 	 * Creates a [[BigNum]] instance from the decimal representation of the
// 	 * number. This instance created will store the exact binary floating
// 	 * point value of the number. Even though it uses the `toString()` method
// 	 * to convert the number to a string it might be unpredictable at times.
// 	 * @param num A numeric expression.
// 	 */
// 	export function real(num: string): BigNum;
// 	/**
// 	 * Creates a [[BigNum]] instance from the integral and fractional part
// 	 * of the number. Both the arguments are expected to be string
// 	 * representations of integers.
// 	 * @param integer The whole part of the number.
// 	 * @param fraction The fractional part of the number.
// 	 */
// 	export function real(integer: string, fraction: string): BigNum;
// 	export function real(a: number|string, b?: string) {
// 		let num: string;
// 		if(b === undefined)
// 			if(typeof a === "number")
// 				num = a.toString();
// 			else num = a;
// 		else if(typeof a === "string" && typeof b === "string")
// 			num = a + "." + b;
// 		else throw new TypeError("Illegal argument type.");
// 		const [integer, decimal] = parseNum(num);
// 		return new BigNum({
// 			integer: integer,
// 			decimal: decimal
// 		});
// 	}
// }