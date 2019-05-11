import { Evaluable, Operator, Variable, BinaryOperator, UnaryOperator, Constant } from "./definitions";
import { ADD, SUB, MUL } from "./operators";

type UnaryOperands = {
	readonly arg: Evaluable;
};

type BinaryOperands = {
	readonly lhs: Evaluable;
	readonly rhs: Evaluable;
};

/**
 * Represents an expression of one or variables along with constant values.
 * Uses a tree like structure to store all the data, namely, the variables
 * and the constants and how they are connected algebraically.
 */
export class Expression implements Evaluable {
	readonly type = "expression";
	/** The operator which connects the variables and/or constants for `this`. */
	readonly op: Operator;
	private readonly operands: BinaryOperands | UnaryOperands;
	/** The `Set` of variables which this expression depends on. */
	readonly arg_list: Set<Variable>;
	/**
	 * Creates an expression using a `BinaryOperator` as the root.
	 * @param op {BinaryOperator} The operator which acts on the variables and/or constants.
	 * @param lhs {Evaluable} The left hand side of the operator `this.op`.
	 * @param rhs {Evaluable} The right hand side of the operator `this.op`.
	 */
	constructor(op: BinaryOperator, lhs: Evaluable, rhs: Evaluable);
	/**
	 * Creates an expression using a `BinaryOperator` as the root.
	 * @param op {UnaryOperator} The operator which acts on the variables and/or constants.
	 * @param arg {Evaluable} The argument to the operator `this.op`.
	 */
	constructor(op: UnaryOperator, arg: Evaluable);
	// constructor(expr: Expression);
	constructor(a: Operator, b: Evaluable, c?: Evaluable) {
		this.arg_list = new Set<Variable>();
		this.op = a;
		if (a instanceof BinaryOperator) {
			if (c === undefined)
				throw "Binary operator needs two arguments.";
			this.operands = {lhs: b, rhs: c};
			if (b instanceof Expression)
				b.arg_list.forEach(v => this.arg_list.add(v));
			else if (b.type === "variable")
				this.arg_list.add(<Variable>b);
			if (c instanceof Expression)
				c.arg_list.forEach(v => this.arg_list.add(v));
			else if (c.type === "variable")
				this.arg_list.add(<Variable>c);
		}
		else {
			this.operands = {arg: b};
			if (b instanceof Expression)
				b.arg_list.forEach(v => this.arg_list.add(v));
			else if (b.type === "variable")
				this.arg_list.add(<Variable>b);
		}
	}

	/**
	 * @returns {Evaluable} In case of a `BinaryOperator`, the left hand side argument.
	 * @throws If `this.op` is a `UnaryOperator`.
	 */
	public get lhs(): Evaluable {
		if ("lhs" in this.operands)
			return this.operands.lhs;
		throw "Unary operator does not have left hand side argument.";
	}

	/**
	 * @returns {Evaluable} In case of a `BinaryOperator`, the right hand side argument.
	 * @throws If `this.op` is a `UnaryOperator`.
	 */
	public get rhs(): Evaluable {
		if ("rhs" in this.operands)
			return this.operands.rhs;
		throw "Unary operator does not have left hand side argument.";
	}

	/**
	 * @returns {Evaluable} In case of a `UnaryOperator`, the argument.
	 * @throws If `this.op` is a `BinaryOperator`.
	 */
	public get arg(): Evaluable {
		if ("arg" in this.operands)
			return this.operands.arg;
		throw "Unary operator does not have left hand side argument.";
	}

	/**
	 * Adds this `Expression` with another `Expression` or `Variable` or `Constant`.
	 * @param that {Evaluable} The value to add `this` to.
	 * @returns {Expression} The result of algebraic addition.
	 */
	public add(that: Evaluable): Expression {
		return new Expression(ADD, this, that);
	}

	/**
	 * Subtracts from this `Expression` another `Expression` or `Variable` or `Constant`.
	 * @param that {Evaluable} The value to subtract from `this` to.
	 * @returns {Expression} The result of algebraic addition.
	 */
	public sub(that: Evaluable): Expression {
		return new Expression(SUB, this, that);
	}

	/**
	 * Multiplies this `Expression` with another `Expression` or `Variable` or `Constant`.
	 * @param that {Evaluable} The value to multiply `this` with.
	 * @returns {Expression} The result of algebraic multiplication.
	 */
	public mul(that: Evaluable): Evaluable {
		return new Expression(MUL, this, that);
	}

	/**
	 * Checks whether the expression of `this` depends upon
	 * a particular `Variable` or not.
	 * @param v {Variable}
	 * @returns {boolean}
	 */
	public isFunctionOf(v: Variable) {
		return this.arg_list.has(v);
	}

	private static eval(e: Evaluable, values: Map<Variable, Constant>): Evaluable {
		if (e.type === "constant")
			return e;
		if (e.type === "variable")
			return values.get(<Variable>e) || e;
		if (e instanceof Expression) {
			let depends = false;
			e.arg_list.forEach(v => depends = depends || e.isFunctionOf(v));
			if (depends)
				return e.at(values);
		}
		return e;
	}

	/**
	 * Evaluates `this` at the given values for the variables
	 * `this` is a function of. After the evaluation is done, the result
	 * can be in one of two forms:
	 * 1. where `2 + 2` always gets evaluated down to `4`automatically.
	 * 1. where `2 + 2` remains in the unsimplified form without being calculated automatically.
	 * The second argument is taken to be `true` by default.
	 * The `true` value means that if `this` encounters `2 + 2`, it will return
	 * the result in the 1st form.
	 * A `false` value for the same forces `this` to leave `2 + 2` unchanged
	 * and the returned result will be like in the 2nd form.
	 * @param values {Map<Variable, Constant>} The list of `Constant` values
	 * to map the variables to.
	 * @param simple {boolean} Optional | Whether the result should be in the simplest form.
	 * @returns {Evaluable} The result after the given `Constant` values have
	 * been substituted in for the specified `Variable`s.
	 */
	public at(values: Map<Variable, Constant>, simple = true) {
		if (this.op instanceof BinaryOperator)
			return simple?
				this.op.operate(Expression.eval(this.lhs, values), Expression.eval(this.rhs, values)):
				new Expression(this.op, Expression.eval(this.lhs, values), Expression.eval(this.rhs, values))
		else
			return simple?
				(<UnaryOperator>this.op).operate(Expression.eval(this.arg, values)):
				new Expression(<UnaryOperator>this.op, Expression.eval(this.arg, values));
	}
}
