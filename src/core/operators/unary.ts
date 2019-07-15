import { Scalar } from "../../scalar";
import { Evaluable } from "../definitions";

/**
 * @ignore
 */
export class math {
	[x: string]: any;

	public static neg(x: number): number;
	public static neg(x: Scalar.Constant): Scalar.Constant;
	public static neg(x: Scalar): Scalar.Expression;
	public static neg(x: number | Evaluable) {
		if(typeof x === "number")
			return -x;
		if(x instanceof Scalar.Constant)
			return Scalar.constant(-x.value);
		if(x instanceof Scalar.Variable || x instanceof Scalar.Expression)
			return new Scalar.Expression(UnaryOperator.NEG, x);
	}

	public static sin(x: number): number;
	public static sin(x: Scalar.Constant): Scalar.Constant;
	public static sin(x: Scalar): Scalar.Expression;
	public static sin(x: number | Evaluable) {
		if(typeof x === "number")
			return Math.sin(x);
		if(x instanceof Scalar.Constant)
			return Scalar.constant(Math.sin(x.value));
		if(x instanceof Scalar.Variable || x instanceof Scalar.Expression)
			return new Scalar.Expression(UnaryOperator.SIN, x);
	}

	public static cos(x: number): number;
	public static cos(x: Scalar.Constant): Scalar.Constant;
	public static cos(x: Scalar): Scalar.Expression;
	public static cos(x: number | Evaluable) {
		if(typeof x === "number")
			return Math.cos(x);
		if(x instanceof Scalar.Constant)
			return Scalar.constant(Math.cos(x.value));
		if(x instanceof Scalar.Variable || x instanceof Scalar.Expression)
			return new Scalar.Expression(UnaryOperator.COS, x);
	}

	public static tan(x: number): number;
	public static tan(x: Scalar.Constant): Scalar.Constant;
	public static tan(x: Scalar): Scalar.Expression;
	public static tan(x: number | Evaluable) {
		if(typeof x === "number")
			return Math.tan(x);
		if(x instanceof Scalar.Constant)
			return Scalar.constant(Math.tan(x.value));
		if(x instanceof Scalar.Variable || x instanceof Scalar.Expression)
			return new Scalar.Expression(UnaryOperator.TAN, x);
	}

	public static asin(x: number): number;
	public static asin(x: Scalar.Constant): Scalar.Constant;
	public static asin(x: Scalar): Scalar.Expression;
	public static asin(x: number | Evaluable) {
		if(typeof x === "number")
			return Math.asin(x);
		if(x instanceof Scalar.Constant)
			return Scalar.constant(Math.asin(x.value));
		if(x instanceof Scalar.Variable || x instanceof Scalar.Expression)
			return new Scalar.Expression(UnaryOperator.ASIN, x);
	}

	public static acos(x: number): number;
	public static acos(x: Scalar.Constant): Scalar.Constant;
	public static acos(x: Scalar): Scalar.Expression;
	public static acos(x: number | Evaluable) {
		if(typeof x === "number")
			return Math.asin(x);
		if(x instanceof Scalar.Constant)
			return Scalar.constant(Math.acos(x.value));
		if(x instanceof Scalar.Variable || x instanceof Scalar.Expression)
			return new Scalar.Expression(UnaryOperator.ACOS, x);
	}

	public static atan(x: number): number;
	public static atan(x: Scalar.Constant): Scalar.Constant;
	public static atan(x: Scalar): Scalar.Expression;
	public static atan(x: number | Evaluable) {
		if(typeof x === "number")
			return Math.atan(x);
		if(x instanceof Scalar.Constant)
			return Scalar.constant(Math.atan(x.value));
		if(x instanceof Scalar.Variable || x instanceof Scalar.Expression)
			return new Scalar.Expression(UnaryOperator.ATAN, x);
	}

	public static sinh(x: number): number;
	public static sinh(x: Scalar.Constant): Scalar.Constant;
	public static sinh(x: Scalar): Scalar.Expression;
	public static sinh(x: number | Evaluable) {
		if(typeof x === "number")
			return Math.sinh(x);
		if(x instanceof Scalar.Constant)
			return Scalar.constant(Math.sinh(x.value));
		if(x instanceof Scalar.Variable || x instanceof Scalar.Expression)
			return new Scalar.Expression(UnaryOperator.SINH, x);
	}

