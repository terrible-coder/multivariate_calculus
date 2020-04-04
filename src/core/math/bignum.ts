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
		this.dim = Math.pow(2, Math.ceil(Math.log2(args.length || 1)));
		this.components = pad(args, this.dim - args.length, Component.ZERO, "end");
	}

	/**
	 * Checks whether `this` and `that` are equal numbers. Equality is defined
	 * component wise. That is, two numbers \(a\) and \(b\) are equal
	 * if and only if
	 * \(a_i = b_i \forall i\)
	 * @param that The number to check against.
	 */
	public equals(that: BigNum) {
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
	 * The real part of this number.
	 */
	public get real() {
		return new BigNum(this.components[0]);
	}

	/**
	 * The imaginary part of this number.
	 */
	public get imag() {
		return new BigNum([Component.ZERO].concat(this.components.slice(1)));
	}

	/**
	 * The conjugate of `this` number.
	 */
	public get conj(): BigNum {
		if(this.dim === 1)
			return this;
		const real = this.real.components;
		const imag = this.imag.neg.components.slice(1);
		const comps = real.concat(imag);
		return new BigNum(comps);
	}

	/**
	 * Evaluates the absolute value of a number.
	 * @param x A number.
	 */
	public static abs(x: BigNum) {
		const magsq = x.components.reduce((prev, curr) => prev.add(curr.pow(Component.TWO)), Component.ZERO);
		return new BigNum(magsq.pow(Component.create("0.5")));
	}

	/**
	 * Evaluates the norm of this number. Since `this` is not necessarily a real
	 * number, the norm is defined as
	 * \(norm a = a* a\)
	 * where \(a*\) is the conjugate of \(a\).
	 */
	public get norm() {
		return new BigNum(this.conj.mul(this).components[0].pow(Component.create("0.5")));
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

	/**
	 * Subtracts one [[BigNum]] instance from another. Subtraction is defined component-wise.
	 * That is, for two numbers \(a\) and \(b\), their difference is defined as
	 * \(a - b = \sum_i a_i - b_i\)
	 * @param that The number to add this with.
	 * @returns this - that.
	 */
	public sub(that: BigNum) {
		let [a, b] = align(this.components, that.components, Component.ZERO, this.dim - that.dim);
		const sum: Component[] = [];
		for(let i = 0; i < a.length; i++)
			sum.push(a[i].sub(b[i]));
		return new BigNum(sum);
	}

	/**
	 * Multiplies two [[BigNum]] instances. Multiplication is defined using
	 * the [Caley-Dickson definition](https://en.wikipedia.org/wiki/Cayley–Dickson_construction#Octonions).
	 * @param that The number to multiply with.
	 * @returns this * that.
	 */
	public mul(that: BigNum): BigNum {
		const zero = new BigNum(Component.ZERO);
		if(this.equals(zero) || that.equals(zero))
			return zero;
		if(this.dim === 1 && that.dim === 1)
			return new BigNum(this.components[0].mul(that.components[0]));
		if(this.dim === 1)
			return new BigNum(that.components.map(x => this.components[0].mul(x)));
		if(that.dim === 1)
			return new BigNum(this.components.map(x => x.mul(that.components[0])));
		const n = Math.max(this.dim, that.dim);
		const a1 = new BigNum(this.components.slice(0, n/2)), a2 = new BigNum(this.components.slice(n/2));
		const b1 = new BigNum(that.components.slice(0, n/2)), b2 = new BigNum(that.components.slice(n/2));
		let q1 = a1.mul(b1).sub(b2.conj.mul(a2)).components;
		let q2 = b2.mul(a1).add(a2.mul(b1.conj)).components;
		q1 = pad(q1, n/2-q1.length, Component.ZERO, "end");
		q2 = pad(q2, n/2-q2.length, Component.ZERO, "end");
		const q = new BigNum(q1.concat(q2));
		return q;
	}

	/**
	 * Calculates the multiplicative inverse of this.
	 */
	public get inv() {
		const magSq = this.norm.components[0].pow(Component.TWO);
		const scale = new BigNum(Component.ONE.div(magSq));
		return this.conj.mul(scale);
	}

	public div(that: BigNum): BigNum;
	public div(that: BigNum, side: "left" | "right"): BigNum;
	public div(that: BigNum, side="right") {
		return side === "right"? this.mul(that.inv): that.inv.mul(this);
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

export namespace BigNum {
	/**
	 * Creates a [[BigNum]] instance from the string representation of a real number.
	 * @param num The string representation of a real number in decimal system.
	 */
	export function real(num: string): BigNum;
	/**
	 * Creates a [[BigNum]] instance from the decimal representation of a real
	 * number. This instance created will store the exact binary floating
	 * point value of the number. Even though it uses the `toString()` method
	 * to convert the number to a string it might be unpredictable at times.
	 * @param num A numeric expression.
	 */
	export function real(num: number): BigNum;
	export function real(a: number|string) {
		let num = a.toString();
		return new BigNum(Component.create(num));
	}

	/**
	 * Creates a [[BigNum]] instance of a complex number from the decimal representations
	 * of the real and imaginary part. This instance will store the exact binary
	 * floating point value of the number. Even though it uses the `toString()`
	 * method to convert number to string it might be unpredictable at times.
	 * @param real The real part of the number.
	 * @param imag The imaginary part of the number.
	 */
	export function complex(real: number, imag: number): BigNum;
	/**
	 * Creates a [[BigNum]] instance from the string representations of the real
	 * and imaginary parts.
	 * @param real The real part of the number.
	 * @param imag The imaginary part of the number.
	 */
	export function complex(real: string, imag: string): BigNum;
	export function complex(a: number|string, b: number|string) {
		return new BigNum(Component.create(a.toString()), Component.create(b.toString()));
	}

	/**
	 * Creates a [[BigNum]] instance from the components of a [hyper-complex](https://en.wikipedia.org/wiki/Hypercomplex_number)
	 * number that follow the [Cayley-Dickson construction](https://en.wikipedia.org/wiki/Cayley–Dickson_construction).
	 * This instance will use the exact binary floating point representations
	 * of the components. Even though it uses the `toString()` method to convert
	 * numbers to strings it might be unpredictable at times.
	 * @param comps The components of the number.
	 */
	export function hyper(...comps: number[]): BigNum;
	/**
	 * Creates a [[BigNum]] instance from the components of a [hyper-complex](https://en.wikipedia.org/wiki/Hypercomplex_number)
	 * number that follow the [Cayley-Dickson construction](https://en.wikipedia.org/wiki/Cayley–Dickson_construction).
	 * This instance will use the exact binary floating point representations
	 * of the components. Even though it uses the `toString()` method to convert
	 * numbers to strings it might be unpredictable at times.
	 * @param comps The components of the number.
	 */
	export function hyper(comps: number[]): BigNum;
	/**
	 * Creates a [[BigNum]] instance from the components of a [hyper-complex](https://en.wikipedia.org/wiki/Hypercomplex_number)
	 * number that follow the [Cayley-Dickson construction](https://en.wikipedia.org/wiki/Cayley–Dickson_construction).
	 * @param comps The components of the number.
	 */
	export function hyper(...comps: string[]): BigNum;
	/**
	 * Creates a [[BigNum]] instance from the components of a [hyper-complex](https://en.wikipedia.org/wiki/Hypercomplex_number)
	 * number that follow the [Cayley-Dickson construction](https://en.wikipedia.org/wiki/Cayley–Dickson_construction).
	 * @param comps The components of the number.
	 */
	export function hyper(comps: string[]): BigNum;
	export function hyper(...vals: (number | string)[] | [(number | string)[]]) {
		let args: Component[];
		const temp = vals[0];
		if(temp instanceof Array)
			args = temp.map(x => Component.create(x.toString()));
		else args = (<Array<string|number>>vals).map(x => Component.create(x.toString()));
		return new BigNum(args);
	}
}