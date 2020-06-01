import { trimZeroes, align, pad } from "./parsers";
import { Component } from "./component";
import { MathContext } from "./context";
import { mathenv } from "../env";
import { Numerical } from "../definitions";
import { alpha_beta } from "./numerical";

/**
 * Immutable, arbitrary precision, higher dimensional numbers. A BigNum consists of a
 * real part and imaginary part(s) stored as [[Component]] objects. A [[MathContext]] object
 * is used to specify the number of decimal places (not significant figures) the
 * user wants and what rounding algorithm should be used. Every operation is
 * carried out by an intermediate result which is then rounded to the preferred
 * number of decimal places using the preferred rounding algorithm.
 * 
 * The BigNum objects follow the [Cayley-Dickson construction](https://en.wikipedia.org/wiki/Cayley–Dickson_construction)
 * algebra for multiplication. They can be mathematically expressed as
 * 
 * \\[ x = \sum_{i=0}^{N-1} x_ie_i \\]
 * 
 * where \\( N \\) represents the number of dimensions the number exists in and
 * \\( e_i \\) are the orthogonal units. The components are stored using a real
 * first convention. Therefore, by convention \\( e_0 = 1 \\), the real
 * unit. The others are the imaginary units. The \\( e_1 \\) is our familiar
 * \\( \imath \\) for the complex numbers. Again, \\( e_2=\jmath \\) and \\( e_3=k \\)
 * are the [Hamilton's units for quaternions](https://en.wikipedia.org/wiki/Quaternion).
 * 
 * <div id="notation">
 * <strong>Notation</strong>:
 * 
 * In the documentation for the methods below, unless otherwise stated, the
 * following notation is used.
 * 
 * Let \\( x = a + v \\) where \\( a \\) is the real part and \\( v \\) is
 * the "vector" part or the purely imaginary part.
 * Define \\( \hat{v} = \frac{v}{\lvert v \rvert} \\) and \\( \theta = \lvert v \rvert \\)
 * such that \\( x = a + \hat{v} \theta \\).
 * </div>
 */
export class BigNum extends Numerical {

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
	 * For end users it is recommended that they use the [[BigNum.real]],
	 * [[BigNum.complex]] and [[BigNum.hyper]] functions to create new numbers.
	 * @param values The components of the number.
	 */
	constructor(...values: Component[]);
	/**
	 * Creates a higher dimensional number from its components.
	 * For end users it is recommended that they use the [[BigNum.real]],
	 * [[BigNum.complex]] and [[BigNum.hyper]] functions to create new numbers.
	 * @param values The components of the number.
	 */
	constructor(values: Component[]);
	constructor(...values: Component[] | [Component[]]) {
		super();
		let args: Component[];
		const temp = values[0];
		if(temp instanceof Array)
			args = temp;
		else args = <Array<Component>>values;
		args = trimZeroes<Component>(args, "end", x => x.integer === "" && x.decimal === "");
		this.dim = Math.pow(2, Math.ceil(Math.log2(args.length || 1)));
		this.components = pad(args, this.dim - args.length, Component.ZERO, "end");
	}

	public get classRef() {
		return BigNum;
	}

