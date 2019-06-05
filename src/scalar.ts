import { Token, Evaluable, Constant as _Constant, Variable as _Variable, Expression as _Expression, isConstant, isVariable, Operator } from "./definitions";
import { BinaryOperator } from "./operators";
import { ExpressionBuilder } from "./expression";
import { UnaryOperator } from "./unary";

/**
 * Base class to works with scalar quantities.
 */
export abstract class Scalar implements Token, Evaluable {
	readonly abstract type: "expression" | "variable" | "constant";

	/**
	 * Adds two `Scalar`s together. If `this` and `that` are both constants
	 * then numerically adds the two and returns a new `Scalar.Constant` object
	 * otherwise creates an `Expression` out of them and returns the same.
	 * @param that {Scalar} The scalar to add `this` with.
	 * @returns {Evaluable} The result of algebraic addition.
	 */
	public abstract add(that: Scalar): Scalar;

	/**
	 * Subtracts `that` from `this`. If `this` and `that` are both constants
	 * then numerically subtracts one from the other and returns a new
	 * `Scalar.Constant` object otherwise creates an `Expression` out of them
	 * and returns the same.
	 * @param that {Scalar} The scalar to subtract from `this`.
	 * @returns {Evaluable} The result of algebraic subtraction.
	 */
	public abstract sub(that: Scalar): Scalar;

	/**
	 * Multiplies two `Scalar`s together. If `this` and `that` are both constants
	 * then numerically multiplies the two and returns a new `Scalar.Constant` object
	 * otherwise creates an `Expression` out of them and returns the same.
	 * @param that {Scalar} The scalar to multiply `this` with.
	 * @returns {Evaluable} The result of algebraic multiplication.
	 */
	public abstract mul(that: Scalar): Scalar;

	/**
	 * Divides `this` scalar by `that`. If `this` and `that` are both constants
	 * then numerically divides the two and returns a new `Scalar.Constant` object
	 * otherwise creates an `Expression` out of them and returns the same.
	 * @param that {Scalar} The scalar to divide `this` by.
	 * @returns {Evaluable} The result of algebraic division.
	 */
	public abstract div(that: Scalar): Scalar;
}

export namespace Scalar {
	/**
	 * Represents a constant scalar quantity with a fixed value.
	 * @class
	 * @extends Scalar
	 */
	export class Constant extends Scalar implements _Constant {
		readonly type = "constant";
		/**
		 * Creates a constant scalar value.
		 * @param value {number} The fixed value of this `Constant`.
		 */
		constructor(readonly value: number) {
			super();
		}

		public add(that: Scalar.Constant): Scalar.Constant;
		public add(that: Scalar.Variable | Scalar.Expression): Scalar.Expression;
		public add(that: Scalar) {
			if(that instanceof Scalar.Constant)
				return new Scalar.Constant(this.value + that.value);
			return new Scalar.Expression(BinaryOperator.ADD, this, that);
		}

		public sub(that: Scalar.Constant): Scalar.Constant;
		public sub(that: Scalar.Variable | Scalar.Expression): Scalar.Expression;
		public sub(that: Scalar) {
			if(that instanceof Scalar.Constant)
				return new Scalar.Constant(this.value - that.value);
			return new Scalar.Expression(BinaryOperator.SUB, this, that);
		}

		public mul(that: Scalar.Constant): Scalar.Constant;
		public mul(that: Scalar.Variable | Scalar.Expression): Scalar.Expression;
		public mul(that: Scalar) {
			if(that instanceof Scalar.Constant)
				return new Scalar.Constant(this.value * that.value);
			return new Scalar.Expression(BinaryOperator.MUL, this, that);
		}

		public div(that: Scalar.Constant): Scalar.Constant;
		public div(that: Scalar.Variable | Scalar.Expression): Scalar.Expression;
		public div(that: Scalar) {
			if(that instanceof Scalar.Constant) {
				if(that.value === 0)
					throw "Division by zero error";
				return new Scalar.Constant(this.value / that.value);
			}
			return new Scalar.Expression(BinaryOperator.DIV, this, that);
		}
	}

	/**
	 * Represents a variable scalar quantity with no fixed value.
	 * @class
	 * @extends Scalar
	 */
	export class Variable extends Scalar implements _Variable {
		public add(that: Scalar) {
			return new Scalar.Expression(BinaryOperator.ADD, this, that);
		}
		public sub(that: Scalar) {
			return new Scalar.Expression(BinaryOperator.SUB, this, that);
		}
		public mul(that: Scalar) {
			return new Scalar.Expression(BinaryOperator.MUL, this, that);
		}
		public div(that: Scalar) {
			return new Scalar.Expression(BinaryOperator.DIV, this, that);
		}
		readonly type = "variable";
		/**
		 * Creates a variable scalar object.
		 */
		constructor() {
			super();
		}
	}

	export class Expression extends Scalar implements _Expression {
		readonly type = "expression";
		readonly arg_list: Set<_Variable>;
		readonly operands: Evaluable[];

		constructor(op: BinaryOperator, lhs: Evaluable, rhs: Evaluable);
		constructor(op: UnaryOperator, arg: Evaluable);
		constructor(readonly op: Operator, a: Evaluable, b?: Evaluable) {
			super();
			this.arg_list = ExpressionBuilder.createArgList(a, b);
			this.operands = [];
			this.operands.push(a);
			if(b !== undefined)
				this.operands.push(b);
		}

		public get lhs() {
			if(this.operands.length === 2)
				return this.operands[0];
			throw "Unary operators have no left hand argument.";
		}

		public get rhs() {
			if(this.operands.length === 2)
				return this.operands[1];
			throw "Unary operators have no left hand argument.";
		}

		public get arg() {
			if(this.operands.length === 1)
				return this.operands[0];
			throw "Binary operators have two arguments.";
		}

		public add(that: Scalar) {
			return new Scalar.Expression(BinaryOperator.ADD, this, that);
		}
		public sub(that: Scalar) {
			return new Scalar.Expression(BinaryOperator.ADD, this, that);
		}
		public mul(that: Scalar) {
			return new Scalar.Expression(BinaryOperator.MUL, this, that);
		}
		public div(that: Scalar) {
			return new Scalar.Expression(BinaryOperator.DIV, this, that);
		}
		isFunctionOf(v: _Variable): boolean {
			return this.arg_list.has(v);
		}

		at(values: Map<_Variable, _Constant>) {
			const res = ExpressionBuilder.evaluateAt(this, values);
			if(isConstant(res))
				return <Scalar.Constant>res;
			if(isVariable(res))
				return <Scalar.Variable>res;
			return <Scalar.Expression>res;
		}
	}
}
