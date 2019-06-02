export interface Token {
	readonly type: "operator" | "expression" | "variable" | "constant";
}

export interface Evaluable extends Token {
	readonly type: "expression" | "variable" | "constant";
	[x: string]: any;
}
export function isEvaluable(e: Token): e is Evaluable {return e.type !== "operator"}

export interface Variable extends Evaluable {
	readonly type: "variable";
}
export function isVariable(e: Evaluable): e is Variable {return e.type === "variable";}

export interface Constant extends Evaluable {
	readonly type: "constant";
	readonly value: any;
}
export function isConstant(e: Evaluable): e is Constant {return e.type === "constant";}

export interface Expression extends Evaluable {
	readonly type: "expression";
	readonly arg_list: Set<Variable>;
	readonly op: BinaryOperator;
	readonly lhs: Evaluable;
	readonly rhs: Evaluable;
	isFunctionOf(v: Variable): boolean;
	at(values: Map<Variable, Constant>): Evaluable;
}
export function isExpression(e: Evaluable): e is Expression {return e.type === "expression";}

// export abstract class Operator implements Token {
// 	readonly type = "operator";
// 	abstract readonly op: string | Function;
// 	abstract readonly operation: Function;
// }
export interface Operator {
	//readonly type: "operator";
}

export type BinaryOperator = "add" | "sub" | "mul" | "div";
export interface UnaryOperator extends Operator {
	(a: Evaluable): Evaluable;
}

export type UnaryOperands = {
	readonly arg: Evaluable;
};
export function isUnaryOperand(e: Object): e is UnaryOperands {
	return e.hasOwnProperty("arg");
}

export type BinaryOperands = {
	readonly lhs: Evaluable;
	readonly rhs: Evaluable;
};
export function isBinaryOperand(e: Object): e is BinaryOperands {
	return e.hasOwnProperty("lhs") && e.hasOwnProperty("rhs");
}
