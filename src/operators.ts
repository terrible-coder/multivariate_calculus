export enum BinaryOperator {
	/** The operator for adding two values. */
	ADD = "add",

	/** The operator for subtracting one value from another. */
	SUB = "sub",
	// export const SUB = BinaryOperator.define("-", (a: Evaluable, b: Evaluable) => {
	// 	if(a instanceof Scalar && b instanceof Scalar)
	// 		return a.sub(b);
	// 	throw "Subtraction not defined";
	// });
	/** The operator for multiplying two values. */
	MUL = "mul",
	// export const MUL = BinaryOperator.define("*", (a: Evaluable, b: Evaluable) => a.mul(b));
	/** The operator for dividing one value by another. */
	DIV = "div",
	// export const DIV = BinaryOperator.define("/", (a: Evaluable, b: Evaluable) => {
	// 	if(a instanceof Scalar && b instanceof Scalar)
	// 		return a.div(b);
	// 	throw "Division not defined";
	// });
}

export function isBinaryOperator(s: string): s is BinaryOperator {
	for(let k in BinaryOperator)
		if(BinaryOperator[k] === s)
			return true;
	return false;
}