	public static cosh(x: number): number;
	public static cosh(x: Scalar.Constant): Scalar.Constant;
	public static cosh(x: Scalar): Scalar.Expression;
	public static cosh(x: number | Evaluable) {
		if(typeof x === "number")
			return Math.cosh(x);
		if(x instanceof Scalar.Constant)
			return Scalar.constant(Math.cosh(x.value));
		if(x instanceof Scalar.Variable || x instanceof Scalar.Expression)
			return new Scalar.Expression(UnaryOperator.COSH, x);
	}

	public static tanh(x: number): number;
	public static tanh(x: Scalar.Constant): Scalar.Constant;
	public static tanh(x: Scalar): Scalar.Expression;
	public static tanh(x: number | Evaluable) {
		if(typeof x === "number")
			return Math.tanh(x);
		if(x instanceof Scalar.Constant)
			return Scalar.constant(Math.tanh(x.value));
		if(x instanceof Scalar.Variable || x instanceof Scalar.Expression)
			return new Scalar.Expression(UnaryOperator.TANH, x);
	}

	public static asinh(x: number): number;
	public static asinh(x: Scalar.Constant): Scalar.Constant;
	public static asinh(x: Scalar): Scalar.Expression;
	public static asinh(x: number | Evaluable) {
		if(typeof x === "number")
			return Math.asinh(x);
		if(x instanceof Scalar.Constant)
			return Scalar.constant(Math.asinh(x.value));
		if(x instanceof Scalar.Variable || x instanceof Scalar.Expression)
			return new Scalar.Expression(UnaryOperator.ASINH, x);
	}

	public static acosh(x: number): number;
	public static acosh(x: Scalar.Constant): Scalar.Constant;
	public static acosh(x: Scalar): Scalar.Expression;
	public static acosh(x: number | Evaluable) {
		if(typeof x === "number")
			return Math.asinh(x);
		if(x instanceof Scalar.Constant)
			return Scalar.constant(Math.acosh(x.value));
		if(x instanceof Scalar.Variable || x instanceof Scalar.Expression)
			return new Scalar.Expression(UnaryOperator.ACOSH, x);
	}

	public static atanh(x: number): number;
	public static atanh(x: Scalar.Constant): Scalar.Constant;
	public static atanh(x: Scalar): Scalar.Expression;
	public static atanh(x: number | Evaluable) {
		if(typeof x === "number")
			return Math.atanh(x);
		if(x instanceof Scalar.Constant)
			return Scalar.constant(Math.atanh(x.value));
		if(x instanceof Scalar.Variable || x instanceof Scalar.Expression)
			return new Scalar.Expression(UnaryOperator.ATANH, x);
	}

	public static log(x: number): number;
	public static log(x: Scalar.Constant): Scalar.Constant;
	public static log(x: Scalar): Scalar.Expression;
	public static log(x: number | Evaluable) {
		if(typeof x === "number")
			return Math.log10(x);
		if(x instanceof Scalar.Constant)
			return Scalar.constant(Math.log10(x.value));
		if(x instanceof Scalar.Variable || x instanceof Scalar.Expression)
			return new Scalar.Expression(UnaryOperator.LOG, x);
	}

	public static ln(x: number): number;
	public static ln(x: Scalar.Constant): Scalar.Constant;
	public static ln(x: Scalar): Scalar.Expression;
	public static ln(x: number | Evaluable) {
		if(typeof x === "number")
			return Math.log(x);
		if(x instanceof Scalar.Constant)
			return Scalar.constant(Math.log(x.value));
		if(x instanceof Scalar.Variable || x instanceof Scalar.Expression)
			return new Scalar.Expression(UnaryOperator.LN, x);
	}

	public static exp(x: number): number;
	public static exp(x: Scalar.Constant): Scalar.Constant;
	public static exp(x: Scalar): Scalar.Expression;
	public static exp(x: number | Evaluable) {
		if(typeof x === "number")
			return Math.exp(x);
		if(x instanceof Scalar.Constant)
			return Scalar.constant(Math.exp(x.value));
		if(x instanceof Scalar.Variable || x instanceof Scalar.Expression)
			return new Scalar.Expression(UnaryOperator.EXP, x);
	}

