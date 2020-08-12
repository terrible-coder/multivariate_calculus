import { trimZeroes, align, pad } from "./parsers";
import { Component } from "./component";
import { MathContext } from "./context";
import { mathenv } from "../env";
import { Numerical } from "../definitions";
import { alpha_beta, alpha_beta_sq } from "./numerical";
import { UndefinedValue } from "../errors";

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
	 * The equality is checked only up to the number of decimal places specified
	 * by {@link mathenv.mode}.
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
	 * The equality is checked only up to the number of decimal places specified
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
	 * Evaluates the absolute value of a number correct up to the number of
	 * places specified by {@link mathenv.mode}.
	 * @param x A number.
	 * @param context Context settings to use.
	 */
	public static absSq(x: BigNum): BigNum;
	/**
	 * Evaluates the absolute value of a number correct up to the number of
	 * places specified by the given context settings.
	 * @param x A number.
	 * @param context Context settings to use.
	 */
	public static absSq(x: BigNum, context: MathContext): BigNum;
	/** @internal */
	public static absSq(x: BigNum, ...args: any[]): BigNum;
	public static absSq(x: BigNum, ...args: any[]) {
		const context = args[0] || mathenv.mode;
		return new BigNum(x.components.reduce((prev, curr) => prev.add(curr.mul(curr, context), context), Component.ZERO));
	}

	/**
	 * Evaluates the absolute value of a number correct up to the number of
	 * places specified by {@link mathenv.mode}.
	 * @param x A number.
	 */
	public static abs(x: BigNum): BigNum;
	/**
	 * Evaluates the absolute value of a number correct up to the number of
	 * places specified by the given context settings.
	 * @param x A number.
	 * @param context The context settings to use.
	 */
	public static abs(x: BigNum, context: MathContext): BigNum;
	/** @internal */
	public static abs(x: BigNum, ...args: any[]): BigNum;
	public static abs(x: BigNum, ...args: any[]) {
		const context = args[0] || mathenv.mode;
		const ctx: MathContext = {
			precision: context.precision + 5,
			rounding: context.rounding
		}
		const magSq = x.components.reduce((prev, curr) => prev.add(curr.mul(curr, ctx), ctx), Component.ZERO);
		return new BigNum(magSq.pow(Component.create("0.5"), context));
	}

	/**
	 * Rounds off a {@link BigNum} instance, component-wise, according to some
	 * {@link MathContext}. The different rounding algorithms implemented are
	 * heavily influenced by the
	 * [Java implementation of the same](https://docs.oracle.com/javase/8/docs/api/java/math/RoundingMode.html).
	 * @param x The number to be rounded off.
	 * @param context The context settings to use for rounding.
	 * @see {@link Component.round}
	 * @see {@link RoundingMode}
	 */
	public static round(x: BigNum, context: MathContext) {
		return new BigNum(x.components.map(comp => Component.round(comp, context)));
	}

	/**
	 * Evaluates the norm of this number. Since `this` is not necessarily a real
	 * number, the norm is defined as
	 * \\[ \text{norm } a = a^* a \\]
	 * where \\( a^* \\) is the conjugate of \\( a \\).
	 * 
	 * The norm is calculated with rounding according to {@link mathenv.mode}.
	 */
	public norm(): BigNum;
	/**
	 * Evaluates the norm of this number. Since `this` is not necessarily a real
	 * number, the norm is defined as
	 * \\[ \text{norm } a = a^* a \\]
	 * where \\( a^* \\) is the conjugate of \\( a \\).
	 * 
	 * The norm is calculated with rounding according to the given context.
	 * @param context The context settings to use.
	 */
	public norm(context: MathContext): BigNum;
	/** @internal */
	public norm(...args: any[]): BigNum;
	public norm(...args: any[]) {
		const context = args[0] || mathenv.mode;
		return this.conj.mul(this, context);
	}

	/**
	 * Adds two [[BigNum]] instances. Addition is defined component-wise.
	 * That is, for two numbers \\( a \\) and \\( b \\), their addition is defined as
	 * 
	 * \\[ a + b = \sum_i a_i + b_i \\]
	 * 
	 * The result is rounded according to {@link mathenv.mode}.
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
	/** @internal */
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
	 * The result is rounded according to {@link mathenv.mode}.
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
	/** @internal */
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
	 * the [Cayley-Dickson definition](https://en.wikipedia.org/wiki/Cayley–Dickson_construction#Octonions).
	 * The result is rounded according to {@link mathenv.mode}.
	 * @param that The number to multiply with.
	 * @returns this * that.
	 */
	public mul(that: BigNum): BigNum;
	/**
	 * Multiplies two [[BigNum]] instances. Multiplication is defined using
	 * the [Cayley-Dickson definition](https://en.wikipedia.org/wiki/Cayley–Dickson_construction#Octonions).
	 * The result is rounded according to the given context settings.
	 * @param that The number to multiply with.
	 * @param context The context settings to use.
	 * @returns this * that.
	 */
	public mul(that: BigNum, context: MathContext): BigNum;
	/** @internal */
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
	 * Calculates the multiplicative inverse of this. The result is rounded
	 * according to {@link mathenv.mode}.
	 */
	public inv(): BigNum;
	/**
	 * Calculates the multiplicative inverse of this. The result is rounded
	 * according to the given context.
	 */
	public inv(context: MathContext): BigNum;
	/** @internal */
	public inv(...args: any[]): BigNum;
	public inv(...args: any[]) {
		const context = args[0] || mathenv.mode;
		const magSq = this.norm(context).components[0];
		const scale = new BigNum(Component.ONE.div(magSq, context));
		return this.conj.mul(scale, context);
	}

	/**
	 * Divides one [[BigNum]] instance by another. This method assumes right
	 * division. That is, the inverse of `that` is multiplied on the right.
	 * The result is rounded according to {@link mathenv.mode}.
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
	 * The result is rounded according to {@link mathenv.mode}.
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
	/** @internal */
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
	 * Raises one {@link BigNum} instance to the power of another.
	 * The result is rounded according to {@link mathenv.mode}.
	 * @param that Number to divide by.
	 */
	public pow(exponent: BigNum): BigNum;
	/**
	 * Raises one {@link BigNum} instance to the power of another.
	 * The result is rounded according to the given context settings.
	 * @param that Number to divide by.
	 */
	public pow(exponent: BigNum, context: MathContext): BigNum;
	/** @internal */
	public pow(exponent: BigNum, context=mathenv.mode) {
		const ctx: MathContext = {
			precision: context.precision + 5,
			rounding: context.rounding
		}
		const res = BigNum.exp(exponent.mul(BigNum.ln(this, ctx), ctx), ctx);
		return BigNum.round(res, context);
	}

	/**
	 * Rounds a number (for complex and hyper-complex numbers, all the components
	 * of the number) towards positive infinity.
	 * @param x Number to round.
	 * @see {@link Component.ceil}
	 */
	public static ceil(x: BigNum) {
		return new BigNum(x.components.map(value => Component.ceil(value)));
	}

	/**
	 * Rounds a number (for complex and hyper-complex numbers, all the components
	 * of the number) towards negative infinity.
	 * @param x Number to round.
	 * @see {@link Component.floor}
	 */
	public static floor(x: BigNum) {
		return new BigNum(x.components.map(value => Component.floor(value)));
	}

	/**
	 * Calculates the trigonometric sine of a given number with rounding
	 * according to {@link mathenv.mode}.
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
	/** @internal */
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
	 * according to {@link mathenv.mode}.
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
	/** @internal */
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
	 * according to {@link mathenv.mode}.
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
	/** @internal */
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
	 * according to {@link mathenv.mode}.
	 * 
	 * **Method**:
	 * 
	 * \\[ \sin^{-1} (a + v) = \sin^{-1} \left( \frac{\alpha(a, \theta) - \beta(a, \theta)}{2} \right)
	 * 			+ \hat{v} \cosh^{-1} \left( \frac{\alpha(a, \theta) + \beta(a, \theta)}{2} \right) \\]
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
	 * according to the given context settings.
	 * 
	 * **Method**:
	 * 
	 * \\[ \sin^{-1} (a + v) = \sin^{-1} \left( \frac{\alpha(a, \theta) - \beta(a, \theta)}{2} \right)
	 * 			+ \hat{v} \cosh^{-1} \left( \frac{\alpha(a, \theta) + \beta(a, \theta)}{2} \right) \\]
	 * 
	 * where \\( \alpha(x, y) \\) and \\( \beta(x, y) \\) are defined by the
	 * function {@link alpha_beta}.
	 * @param x A number.
	 * @param context The context settings to use.
	 * @see [Notation](#notation)
	 * @see {@link alpha_beta}
	 */
	public static asin(x: BigNum, context: MathContext): BigNum;
	/** @internal */
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
	 * according to {@link mathenv.mode}.
	 * 
	 * **Method**:
	 * 
	 * \\[ \cos^{-1} (a + v) = \cos^{-1} \left( \frac{\alpha(a, \theta) - \beta(a, \theta)}{2} \right)
	 * 			- \hat{v} \cosh^{-1} \left( \frac{\alpha(a, \theta) + \beta(a, \theta)}{2} \right) \\]
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
	 * 			- \hat{v} \cosh^{-1} \left( \frac{\alpha(a, \theta) + \beta(a, \theta)}{2} \right) \\]
	 * 
	 * where \\( \alpha(x, y) \\) and \\( \beta(x, y) \\) are defined by the
	 * function {@link alpha_beta}.
	 * @param x A number.
	 * @param context The context settings to use.
	 * @see [Notation](#notation)
	 * @see {@link alpha_beta}
	 */
	public static acos(x: BigNum, context: MathContext): BigNum;
	/** @internal */
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
		const res = real.sub(v_hat.mul(imag, ctx), ctx);
		return BigNum.round(res, context);
	}

	/**
	 * Calculates the inverse trigonometric tangent of a given value with rounding
	 * according to {@link mathenv.mode}.
	 * 
	 * **Method**:
	 * 
	 * \\[ \tan^{-1}(a+v) = \frac{1}{2} \tan^{-1} \left( \frac{2a}{1 - \lVert a+v \rVert} \right)
	 * 				+ \hat{v} \frac{1}{4} \ln \left( \frac{\alpha^2(\theta, a)}{\beta^2(\theta, a)} \right) \\]
	 * 
	 * where \\( \alpha(x, y) \\) and \\( \beta(x, y) \\) are defined by the
	 * function {@link alpha_beta} and \\( \lVert a+v \rVert \\) is the {@link norm} of the argument.
	 * @param x A number.
	 * @see {@link alpha_beta}
	 * @see {@link norm}
	 * @see [Notation](#notation)
	 */
	public static atan(x: BigNum): BigNum;
	/**
	 * Calculates the inverse trigonometric tangent of a given value with rounding
	 * according to the given context settings.
	 * 
	 * **Method**:
	 * 
	 * \\[ \tan^{-1}(a+v) = \frac{1}{2} \tan^{-1} \left( \frac{2a}{1 - \lVert a+v \rVert} \right)
	 * 				+ \hat{v} \frac{1}{4} \ln \left( \frac{\alpha^2(\theta, a)}{\beta^2(\theta, a)} \right) \\]
	 * 
	 * where \\( \alpha(x, y) \\) and \\( \beta(x, y) \\) are defined by the
	 * function {@link alpha_beta} and \\( \lVert a+v \rVert \\) is the {@link norm} of the argument.
	 * @param x A number.
	 * @param context The context settings to use.
	 * @see {@link alpha_beta}
	 * @see {@link norm}
	 * @see [Notation](#notation)
	 */
	public static atan(x: BigNum, context: MathContext): BigNum;
	/** @internal */
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
				throw new UndefinedValue("atan", x, [
													"The function atan for purely",
													"imaginary inputs is defined",
													"only for values with absolute",
													"value less than or equal to 1."
												].join(" "));
		if(v.equals(BigNum.real("0"), context))
			return new BigNum(Component.atan(a, context));
		const v_hat = v.div(new BigNum(theta), ctx);
		const atan_arg = Component.TWO.mul(a, ctx).div(
			Component.ONE.sub(x.norm(ctx).components[0] ,ctx), ctx);
		const [alpha2, beta2] = alpha_beta_sq(theta, a, ctx);
		const log_arg = alpha2.div(beta2, ctx);
		const half = Component.create("0.5"), quarter = Component.create("0.25");
		const real = new BigNum(half.mul(Component.atan(atan_arg, ctx), ctx));
		const imag = new BigNum(quarter.mul(Component.ln(log_arg, ctx), ctx));
		const res = real.add(v_hat.mul(imag, ctx), ctx);
		return BigNum.round(res, context);
	}

	/**
	 * Calculates the hyperbolic sine of a given value with rounding according
	 * to {@link mathenv.mode}.
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
	/** @internal */
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
	 * to {@link mathenv.mode}.
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
	/** @internal */
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
	 * to {@link mathenv.mode}.
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
	/** @internal */
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
		const res = real.add(v_hat.mul(imag, ctx), ctx);
		return BigNum.round(res, context);
	}

	/**
	 * Calculates the inverse hyperbolic sine of a given value with rounding according
	 * to {@link mathenv.mode}.
	 * 
	 * **Method**:
	 * 
	 * \\[ \sinh^{-1} (a + v) = \cosh^{-1} \left( \frac{\alpha(\theta, a) + \beta(\theta, a)}{2} \right)
	 * 				+ \hat{v} \sin^{-1} \left( \frac{\alpha(\theta, a) - \beta(\theta, a)}{2} \right) \\]
	 * 
	 * where \\( \alpha(x, y) \\) and \\( \beta(x, y) \\) are defined by the
	 * function {@link alpha_beta}.
	 * 
	 * @param x A number.
	 * @see [Notation](#notation)
	 * @see {@link alpha_beta}
	 */
	public static asinh(x: BigNum): BigNum;
	/**
	 * Calculates the inverse hyperbolic sine of a given value with rounding according
	 * to the given context settings.
	 * 
	 * **Method**:
	 * 
	 * \\[ \sinh^{-1} (a + v) = \cosh^{-1} \left( \frac{\alpha(\theta, a) + \beta(\theta, a)}{2} \right)
	 * 				+ \hat{v} \sin^{-1} \left( \frac{\alpha(\theta, a) - \beta(\theta, a)}{2} \right) \\]
	 * 
	 * where \\( \alpha(x, y) \\) and \\( \beta(x, y) \\) are defined by the
	 * function {@link alpha_beta}.
	 * 
	 * @param x A number.
	 * @param context The context settings to use.
	 * @see [Notation](#notation)
	 * @see {@link alpha_beta}
	 */
	public static asinh(x: BigNum, context: MathContext): BigNum;
	/** @internal */
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
	 * to {@link mathenv.mode}.
	 * 
	 * **Method**:
	 * 
	 * \\[ \cosh^{-1} (a + v) = \cosh^{-1} \left( \frac{\alpha(\theta, a) + \beta(\theta, a)}{2} \right)
	 * 				+ \hat{v} \cos^{-1} \left( \frac{\alpha(\theta, a) - \beta(\theta, a)}{2} \right) \\]
	 * 
	 * where \\( \alpha(x, y) \\) and \\( \beta(x, y) \\) are defined by the
	 * function {@link alpha_beta}.
	 * @param x A number.
	 * @see {@link alpha_beta}
	 * @see [Notation](#notation)
	 */
	public static acosh(x: BigNum): BigNum;
	/**
	 * Calculates the inverse hyperbolic cosine of a given value with rounding according
	 * to the given context settings.
	 * 
	 * **Method**:
	 * 
	 * \\[ \cosh^{-1} (a + v) = \cosh^{-1} \left( \frac{\alpha(\theta, a) + \beta(\theta, a)}{2} \right)
	 * 				+ \hat{v} \cos^{-1} \left( \frac{\alpha(\theta, a) - \beta(\theta, a)}{2} \right) \\]
	 * 
	 * where \\( \alpha(x, y) \\) and \\( \beta(x, y) \\) are defined by the
	 * function {@link alpha_beta}.
	 * @param x A number.
	 * @param context The context settings to use.
	 * @see {@link alpha_beta}
	 * @see [Notation](#notation)
	 */
	public static acosh(x: BigNum, context: MathContext): BigNum;
	/** @internal */
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
	 * Calculates the inverse hyperbolic tangent of a given value with rounding according
	 * to {@link mathenv.mode}.
	 * 
	 * **Method**:
	 * 
	 * \\[ \tanh^{-1} (a + v) = \frac{1}{4} \ln \left( \frac{\alpha^2(a, \theta)}{\beta^2(a, \theta)} \right)
	 * 				+\hat{v} \frac{1}{2} \tan^{-1} \left( \frac{2\theta}{1 - \lVert a+v \rVert} \right) \\]
	 * 
	 * where \\( \alpha(x, y) \\) and \\( \beta(x, y) \\) are defined by the
	 * function {@link alpha_beta} and \\( \lVert a+v \rVert \\) is the {@link norm} of the argument.
	 * @param x A number.
	 * @see {@link alpha_beta}
	 * @see {@link norm}
	 * @see [Notation](#notation)
	 */
	public static atanh(x: BigNum): BigNum;
	/**
	 * Calculates the inverse hyperbolic tangent of a given value with rounding according
	 * to the given context settings.
	 * 
	 * **Method**:
	 * 
	 * \\[ \tanh^{-1} (a + v) = \frac{1}{4} \ln \left( \frac{\alpha^2(a, \theta)}{\beta^2(a, \theta)} \right)
	 * 				+\hat{v} \frac{1}{2} \tan^{-1} \left( \frac{2\theta}{1 - \lVert a+v \rVert} \right) \\]
	 * 
	 * where \\( \alpha(x, y) \\) and \\( \beta(x, y) \\) are defined by the
	 * function {@link alpha_beta} and \\( \lVert a+v \rVert \\) is the {@link norm} of the argument.
	 * @param x A number.
	 * @param context The context settings to use.
	 * @see {@link alpha_beta}
	 * @see {@link norm}
	 * @see [Notation](#notation)
	 */
	public static atanh(x: BigNum, context: MathContext): BigNum;
	/** @internal */
	public static atanh(x: BigNum, ...args: any[]): BigNum;
	public static atanh(x: BigNum, ...args: any[]) {
		const context = args[0] || mathenv.mode;
		const a = x.real.components[0];
		const v = x.imag;
		if(v.equals(BigNum.real("0"), context) && Component.abs(a).lessThan(Component.ONE))
				return new BigNum(Component.atanh(a, context));
		const ctx: MathContext = {
			precision: 2 * context.precision,
			rounding: context.rounding
		}
		const theta = BigNum.abs(v, ctx).components[0];
		const v_hat = theta.equals(Component.ZERO, ctx)? BigNum.complex(0, 1): v.div(new BigNum(theta), ctx);
		const [alpha2, beta2] = alpha_beta_sq(a, theta, ctx);
		const half = Component.create("0.5"), quarter = Component.create("0.25");
		const atan_arg = Component.TWO.mul(theta, ctx).div(
			Component.ONE.sub(x.norm(ctx).components[0], ctx), ctx
		);
		const log_arg = alpha2.div(beta2, ctx);
		const real = new BigNum(quarter.mul(Component.ln(log_arg, ctx), ctx));
		const imag = new BigNum(half.mul(Component.atan(atan_arg, ctx).add(Component.PI, ctx), ctx));
		const res = real.add(v_hat.mul(imag, ctx), ctx);
		return BigNum.round(res, context);
	}

	/**
	 * Calculates the exponential of a given number with rounding according to
	 * {@link mathenv.mode}.
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
	/** @internal */
	public static exp(x: BigNum, ...args: any[]): BigNum;
	public static exp(x: BigNum, ...args: any[]) {
		const context = args[0] || mathenv.mode;
		const ctx: MathContext = {
			precision: 2 * context.precision,
			rounding: context.rounding
		};
		let sum = BigNum.real("0");
		let term = BigNum.real("1");
		let n = 0;// BigNum.real("0");
		while(true) {
			sum = sum.add(term, ctx);
			const term1 = term.mul(x, ctx).div(BigNum.real(n+1), ctx);
			if(term1.equals(BigNum.real("0"), ctx))
				return BigNum.round(sum, context);
			term = term1;
			n++;
		}
	}

	/**
	 * Calculates the natural logarithm (to the base \\( e \\)) of a given number
	 * with rounding according to {@link mathenv.mode}.
	 * 
	 * **Method**:
	 * 
	 * Let \\( r \\) be the absolute value of \\( x \\).
	 * Therefore, \\( r = \lvert a + \hat{v} \theta \rvert \\).
	 * 
	 * \\[ \ln \left(a+\hat{v}\theta \\right) = \ln r + \hat{v} \phi \\]
	 * 
	 * where \\( \phi \\) is such that
	 * 
	 * \\[ \begin{align}
	 * 		a &= r \cos \phi \\\\
	 * 		\theta &= r \sin \phi
	 * 	\end{align} \\]
	 * 
	 * that is,
	 * 
	 * \\[ \phi = \operatorname{atan2} \left(\theta, a \right) \\]
	 * 
	 * @param x A number.
	 * @see {@link atan2}
	 * @see [Notation](#notation)
	 */
	public static ln(x: BigNum): BigNum;
	/**
	 * Calculates the natural logarithm (to the base \\( e \\)) of a given number
	 * with rounding according to the given context settings.
	 * 
	 * **Method**:
	 * 
	 * Let \\( r \\) be the absolute value of \\( x \\).
	 * Therefore, \\( r = \lvert a + \hat{v} \theta \rvert \\).
	 * 
	 * \\[ \ln \left(a+\hat{v}\theta \\right) = \ln r + \hat{v} \phi \\]
	 * 
	 * where \\( \phi \\) is such that
	 * 
	 * \\[ \begin{align}
	 * 		a &= r \cos \phi \\\\
	 * 		\theta &= r \sin \phi
	 * 	\end{align} \\]
	 * 
	 * that is,
	 * 
	 * \\[ \phi = \mathrm{atan2} \left(\theta, a \right) \\]
	 * 
	 * @param x A number.
	 * @param context The context settings to use.
	 * @see {@link atan2}
	 * @see [Notation](#notation)
	 */
	public static ln(x: BigNum, context: MathContext): BigNum;
	/** @internal */
	public static ln(x: BigNum, ...args: any[]): BigNum;
	public static ln(x: BigNum, ...args: any[]) {
		const context = args[0] || mathenv.mode;
		const ctx: MathContext = {
			precision: 2 * context.precision,
			rounding: context.rounding
		};
		const r = BigNum.abs(x, ctx).components[0];
		const a = x.real.components[0];
		const v = x.imag;
		const theta = BigNum.abs(v, ctx).components[0];
		const v_hat = theta.equals(Component.ZERO, context)? BigNum.complex(0, 1): v.div(new BigNum(theta), ctx);
		const real = new BigNum(Component.ln(r, ctx));
		const imag = new BigNum(Component.atan2(theta, a, context));
		const res = real.add(v_hat.mul(imag, ctx), ctx);
		return BigNum.round(res, context);
	}
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
	export function hyper(...values: (number | string)[] | [(number | string)[]]) {
		let args: Component[];
		const temp = values[0];
		if(temp instanceof Array)
			args = temp.map(x => Component.create(x.toString()));
		else args = (<Array<string|number>>values).map(x => Component.create(x.toString()));
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