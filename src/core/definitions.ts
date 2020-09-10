import { BinaryOperator } from "./operators/binary";
import { UnaryOperator } from "./operators/unary";

/**
 * Anything in an expression can be considered as a token.
 * A tagging interface which all classes representing some mathematical
 * object must implement.
 */
export interface Token {
	/** The type of token `this` is representing. */
	readonly type: "operator" | "expression" | "variable" | "constant";
}

/**
 * Anything that has a value or can be later assigned a value.
 * A tagging interface which all classes representing some mathematical object
 * whose value can be evaluated, at run time or when user supplies the value,
 * must implement.
 */
export interface Evaluable extends Token {
	/** The type of quantity with some way of evaluating a value `this` represents. */
	readonly type: "expression" | "variable" | "constant";
	/**
	 * The kind of physical quantity `this` implements.
	 */
	readonly quantity: string;
	[x: string]: any;
}
/** Checks whether a given `Token` is an `Evaluable`. */
export function isEvaluable(e: Token): e is Evaluable {
	return e.type !== "operator";
}

/**
 * A variable is a symbolic representation of some quantity whose value we do
 * not know yet. Something whose value is not fixed and could take different
 * values depending upon the situation. This interface must be implemented by
 * all classes representing varying/unknown values.
 */
export interface Variable extends Evaluable {
	readonly type: "variable";
	/** The string with which `this` is identified by. */
	readonly name: string;
}
/** Checks whether a given `Evaluable` is a variable. */
export function isVariable(e: Evaluable): e is Variable {return e.type === "variable";}

/**
 * A constant is such a quantity whose value is known and remains fixed always.
 */
export interface Constant extends Evaluable {
	readonly type: "constant";
	/** The fixed value `this` object will represent. */
	readonly value: any;
	/** The string with which `this` is identified by. For a constant, this value
	 * is optional. The implementing classes should take care that there is some
	 * default value assigned should the user choose not to initialise a {@link Constant}
	 * with a name.
	 */
	readonly name: string;
	equals(that: Evaluable): boolean;
}
/** Checks whether a given `Evaluable` is a constant. */
export function isConstant(e: Evaluable): e is Constant {return e.type === "constant";}

/**
 * An expression represents a concept whose value depends on one or more
 * unknowns (variables). That "value" can be evaluated given the value(s) of
 * the unknown(s). More abstractly, an expression is some combination of
 * constants and variables to represent a quantity whose value depends on the
 * values of the variables it depends on.
 * 
 * As defined earlier, an expression is some combination of variables and constants.
 *  The thing which connects those bits together are operators. The Expression
 * interface uses a tree structure to store the different operations which must
 * be carried out on the operands. The postfix form of this tree would be
 * identical to the postfix notation of the mathematical expression this object
 * represents.
 */
export interface Expression extends Evaluable {
	readonly type: "expression";
	/** `Set` of `Variable` quantities `this` depends on. */
	readonly arg_list: Set<Variable>;
	readonly op: Operator;
	/** Array of `Evaluable` quantity/quantities `this.op` operates on. */
	readonly operands: Evaluable[];

	/** Array of parameters needed by operator method other than the operands. */
	readonly rest: any[];

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

/**
 * All classes which handle some sort of numerical operations must implement
 * this interface. This helps the global functions to recognise whether a certain
 * operation (function) is defined for a particular type of argument.
 */
export abstract class Numerical {
	/**
	 * Returns the class of which this object is an instance of.
	 */
	abstract classRef: any;
	/**
	 * Checks whether a method exists on the object or as a static member of
	 * the class.
	 * @param methodName Name of the method.
	 */
	public getDefinition(methodName: string) {
		if((<any>this)[methodName] !== undefined)
			return "instance";
		if(this.classRef[methodName] !== undefined)
			return "static";
		return "undefined";
	}
}

/** The general operator type. */
export type Operator = UnaryOperator | BinaryOperator;
