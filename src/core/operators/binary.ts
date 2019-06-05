/**
 * Represents any kind of operator that has a left hand operand and a right hand operand.
 */
export enum BinaryOperator {
	/** The operator for adding two values. */
	ADD = "add",
	/** The operator for subtracting one value from another. */
	SUB = "sub",
	/** The operator for multiplying two values. */
	MUL = "mul",
	/** The operator for dividing one value by another. */
	DIV = "div",
}

/**
 * Checks whether the passed string has been defined as a BinaryOperator.
 */
export function isBinaryOperator(s: string): s is BinaryOperator {
	for(let k in BinaryOperator)
		if(BinaryOperator[k] === s)
			return true;
	return false;
}