	/**
	 * Checks whether `this` and `that` are equal numbers. Equality is defined
	 * component wise. That is, two numbers \\( a \\) and \\( b \\) are equal
	 * if and only if
	 * 
	 * \\[ a_i = b_i \quad \forall i \\]
	 * 
	 * The equality is checked only upto the number of decimal places specified
	 * by [[mathenv.mode]].
	 * @param that The number to check against.
	 */
	public equals(that: BigNum): boolean;
	/**
	 * Checks whether `this` and `that` are equal numbers. Equality is defined
	 * component wise. That is, two numbers \\( a \\) and \\( b \\) are equal
	 * if and only if
	 * 
	 * \\[ a_i = b_i \quad \forall i \\]
	 * 
	 * The equality is checked only upto the number of decimal places specified
	 * by the given context settings.
	 * @param that The number to check against.
	 * @param context The context settings to use.
	 */
	public equals(that: BigNum, context: MathContext): boolean;
	public equals(that: BigNum, context=mathenv.mode) {
		if(this.dim !== that.dim)
			return false;
		const n = that.dim;
		for(let i = 0; i < n; i++)
			if(!this.components[i].equals(that.components[i], context))
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
	 * Evaluates the absolute value of a number correct upto the number of
	 * places specified by [[mathenv.mode]].
	 * @param x A number.
	 * @param context Context settings to use.
	 */
	public static absSq(x: BigNum): BigNum;
	/**
	 * Evaluates the absolute value of a number correct upto the number of
	 * places specified by the given context settings.
	 * @param x A number.
	 * @param context Context settings to use.
	 */
	public static absSq(x: BigNum, context: MathContext): BigNum;
	public static absSq(x: BigNum, ...args: any[]): BigNum;
	public static absSq(x: BigNum, ...args: any[]) {
		const context = args[0] || mathenv.mode;
		return new BigNum(x.components.reduce((prev, curr) => prev.add(curr.mul(curr, context), context), Component.ZERO));
	}

	/**
	 * Evaluates the absolute value of a number correct upto the number of
	 * places specified by [[mathenv.mode]].
	 * @param x A number.
	 */
	public static abs(x: BigNum): BigNum;
	public static abs(x: BigNum, context: MathContext): BigNum;
	public static abs(x: BigNum, ...args: any[]): BigNum;
	public static abs(x: BigNum, ...args: any[]) {
		const context = args[0] || mathenv.mode;
		const magsq = x.components.reduce((prev, curr) => prev.add(curr.pow(Component.TWO)), Component.ZERO);
		return new BigNum(magsq.pow(Component.create("0.5"), context));
	}

	/**
	 * Rounds off a [[BigNum]] instance, component-wise, according to some
	 * [[MathContext]]. The different rounding algorithms implemented are
	 * identical to the ones defined by the [RoundingMode](https://docs.oracle.com/javase/8/docs/api/java/math/RoundingMode.html)
	 * class of JAVA.
	 * @param x The number to be rounded off.
	 * @param context The context settings to use for rounding.
	 */
	public static round(x: BigNum, context: MathContext) {
		return new BigNum(x.components.map(comp => Component.round(comp, context)));
	}

	/**
	 * Evaluates the norm of this number. Since `this` is not necessarily a real
	 * number, the norm is defined as
	 * \\[ \text{norm } a = a^* a \\]
	 * where \\( a^* \\) is the conjugate of \\( a \\).
	 */
	public norm(context=mathenv.mode) {
		return this.conj.mul(this, context);
	}

	/**
	 * Adds two [[BigNum]] instances. Addition is defined component-wise.
	 * That is, for two numbers \\( a \\) and \\( b \\), their addition is defined as
	 * 
	 * \\[ a + b = \sum_i a_i + b_i \\]
	 * 
	 * The result is rounded according to [[mathenv.mode]].
	 * @param that The number to add this with.
	 * @returns this + that.
	 */
	public add(that: BigNum): BigNum;
	/**
	 * Adds two [[BigNum]] instances. Addition is defined component-wise.
	 * That is, for two numbers \\( a \\) and \\( b \\), their addition is defined as
	 * 
	 * \\[ a + b = \sum_i a_i + b_i \\]
	 * 
	 * The result is rounded according to the given context settings.
	 * @param that The number to add this with.
	 * @param context The context settings to use.
	 * @returns this + that.
	 */
	public add(that: BigNum, context: MathContext): BigNum;
	public add(that: BigNum, ...args: any[]): BigNum;
	public add(that: BigNum, ...args: any[]) {
		const context = args[0] || mathenv.mode;
		let [a, b] = align(this.components, that.components, Component.ZERO, this.dim - that.dim);
		const sum: Component[] = [];
		for(let i = 0; i < a.length; i++)
			sum.push(a[i].add(b[i], context));
		return new BigNum(sum);
	}

	/**
	 * Subtracts one [[BigNum]] instance from another. Subtraction is defined component-wise.
	 * That is, for two numbers \\( a \\) and \\( b \\), their difference is defined as
	 * 
	 * \\[ a - b = \sum_i a_i - b_i \\]
	 * 
	 * The result is rounded according to [[mathenv.mode]].
	 * @param that The number to add this with.
	 * @returns this - that.
	 */
	public sub(that: BigNum): BigNum;
	/**
	 * Subtracts one [[BigNum]] instance from another. Subtraction is defined component-wise.
	 * That is, for two numbers \\( a \\) and \\( b \\), their difference is defined as
	 * 
	 * \\[ a - b = \sum_i a_i - b_i \\]
	 * 
	 * The result is rounded according to the given context settings.
	 * @param that The number to add this with.
	 * @returns this - that.
	 */
	public sub(that: BigNum, context: MathContext): BigNum;
	public sub(that: BigNum, ...args: any[]): BigNum;
	public sub(that: BigNum, ...args: any[]) {
		const context = args[0] || mathenv.mode;
		let [a, b] = align(this.components, that.components, Component.ZERO, this.dim - that.dim);
		const sum: Component[] = [];
		for(let i = 0; i < a.length; i++)
			sum.push(a[i].sub(b[i], context));
		return new BigNum(sum);
	}

	/**
	 * Multiplies two [[BigNum]] instances. Multiplication is defined using
	 * the [Caley-Dickson definition](https://en.wikipedia.org/wiki/Cayley–Dickson_construction#Octonions).
	 * The result is rounded according to [[mathenv.mode]].
	 * @param that The number to multiply with.
	 * @returns this * that.
	 */
	public mul(that: BigNum): BigNum;
	/**
	 * Multiplies two [[BigNum]] instances. Multiplication is defined using
	 * the [Caley-Dickson definition](https://en.wikipedia.org/wiki/Cayley–Dickson_construction#Octonions).
	 * The result is rounded according to the given context settings.
	 * @param that The number to multiply with.
	 * @param context The context settings to use.
	 * @returns this * that.
	 */
	public mul(that: BigNum, context: MathContext): BigNum;
	public mul(that: BigNum, ...args: any[]): BigNum;
	public mul(that: BigNum, ...args: any[]) {
		const context = args[0] || mathenv.mode;
		const zero = new BigNum(Component.ZERO);
		if(this.equals(zero, context) || that.equals(zero, context))
			return zero;
		if(this.dim === 1 && that.dim === 1)
			return new BigNum(this.components[0].mul(that.components[0], context));
		if(this.dim === 1)
			return new BigNum(that.components.map(x => this.components[0].mul(x, context)));
		if(that.dim === 1)
			return new BigNum(this.components.map(x => x.mul(that.components[0], context)));
		const n = Math.max(this.dim, that.dim);
		const a1 = new BigNum(this.components.slice(0, n/2)),
			  a2 = new BigNum(this.components.slice(n/2));
		const b1 = new BigNum(that.components.slice(0, n/2)),
			  b2 = new BigNum(that.components.slice(n/2));
		let q1 = a1.mul(b1, context).sub(b2.conj.mul(a2, context), context).components;
		let q2 = b2.mul(a1, context).add(a2.mul(b1.conj, context), context).components;
		q1 = pad(q1, n/2-q1.length, Component.ZERO, "end");
		q2 = pad(q2, n/2-q2.length, Component.ZERO, "end");
		const q = new BigNum(q1.concat(q2));
		return q;
	}

	/**
	 * Calculates the multiplicative inverse of this.
	 */
	public inv(context=mathenv.mode) {
		const magSq = this.norm(context).components[0];
		const scale = new BigNum(Component.ONE.div(magSq, context));
		return this.conj.mul(scale, context);
	}

	/**
	 * Divides one [[BigNum]] instance by another. This method assumes right
	 * division. That is, the inverse of `that` is multiplied on the right.
	 * The result is rounded according to [[mathenv.mode]].
	 * @param that Number to divide by.
	 */
	public div(that: BigNum): BigNum;
	/**
	 * Divides one [[BigNum]] instance by another. This method assumes right
	 * division. That is, the inverse of `that` is multiplied on the right.
	 * The result is rounded according to the given context settings.
	 * @param that Number to divide by.
	 * @param context The context settings to use.
	 */
	public div(that: BigNum, context: MathContext): BigNum;
	/**
	 * Divides one [[BigNum]] instance by another. This method multiplies the
	 * inverse of `that` on the given "side" of `this`.
	 * The result is rounded according to [[mathenv.mode]].
	 * @param that Number to divide by.
	 * @param side Side on which to divide from.
	 */
	public div(that: BigNum, side: "left" | "right"): BigNum;
	/**
	 * Divides one [[BigNum]] instance by another. This method multiplies the
	 * inverse of `that` on the given "side" of `this`.
	 * The result is rounded according to the given context settings.
	 * @param that Number to divide by.
	 * @param side Side on which to divide from.
	 * @param context The context settings to use.
	 */
	public div(that: BigNum, side: "left" | "right", context: MathContext): BigNum;
	public div(that: BigNum, ...args: any[]): BigNum;
	public div(that: BigNum, ...args: any[]) {
		const a = args[0], b = args[1];
		let side: "left" | "right";
		let context: MathContext;
		if(b === undefined) {
			if(a === "left" || a === "right") {
				side = a;
				context = mathenv.mode;
			} else {
				side = "right";
				context = <MathContext>a;
			}
		} else {
			side = <"left" | "right">a;
			context = b;
		}
		if(this.dim === 1 && that.dim === 1)
			return new BigNum(this.components[0].div(that.components[0], context));
		if(that.dim === 1)
			return new BigNum(this.components.map(x => x.div(that.components[0], context)));
		if(this.dim === 1)
			return new BigNum(that.inv(context).components.map(x => x.div(this.components[0], context)));
		return side === "right"? this.mul(that.inv(context), context): that.inv(context).mul(this, context);
	}

	/**
	 * Calculates the trigonometric sine of a given number with rounding
	 * according to [[mathenv.mode]].
	 * 
	 * **Method**:
	 * 
	 * The sum formula works for higher dimensional numbers too.
	 * Therefore,
	 * 
	 * \\[ \sin (a + v) = \sin a \cosh \theta + \hat{v} \cos a \sinh \theta \\]
	 * 
	 * @param x A number.
	 * @see [Notation](#notation)
	 */
	public static sin(x: BigNum): BigNum;
	/**
	 * Calculates the trigonometric sine of a given number with rounding
	 * according to the given context settings.
	 * 
	 * **Method**:
	 * 
	 * The sum formula works for higher dimensional numbers too.
	 * Therefore,
	 * 
	 * \\[ \sin (a + v) = \sin a \cosh \theta + \hat{v} \cos a \sinh \theta \\]
	 * 
	 * @param x A number.
	 * @param context The context settings to use.
	 * @see [Notation](#notation)
	 */
	public static sin(x: BigNum, context: MathContext): BigNum;
	public static sin(x: BigNum, ...args: any[]): BigNum;
	public static sin(x: BigNum, ...args: any[]) {
		const context = args[0] || mathenv.mode;
		const a = x.real.components[0];
		const v = x.imag;
		if(v.equals(BigNum.real("0"), context))
			return new BigNum(Component.sin(a, context));
		const ctx: MathContext = {
			precision: 2 * context.precision,
			rounding: context.rounding
		};
		const theta = BigNum.abs(v, ctx).components[0];
		const v_hat = v.div(new BigNum(theta), ctx);
		const real = new BigNum(Component.sin(a, ctx).mul(Component.cosh(theta, ctx), ctx));
		const imag = new BigNum(Component.cos(a, ctx).mul(Component.sinh(theta, ctx), ctx));
		const res = real.add(v_hat.mul(imag, ctx), ctx);
		return BigNum.round(res, context);
	}

	/**
	 * Calculates the trigonometric cosine of a given number with rounding
	 * according to [[mathenv.mode]].
	 * 
	 * **Method**:
	 * 
	 * The sum formula works for higher dimensional numbers too.
	 * Therefore,
	 * 
	 * \\[ \cos (a + v) = \cos a \cosh \theta - \hat{v} \sin a \sinh \theta \\]
	 * 
	 * @param x A number.
	 * @see [Notation](#notation)
	 */
	public static cos(x: BigNum): BigNum;
	/**
	 * Calculates the trigonometric cosine of a given number with rounding
	 * according to the given context settings.
	 * 
	 * **Method**:
	 * 
	 * The sum formula works for higher dimensional numbers too.
	 * Therefore,
	 * 
	 * \\[ \cos (a + v) = \cos a \cosh \theta - \hat{v} \sin a \sinh \theta \\]
	 * 
	 * @param x A number.
	 * @param context The context settings to use.
	 * @see [Notation](#notation)
	 */
	public static cos(x: BigNum, context: MathContext): BigNum;
	public static cos(x: BigNum, ...args: any[]): BigNum;
	public static cos(x: BigNum, ...args: any[]) {
		const context = args[0] || mathenv.mode;
		const a = x.real.components[0];
		const v = x.imag;
		if(v.equals(BigNum.real("0"), context))
			return new BigNum(Component.cos(a, context));
		const ctx: MathContext = {
			precision: 2 * context.precision,
			rounding: context.rounding
		};
		const theta = BigNum.abs(v, ctx).components[0];
		const v_hat = v.div(new BigNum(theta), ctx);
		const real = new BigNum(Component.cos(a, ctx).mul(Component.cosh(theta, ctx), ctx));
		const imag = new BigNum(Component.sin(a, ctx).mul(Component.sinh(theta, ctx), ctx));
		const res = real.sub(v_hat.mul(imag, ctx), ctx);
		return BigNum.round(res, context);
	}

	/**
	 * Calculates the trigonometric tangent of a given number with rounding
	 * according to [[mathenv.mode]].
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
	public static tan(x: BigNum, ...args: any[]): BigNum;
	public static tan(x: BigNum, ...args: any[]) {
		const context = args[0] || mathenv.mode;
		const ctx: MathContext = {
			precision: 2 * context.precision,
			rounding: context.rounding
		}
		const res = BigNum.sin(x, ctx).div(BigNum.cos(x, ctx), ctx);
		return BigNum.round(res, context);
	}

	/**
	 * Calculates the inverse trigonometric sine of a given value with rounding
	 * according to [[mathenv.mode]].
	 * 
	 * **Method**:
	 * 
	 * \\[ \cos^{-1} (a + v) = \sin^{-1} \left( \frac{\alpha(a, \theta) - \beta(a, \theta)}{2} \right)
	 * 					- \cosh^{-1} \left( \frac{\alpha(a, \theta) + \beta(a, \theta)}{2} \right) \\]
	 * 
	 * where \\( \alpha(x, y) \\) and \\( \beta(x, y) \\) are defined by the
	 * function {@link alpha_beta}.
	 * @param x A number.
	 * @see [Notation](#notation)
	 * @see {@link alpha_beta}
	 */
	public static asin(x: BigNum): BigNum;
	/**
	 * Calculates the inverse trigonometric sine of a given value with rounding
	 * according to the given context setings.
	 * 
	 * **Method**:
	 * 
	 * \\[ \cos^{-1} (a + v) = \cos^{-1} \left( \frac{\alpha(a, \theta) - \beta(a, \theta)}{2} \right)
	 * 					- \cosh^{-1} \left( \frac{\alpha(a, \theta) + \beta(a, \theta)}{2} \right) \\]
	 * 
	 * where \\( \alpha(x, y) \\) and \\( \beta(x, y) \\) are defined by the
	 * function {@link alpha_beta}.
	 * @param x A number.
	 * @param context The context settings to use.
	 * @see [Notation](#notation)
	 * @see {@link alpha_beta}
	 */
	public static asin(x: BigNum, context: MathContext): BigNum;
	public static asin(x: BigNum, ...args: any[]): BigNum;
	public static asin(x: BigNum, ...args: any[]) {
		const context = args[0] || mathenv.mode;
		const ctx: MathContext = {
			precision: 2 * context.precision,
			rounding: context.rounding
		};
		const a = x.real.components[0];
		const v = x.imag;
		const theta = BigNum.abs(v, ctx).components[0];
		const v_hat = theta.equals(Component.ZERO, ctx)? BigNum.complex("0", "1"): v.div(new BigNum(theta), ctx);
		const [alpha, beta] = alpha_beta(a, theta, ctx);
		const cosh = alpha.add(beta, ctx).div(Component.TWO, ctx);
		const sin = alpha.sub(beta, ctx).div(Component.TWO, ctx);
		const real = new BigNum(Component.asin(sin, ctx));
		const imag = new BigNum(Component.acosh(cosh, ctx));
		const res = real.add(v_hat.mul(imag, ctx), ctx);
		return BigNum.round(res, context);
	}

	/**
	 * Calculates the inverse trigonometric cosine of a given value with rounding
	 * according to [[mathenv.mode]].
	 * 
	 * **Method**:
	 * 
	 * \\[ \cos^{-1} (a + v) = \cos^{-1} \left( \frac{\alpha(a, \theta) - \beta(a, \theta)}{2} \right)
	 * 					- \cosh^{-1} \left( \frac{\alpha(a, \theta) + \beta(a, \theta)}{2} \right) \\]
	 * 
	 * where \\( \alpha(x, y) \\) and \\( \beta(x, y) \\) are defined by the
	 * function {@link alpha_beta}.
	 * @param x A number.
	 * @param context The context settings to use.
	 * @see [Notation](#notation)
	 * @see {@link alpha_beta}
	 */
	public static acos(x: BigNum): BigNum;
	/**
	 * Calculates the inverse trigonometric cosine of a given value with rounding
	 * according to the given context settings.
	 * 
	 * **Method**:
	 * 
	 * \\[ \cos^{-1} (a + v) = \cos^{-1} \left( \frac{\alpha(a, \theta) - \beta(a, \theta)}{2} \right)
	 * 					- \cosh^{-1} \left( \frac{\alpha(a, \theta) + \beta(a, \theta)}{2} \right) \\]
	 * 
	 * where \\( \alpha(x, y) \\) and \\( \beta(x, y) \\) are defined by the
	 * function {@link alpha_beta}.
	 * @param x A number.
	 * @param context The context settings to use.
	 * @see [Notation](#notation)
	 * @see {@link alpha_beta}
	 */
	public static acos(x: BigNum, context: MathContext): BigNum;
	public static acos(x: BigNum, ...args: any[]): BigNum;
	public static acos(x: BigNum, ...args: any[]) {
		const context = args[0] || mathenv.mode;
		const ctx: MathContext = {
			precision: 2 * context.precision,
			rounding: context.rounding
		}
		const a = x.real.components[0];
		const v = x.imag;
		const theta = BigNum.abs(v, ctx).components[0];
		const v_hat = theta.equals(Component.ZERO, ctx)? BigNum.complex("0", "1"): v.div(new BigNum(theta), ctx);
		const [alpha, beta] = alpha_beta(a, theta, ctx);
		const cosh = alpha.add(beta, ctx).div(Component.TWO, ctx);
		const cos = alpha.sub(beta, ctx).div(Component.TWO, ctx);
		const real = new BigNum(Component.acos(cos, ctx));
		const imag = new BigNum(Component.acosh(cosh, ctx));
		const res = real.add(v_hat.mul(imag, ctx), ctx);
		return BigNum.round(res, context);
	}

	/**
	 * Calculates the inverse trigonometric tangent of a given value with rounding
	 * according to [[mathenv.mode]].
	 * @param x A number.
	 * @param context The context settings to use.
	 */
	public static atan(x: BigNum): BigNum;
	/**
	 * Calculates the inverse trigonometric tangent of a given value with rounding
	 * according to the given context settings.
	 * @param x A number.
	 * @param context The context settings to use.
	 */
	public static atan(x: BigNum, context: MathContext): BigNum;
	public static atan(x: BigNum, ...args: any[]): BigNum;
	public static atan(x: BigNum, ...args: any[]) {
		const context = args[0] || mathenv.mode;
		const ctx: MathContext = {
			precision: 2 * context.precision,
			rounding: context.rounding
		}
		const a = x.real.components[0];
		const v = x.imag;
		const theta = BigNum.abs(v, context).components[0];
		if(a.equals(Component.ZERO, context))
			if(theta.moreThan(Component.ONE))
				throw new TypeError("Undefined.");
		if(v.equals(BigNum.real("0"), context))
			return new BigNum(Component.atan(a, context));
		const v_hat = v.div(new BigNum(theta), ctx);
		const a_sq = a.mul(a, ctx);
		const atan_arg = Component.TWO.mul(a, ctx).div(
			Component.ONE.sub(x.norm(ctx).components[0] ,ctx), ctx);
		const [thetap1_sq, thetam1_sq] = [
			theta.add(Component.ONE, ctx), theta.sub(Component.ONE, ctx)
		].map(x => x.mul(x, ctx));
		const log_arg = a_sq.add(thetap1_sq, ctx).div(a_sq.add(thetam1_sq, ctx), ctx);
		const half = Component.create("0.5"), quarter = Component.create("0.25");
		const real = new BigNum(half.mul(Component.atan(atan_arg, ctx), ctx));
		const imag = new BigNum(quarter.mul(Component.ln(log_arg, ctx), ctx));
		const res = real.add(v_hat.mul(imag, ctx));
		return BigNum.round(res, context);
	}

	/**
	 * Calculates the hyperbolic sine of a given value with rounding according
	 * to [[mathenv.mode]].
	 * 
	 * **Method**:
	 * 
	 * The sum formula works for higher dimensional numbers too.
	 * Therefore,
	 * 
	 * \\[ \sinh (a + v) = \sinh a \cos \theta + \hat{v} \cosh a \sin \theta \\]
	 * 
	 * @param x A number.
	 * @see [Notation](#notation)
	 */
	public static sinh(x: BigNum): BigNum;
	/**
	 * Calculates the hyperbolic sine of a given value with rounding according
	 * to the given context settings.
	 * 
	 * **Method**:
	 * 
	 * The sum formula works for higher dimensional numbers too.
	 * Therefore,
	 * 
	 * \\[ \sinh (a + v) = \sinh a \cos \theta + \hat{v} \cosh a \sin \theta \\]
	 * 
	 * @param x A number.
	 * @param context The context settings to use.
	 * @see [Notation](#notation)
	 */
	public static sinh(x: BigNum, context: MathContext): BigNum;
	public static sinh(x: BigNum, ...args: any[]): BigNum;
	public static sinh(x: BigNum, ...args: any[]) {
		const context = args[0] || mathenv.mode;
		const ctx: MathContext = {
			precision: 2 * context.precision,
			rounding: context.rounding
		}
		const res = BigNum.exp(x, ctx).sub(BigNum.exp(x.neg, ctx), ctx).div(BigNum.real("2"), ctx);
		return BigNum.round(res, context);
	}

	/**
	 * Calculates the hyperbolic cosine of a given value with rounding according
	 * to [[mathenv.mode]].
	 * 
	 * **Method**:
	 * 
	 * The sum formula works for higher dimensional numbers too.
	 * Therefore,
	 * 
	 * \\[ \cosh (a + v) = \cosh a \cos \theta + \hat{v} \sinh a \sin \theta \\]
	 * 
	 * @param x A number.
	 * @see [Notation](#notation)
	 */
	public static cosh(x: BigNum): BigNum;
	/**
	 * Calculates the hyperbolic cosine of a given value with rounding according
	 * to the given context settings.
	 * 
	 * **Method**:
	 * 
	 * The sum formula works for higher dimensional numbers too.
	 * Therefore,
	 * 
	 * \\[ \cosh (a + v) = \cosh a \cos \theta + \hat{v} \sinh a \sin \theta \\]
	 * 
	 * @param x A number.
	 * @param context The context settings to use.
	 * @see [Notation](#notation)
	 */
	public static cosh(x: BigNum, context: MathContext): BigNum;
	public static cosh(x: BigNum, ...args: any[]): BigNum;
	public static cosh(x: BigNum, ...args: any[]) {
		const context = args[0] || mathenv.mode;
		const ctx: MathContext = {
			precision: 2 * context.precision,
			rounding: context.rounding
		}
		const res = BigNum.exp(x, ctx).add(BigNum.exp(x.neg, ctx), ctx).div(BigNum.real("2"), ctx);
		return BigNum.round(res, context);
	}

	/**
	 * Calculates the hyperbolic tangent of a given value with rounding according
	 * to the given context settings.
	 * 
	 * **Method**:
	 * 
	 * The easiest way to calculate \\( \tanh x \\) is to use
	 * 
	 * \\[ \tanh (a+v) = \frac{\sinh (a+v)}{\cosh (a+v)} \\]
	 * 
	 * Upon simplifying,
	 * 
	 * \\[ \tanh (a + v) = \frac{\sinh 2a}{\cosh 2a + \cos 2\theta} +
	 * 						\hat{v} \frac{\sin 2\theta}{\cosh 2a + \cos 2\theta} \\]
	 * 
	 * @param x A number.
	 * @see [Notation](#notation)
	 */
	public static tanh(x: BigNum): BigNum;
	/**
	 * Calculates the hyperbolic tangent of a given value with rounding according
	 * to the given context settings.
	 * 
	 * **Method**:
	 * 
	 * The easiest way to calculate \\( \tanh x \\) is to use
	 * 
	 * \\[ \tanh (a+v) = \frac{\sinh (a+v)}{\cosh (a+v)} \\]
	 * 
	 * Upon simplifying,
	 * 
	 * \\[ \tanh (a + v) = \frac{\sinh 2a}{\cosh 2a + \cos 2\theta} +
	 * 						\hat{v} \frac{\sin 2\theta}{\cosh 2a + \cos 2\theta} \\]
	 * 
	 * @param x A number.
	 * @param context The context settings to use.
	 * @see [Notation](#notation)
	 */
	public static tanh(x: BigNum, context: MathContext): BigNum;
	public static tanh(x: BigNum, ...args: any[]): BigNum;
	public static tanh(x: BigNum, ...args: any[]) {
		const context = args[0] || mathenv.mode;
		const a = x.real.components[0];
		const v = x.imag;
		if(v.equals(BigNum.real("0"), context))
			return new BigNum(Component.tanh(a, context));
		const ctx: MathContext = {
			precision: 2 * context.precision,
			rounding: context.rounding
		}
		const theta = BigNum.abs(v, ctx).components[0];
		const v_hat = v.div(new BigNum(theta), ctx);
		const [two_a, two_t] = [a, theta].map(val => val.add(val, ctx));
		const sinh = Component.sinh(two_a, ctx), cosh = Component.cosh(a, ctx);
		const sin = Component.sin(two_t, ctx), cos = Component.cos(two_t, ctx);
		const den = cosh.add(cos, ctx);
		const real = new BigNum(sinh.div(den, ctx));
		const imag = new BigNum(sin.div(den, ctx));
		const res = real.add(v_hat.mul(imag, ctx));
		return BigNum.round(res, context);
	}

	/**
	 * Calculates the inverse hyperbolic sine of a given value with rounding according
	 * to the given context settings.
	 * 
	 * **Method**:
	 * 
	 * \\[ \sinh^{-1} (a + v) = \cosh^{-1} (\frac{\alpha(\theta, a) + \beta(\theta, a)}{2})
	 * 					+ \hat{v} \sin^{-1} (\frac{\alpha(\theta, a) - \beta(\theta, a)}{2}) \\]
	 * 
	 * where \\( \alpha(x, y) \\) and \\( \beta(x, y) \\) are defined by the
	 * function {@link alpha_beta}.
	 * 
	 * @param x A number.
	 * @see [Notation](#notation)
	 */
	public static asinh(x: BigNum): BigNum;
	/**
	 * Calculates the inverse hyperbolic sine of a given value with rounding according
	 * to the given context settings.
	 * 
	 * **Method**:
	 * 
	 * \\[ \sinh^{-1} (a + v) = \cosh^{-1} (\frac{\alpha(\theta, a) + \beta(\theta, a)}{2})
	 * 					+ \hat{v} \sin^{-1} (\frac{\alpha(\theta, a) - \beta(\theta, a)}{2}) \\]
	 * 
	 * where \\( \alpha(x, y) \\) and \\( \beta(x, y) \\) are defined by the
	 * function {@link alpha_beta}.
	 * 
	 * @param x A number.
	 * @param context The context settings to use.
	 * @see [Notation](#notation)
	 */
	public static asinh(x: BigNum, context: MathContext): BigNum;
	public static asinh(x: BigNum, ...args: any[]): BigNum;
	public static asinh(x: BigNum, ...args: any[]) {
		const context = args[0] || mathenv.mode;
		const a = x.real.components[0];
		const v = x.imag;
		if(v.equals(BigNum.real("0"), context))
			return new BigNum(Component.asinh(a, context));
		const ctx: MathContext = {
			precision: 2 * context.precision,
			rounding: context.rounding
		}
		const theta = BigNum.abs(v, ctx).components[0];
		const v_hat = v.div(new BigNum(theta), ctx);
		const [alpha, beta] = alpha_beta(theta, a, ctx);
		const cosh = alpha.add(beta, ctx).div(Component.TWO, ctx);
		const sin = alpha.sub(beta, ctx).div(Component.TWO, ctx);
		const real = new BigNum(Component.acosh(cosh, ctx));
		const imag = new BigNum(Component.asin(sin, ctx));
		const res = real.add(v_hat.mul(imag, ctx), ctx);
		return BigNum.round(res, context);
	}

	/**
	 * Calculates the inverse hyperbolic cosine of a given value with rounding according
	 * to the given context settings.
	 * @param x A number.
	 */
	public static acosh(x: BigNum): BigNum;
	/**
	 * Calculates the inverse hyperbolic cosine of a given value with rounding according
	 * to the given context settings.
	 * @param x A number.
	 * @param context The context settings to use.
	 */
	public static acosh(x: BigNum, context: MathContext): BigNum;
	public static acosh(x: BigNum, ...args: any[]): BigNum;
	public static acosh(x: BigNum, ...args: any[]) {
		const context = args[0] || mathenv.mode;
		const a = x.real.components[0];
		const v = x.imag;
		if(v.equals(BigNum.real("0"), context) && !a.equals(Component.ZERO, context))
			return new BigNum(Component.acosh(a, context));
		const ctx: MathContext = {
			precision: 2 * context.precision,
			rounding: context.rounding
		}
		const theta = BigNum.abs(v, ctx).components[0];
		const v_hat = theta.equals(Component.ZERO, ctx)? BigNum.complex(0, 1): v.div(new BigNum(theta), ctx);
		const [alpha, beta] = alpha_beta(theta, a, ctx);
		const cosh = alpha.add(beta, ctx).div(Component.TWO, ctx);
		const cos = alpha.sub(beta, ctx).div(Component.TWO, ctx);
		const real = new BigNum(Component.acosh(cosh, ctx));
		const imag = new BigNum(Component.acos(cos, ctx));
		const res = real.add(v_hat.mul(imag, ctx), ctx);
		return BigNum.round(res, context);
	}

	/**
	 * Calculates the exponential of a given number with rounding according to
	 * [[mathenv.mode]].
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
	public static exp(x: BigNum, ...args: any[]): BigNum;
	public static exp(x: BigNum, ...args: any[]) {
		const context = args[0] || mathenv.mode;
		const ctx: MathContext = {
			precision: 2 * context.precision,
			rounding: context.rounding
		};
		let sum = BigNum.real("0");
		let term = BigNum.real("1");
		let n = BigNum.real("0");
		while(true) {
			sum = sum.add(term, ctx);
			const term1 = term.mul(x, ctx).div(n.add(BigNum.real("1")), ctx);
			if(term1.equals(BigNum.real("0"), ctx))
				return BigNum.round(sum, context);
			term = term1;
			n = n.add(BigNum.real("1"));
		}
	}

	/**
	 * Calculates the natural logarithm (to the base \\( e \\)) of a given number
	 * with rounding according to [[mathenv.mode]].
	 * @param x A number.
	 */
	public static ln(x: BigNum): BigNum;
	/**
	 * Calculates the natural logarithm (to the base \\( e \\)) of a given number
	 * with rounding according to the given context settings.
	 * @param x A number.
	 * @param context The context settings to use.
	 */
	public static ln(x: BigNum, context: MathContext): BigNum;
	public static ln(x: BigNum, ...args: any[]): BigNum;
	public static ln(x: BigNum, ...args: any[]) {
		const context = args[0] || mathenv.mode;
		const ctx: MathContext = {
			precision: 2 * context.precision,
			rounding: context.rounding
		};
		const r = BigNum.abs(x, ctx);
		const real = new BigNum(Component.ln(r.components[0], ctx));
		const u = x.div(r, ctx);
		const u0 = u.components[0]; //cos(theta)
		const sin2 = Component.ONE.sub(u0.pow(Component.TWO, ctx), ctx);
		const sin = new BigNum(sin2.pow(Component.create("0.5"), ctx));
		const theta = new BigNum(Component.acos(u0, ctx));
		const v = sin.equals(BigNum.real("0"), ctx)? BigNum.complex("0", "1"): u.imag.div(sin, ctx);
		const res = real.add(theta.mul(v, ctx), ctx);
		return BigNum.round(res, context);
	}

	// /**
	//  * Calculates the common logarithm (to the base \\( 10 \\)) of a given number
	//  * with rounding according to [[mathenv.mode]].
	//  * @param x A number.
	//  */
	// public static log(x: BigNum): BigNum;
	// /**
	//  * Calculates the common logarithm (to the base \\( 10 \\)) of a given number
	//  * with rounding according to the given context settings.
	//  * [[MathContext]].
	//  * @param x A number.
	//  * @param context The context settings to use.
	//  */
	// public static log(x: BigNum, context: MathContext): BigNum;
	// public static log(x: BigNum, context=mathenv.mode) {
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
	 * 
	 * The use of this function to create a new [[BigNum]] instance is recommended
	 * over using the constructor for the same. The constructor may not always be
	 * predictable is called directly.
	 * @param num The string representation of a real number in decimal system.
	 */
	export function real(num: string): BigNum;
	/**
	 * Creates a [[BigNum]] instance from the decimal representation of a real
	 * number. This instance created will store the exact binary floating
	 * point value of the number. Even though it uses the `toString()` method
	 * to convert the number to a string it might be unpredictable at times.
	 * 
	 * The use of this function to create a new [[BigNum]] instance is recommended
	 * over using the constructor for the same. The constructor may not always be
	 * predictable is called directly.
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
	 * 
	 * The use of this function to create a new [[BigNum]] instance is recommended
	 * over using the constructor for the same. The constructor may not always be
	 * predictable is called directly.
	 * @param real The real part of the number.
	 * @param imag The imaginary part of the number.
	 */
	export function complex(real: number, imag: number): BigNum;
	/**
	 * Creates a [[BigNum]] instance from the string representations of the real
	 * and imaginary parts.
	 * 
	 * The use of this function to create a new [[BigNum]] instance is recommended
	 * over using the constructor for the same. The constructor may not always be
	 * predictable is called directly.
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
	 * 
	 * The use of this function to create a new [[BigNum]] instance is recommended
	 * over using the constructor for the same. The constructor may not always be
	 * predictable is called directly.
	 * @param comps The components of the number.
	 */
	export function hyper(...comps: number[]): BigNum;
	/**
	 * Creates a [[BigNum]] instance from the components of a [hyper-complex](https://en.wikipedia.org/wiki/Hypercomplex_number)
	 * number that follow the [Cayley-Dickson construction](https://en.wikipedia.org/wiki/Cayley–Dickson_construction).
	 * This instance will use the exact binary floating point representations
	 * of the components. Even though it uses the `toString()` method to convert
	 * numbers to strings it might be unpredictable at times.
	 * 
	 * The use of this function to create a new [[BigNum]] instance is recommended
	 * over using the constructor for the same. The constructor may not always be
	 * predictable is called directly.
	 * @param comps The components of the number.
	 */
	export function hyper(comps: number[]): BigNum;
	/**
	 * Creates a [[BigNum]] instance from the components of a [hyper-complex](https://en.wikipedia.org/wiki/Hypercomplex_number)
	 * number that follow the [Cayley-Dickson construction](https://en.wikipedia.org/wiki/Cayley–Dickson_construction).
	 * @param comps The components of the number.
	 * 
	 * The use of this function to create a new [[BigNum]] instance is recommended
	 * over using the constructor for the same. The constructor may not always be
	 * predictable is called directly.
	 */
	export function hyper(...comps: string[]): BigNum;
	/**
	 * Creates a [[BigNum]] instance from the components of a [hyper-complex](https://en.wikipedia.org/wiki/Hypercomplex_number)
	 * number that follow the [Cayley-Dickson construction](https://en.wikipedia.org/wiki/Cayley–Dickson_construction).
	 * @param comps The components of the number.
	 * 
	 * The use of this function to create a new [[BigNum]] instance is recommended
	 * over using the constructor for the same. The constructor may not always be
	 * predictable is called directly.
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

	/**
	 * Returns a single unit corresponding to a given index. The indexing starts
	 * from 0. With \\( e_0 = 1 \\) defined as the real unit and the rest (for
	 * \\( i>0 \\)) are the orthogonal imaginary units.
	 * @param i The index.
	 */
	export function e(i: number) {
		if(i < 0)
			throw TypeError("Negative indices not allowed for basis.");
		const values = new Array(i).fill(0).map(() => Component.ZERO);
		values[i-1] = Component.ONE;
		return new BigNum(values);
	}
}