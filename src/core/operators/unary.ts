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