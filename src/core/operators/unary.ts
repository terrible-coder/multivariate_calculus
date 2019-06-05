import { Scalar } from "../../scalar";
import { Evaluable } from "../definitions";

export class math {
	[x: string]: any;

	public static sin(x: number): number;
	public static sin(x: Scalar.Constant): Scalar.Constant;
	public static sin(x: Scalar): Scalar.Expression;
	public static sin(x: number | Evaluable) {
		if(typeof x === "number")
			return Math.sin(x);
		if(x instanceof Scalar.Constant)
			return new Scalar.Constant(Math.sin(x.value));
		return new Scalar.Expression(UnaryOperator.SIN, x);
	}

	public static cos(x: number): number;
	public static cos(x: Scalar.Constant): Scalar.Constant;
	public static cos(x: Scalar): Scalar.Expression;
	public static cos(x: number | Evaluable) {
		if(typeof x === "number")
			return Math.cos(x);
		if(x instanceof Scalar.Constant)
			return new Scalar.Constant(Math.cos(x.value));
		return new Scalar.Expression(UnaryOperator.COS, x);
	}

	public static tan(x: number): number;
	public static tan(x: Scalar.Constant): Scalar.Constant;
	public static tan(x: Scalar): Scalar.Expression;
	public static tan(x: number | Evaluable) {
		if(typeof x === "number")
			return Math.tan(x);
		if(x instanceof Scalar.Constant)
			return new Scalar.Constant(Math.tan(x.value));
		return new Scalar.Expression(UnaryOperator.TAN, x);
	}

	public static asin(x: number): number;
	public static asin(x: Scalar.Constant): Scalar.Constant;
	public static asin(x: Scalar): Scalar.Expression;
	public static asin(x: number | Evaluable) {
		if(typeof x === "number")
			return Math.asin(x);
		if(x instanceof Scalar.Constant)
			return new Scalar.Constant(Math.asin(x.value));
		return new Scalar.Expression(UnaryOperator.ASIN, x);
	}

	public static acos(x: number): number;
	public static acos(x: Scalar.Constant): Scalar.Constant;
	public static acos(x: Scalar): Scalar.Expression;
	public static acos(x: number | Evaluable) {
		if(typeof x === "number")
			return Math.asin(x);
		if(x instanceof Scalar.Constant)
			return new Scalar.Constant(Math.acos(x.value));
		return new Scalar.Expression(UnaryOperator.ACOS, x);
	}

	public static atan(x: number): number;
	public static atan(x: Scalar.Constant): Scalar.Constant;
	public static atan(x: Scalar): Scalar.Expression;
	public static atan(x: number | Evaluable) {
		if(typeof x === "number")
			return Math.atan(x);
		if(x instanceof Scalar.Constant)
			return new Scalar.Constant(Math.atan(x.value));
		return new Scalar.Expression(UnaryOperator.ATAN, x);
	}

	public static log(x: number): number;
	public static log(x: Scalar.Constant): Scalar.Constant;
	public static log(x: Scalar): Scalar.Expression;
	public static log(x: number | Evaluable) {
		if(typeof x === "number")
			return Math.log10(x);
		if(x instanceof Scalar.Constant)
			return new Scalar.Constant(Math.log10(x.value));
		return new Scalar.Expression(UnaryOperator.LOG, x);
	}

	public static ln(x: number): number;
	public static ln(x: Scalar.Constant): Scalar.Constant;
	public static ln(x: Scalar): Scalar.Expression;
	public static ln(x: number | Evaluable) {
		if(typeof x === "number")
			return Math.log(x);
		if(x instanceof Scalar.Constant)
			return new Scalar.Constant(Math.log(x.value));
		return new Scalar.Expression(UnaryOperator.LN, x);
	}

	public static exp(x: number): number;
	public static exp(x: Scalar.Constant): Scalar.Constant;
	public static exp(x: Scalar): Scalar.Expression;
	public static exp(x: number | Evaluable) {
		if(typeof x === "number")
			return Math.exp(x);
		if(x instanceof Scalar.Constant)
			return new Scalar.Constant(Math.exp(x.value));
		return new Scalar.Expression(UnaryOperator.EXP, x);
	}
}

/** The trigonometric sine function. */
export const sin = math.sin;
/** The trigonometric cosine function. */
export const cos = math.cos;
/** The trigonometric tangent function. */
export const tan = math.tan;
/** The inverse trigonometric sine function. */
export const asin = math.asin;
/** The inverse trigonometric sosine function. */
export const acos = math.acos;
/** The inverse trigonometric tangent function. */
export const atan = math.atan;
/** The common logarithm function (to the base 10). */
export const log = math.log;
/** The natural logarithm function (to the base `e`). */
export const ln = math.ln;
/** The exponentiation function. */
export const exp = math.exp;

/**
 * Represents any kind of operator that only takes one operand to operate on.
 */
export enum UnaryOperator {
	/** Represents the trigonometric sine function. */
	SIN = "sin",
	/** Represents the trigonometric cosine function. */
	COS = "cos",
	/** Represents the trigonometric tangent function. */
	TAN = "tan",
	/** Represents the inverse trigonometric sine function. */
	ASIN = "asin",
	/** Represents the inverse trigonometric cosine function. */
	ACOS = "acos",
	/** Represents the inverse trigonometric tangent function. */
	ATAN = "atan",
	/** Represents the common logarithm function (to the base 10) */
	LOG = "log",
	/** Represents the natural logarithm function (to the base `e`) */
	LN = "ln",
	/** Represents the exponentiation function */
	EXP = "exp"
}

/**
 * Checks whether the passed string has been defined as a UnaryOperator.
 */
export function isUnaryOperator(s: string): s is UnaryOperator {
	for(let k in UnaryOperator)
		if(UnaryOperator[k] === s)
			return true;
	return false;
}