	public static sqrt(x: number): number;
	public static sqrt(x: Scalar.Constant): Scalar.Constant;
	public static sqrt(x: Scalar): Scalar.Expression;
	public static sqrt(x: number | Evaluable) {
		if(typeof x === "number")
			return Math.sqrt(x);
		if(x instanceof Scalar.Constant)
			return Scalar.constant(Math.sqrt(x.value));
		if(x instanceof Scalar.Variable || x instanceof Scalar.Expression)
			return new Scalar.Expression(UnaryOperator.SQRT, x);
	}

	public static abs(x: number): number;
	public static abs(x: Scalar.Constant): Scalar.Constant;
	public static abs(x: Scalar): Scalar.Expression;
	public static abs(x: number | Evaluable) {
		if(typeof x === "number")
			return Math.abs(x);
		if(x instanceof Scalar.Constant)
			return Scalar.constant(Math.abs(x.value));
		if(x instanceof Scalar.Variable || x instanceof Scalar.Expression)
			return new Scalar.Expression(UnaryOperator.ABS, x);
	}

	public static floor(x: number): number;
	public static floor(x: Scalar.Constant): Scalar.Constant;
	public static floor(x: Scalar): Scalar.Expression;
	public static floor(x: number | Evaluable) {
		if(typeof x === "number")
			return Math.floor(x);
		if(x instanceof Scalar.Constant)
			return Scalar.constant(Math.floor(x.value));
		if(x instanceof Scalar.Variable || x instanceof Scalar.Expression)
			return new Scalar.Expression(UnaryOperator.FLOOR, x);
	}

	public static ceil(x: number): number;
	public static ceil(x: Scalar.Constant): Scalar.Constant;
	public static ceil(x: Scalar): Scalar.Expression;
	public static ceil(x: number | Evaluable) {
		if(typeof x === "number")
			return Math.ceil(x);
		if(x instanceof Scalar.Constant)
			return Scalar.constant(Math.ceil(x.value));
		if(x instanceof Scalar.Variable || x instanceof Scalar.Expression)
			return new Scalar.Expression(UnaryOperator.CEIL, x);
	}
}

/** The negative value of its argument. */
export const neg = math.neg;
/** The trigonometric sine function. */
export const sin = math.sin;
/** The trigonometric cosine function. */
export const cos = math.cos;
/** The trigonometric tangent function. */
export const tan = math.tan;
/** The inverse trigonometric sine function. */
export const asin = math.asin;
/** The inverse trigonometric cosine function. */
export const acos = math.acos;
/** The inverse trigonometric tangent function. */
export const atan = math.atan;
/** The hyperbolic sine function. */
export const sinh = math.sinh;
/** The hyperbolic cosine function. */
export const cosh = math.cosh;
/** The hyperbolic tangent function. */
export const tanh = math.tanh;
/** The inverse hyperbolic sine function. */
export const asinh = math.asinh;
/** The inverse hyperbolic cosine function. */
export const acosh = math.acosh;
/** The inverse hyperbolic tangent function. */
export const atanh = math.atanh;
/** The common logarithm function (to the base 10). */
export const log = math.log;
/** The natural logarithm function (to the base `e`). */
export const ln = math.ln;
/** The exponentiation function. */
export const exp = math.exp;
/** The square root function. */
export const sqrt = math.sqrt;
/** The absolute value function. */
export const abs = math.abs;
/** The greatest integer function. */
export const floor = math.floor;
/** The smallest integer function. */
export const ceil = math.ceil;

/**
 * Represents any kind of operator that only takes one operand to operate on.
 */
export enum UnaryOperator {
	/** Represents the negative of a scalar. */
	NEG = "neg",
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
	/** Represents the hyperbolic sine function. */
	SINH = "sinh",
	/** Represents the hyperbolic cosine function. */
	COSH = "cosh",
	/** Represents the hyperbolic tangent function. */
	TANH = "tanh",
	/** Represents the inverse hyperbolic sine function. */
	ASINH = "asinh",
	/** Represents the inverse hyperbolic cosine function. */
	ACOSH = "acosh",
	/** Represents the inverse hyperbolic tangent function. */
	ATANH = "atanh",
	/** Represents the common logarithm function (to the base 10). */
	LOG = "log",
	/** Represents the natural logarithm function (to the base `e`). */
	LN = "ln",
	/** Represents the exponentiation function. */
	EXP = "exp",
	/** Represents the square root function. */
	SQRT = "sqrt",
	/** Represents the absolute value function. */
	ABS = "abs",
	/** Represents the greatest integer function. */
	FLOOR = "floor",
	/** Represents the least integer function. */
	CEIL = "ceil"
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