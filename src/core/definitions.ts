import { BinaryOperator } from "./operators/binary";
import { UnaryOperator } from "./operators/unary";

/**
 * Anything in an expression can be considered as a token.
 */
export interface Token {
	readonly type: "operator" | "expression" | "variable" | "constant";
}

/**
 * Anything that has a value or can be later assigned a value.
 */
export interface Evaluable extends Token {
	readonly type: "expression" | "variable" | "constant";
	readonly quantity: string;
	[x: string]: any;
}
/** Checks whether a given `Token` is an `Evaluable`. */
export function isEvaluable(e: Token): e is Evaluable {return e.type !== "operator"}

/**
 * A symbolic representation of anything whose value can change and
 * whose specific value is unknown.
 */
export interface Variable extends Evaluable {
	readonly type: "variable";
	readonly name: string;
}
/** Checks whether a given `Evaluable` is a variable. */
export function isVariable(e: Evaluable): e is Variable {return e.type === "variable";}

/**
 * Any variable with a known value that remains fixed throughout.
 */
export interface Constant extends Evaluable {
	readonly type: "constant";
	readonly value: any;
	readonly name: string;
	equals(that: Evaluable): boolean;
}
/** Checks whether a given `Evaluable` is a constant. */
export function isConstant(e: Evaluable): e is Constant {return e.type === "constant";}

/**
 * A mathematical statement that is contructed with any number of constants and
 * variables joined by operators in any legitimate condition.
 */
export interface Expression extends Evaluable {
	readonly type: "expression";
	/** `Set` of `Variable` quantities `this` depends on. */
	readonly arg_list: Set<Variable>;
	readonly op: Operator;
	/** Array of `Evaluable` quantity/quantities `this.op` operates on. */
	readonly operands: Evaluable[];
	/**
	 * The left hand side operand for `this.op`.
	 * @throws If `this.op` is a `UnaryOperator`.
	 */
	readonly lhs: Evaluable;
	/**
	 * The right hand side operand for `this.op`.
	 * @throws If `this.op` is a `UnaryOperator`.
	 */
	readonly rhs: Evaluable;
	/**
	 * The operand for `this.op`.
	 * @throws If `this.op` is a `BinaryOperator`.
	 */
	readonly arg: Evaluable;
	/**
	 * Checks whether `this` expression object depends on the given `Variable`.
	 * @param v {Variable}
	 */
	isFunctionOf(v: Variable): boolean;
	/**
	 * Evaluates `this` expression at the given values of the `Variable` quantities.
	 * @param values {Map<Variable, Constant>} The map from variables to constant values.
	 */
	at(values: Map<Variable, Constant>): Evaluable;
}
/** Checks whether a given `Evaluable` is an expression. */
export function isExpression(e: Evaluable): e is Expression {return e.type === "expression";}

/** The general operator type. */
export type Operator = UnaryOperator | BinaryOperator;

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
