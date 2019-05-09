import { BinaryOperator, Evaluable } from "./definitions";
import { Scalar } from "./scalar";

export const ADD = BinaryOperator.define("+", (a: Evaluable, b: Evaluable) => a.add(b));
export const SUB = BinaryOperator.define("-", (a: Evaluable, b: Evaluable) => {
	if(a instanceof Scalar && b instanceof Scalar)
		return a.sub(b);
	throw "Subtraction not defined";
});
export const MUL = BinaryOperator.define("*", (a: Evaluable, b: Evaluable) => a.mul(b));
export const DIV = BinaryOperator.define("/", (a: Evaluable, b: Evaluable) => {
	if(a instanceof Scalar && b instanceof Scalar)
		return a.div(b);
	throw "Division not defined";
});