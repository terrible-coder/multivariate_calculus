import { Token, Evaluable, Constant as _Constant, Variable as _Variable, Expression as _Expression, isConstant, isVariable, Operator } from "./core/definitions";
import { BinaryOperator } from "./core/operators/binary";
import { ExpressionBuilder } from "./core/expression";
import { UnaryOperator } from "./core/operators/unary";

/**
 * Base class to works with scalar quantities.
 */
export abstract class Scalar implements Token, Evaluable {
	readonly abstract type: "constant" | "variable" | "expression";
	readonly quantity = "scalar";

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

	/**
	 * Raises `this` scalar to the power of `that`. If `this` and `that` are both constants
	 * then numerically evaluates the exponentiation and returns a new `Scalar.Constant` object
	 * otherwise creates an `Expression` out of them and returns the same.
	 * @param that {Scalar} The scalar to divide `this` by.
	 * @returns {Evaluable} The result of algebraic division.
	 */
	public abstract pow(that: Scalar): Scalar;
}

export namespace Scalar {
	const VARIABLES = new Map<string, Scalar.Variable>();
	const CONSTANTS = new Map<number, Scalar.Constant>();
	const NAMED_CONSTANTS = new Map<string, Scalar.Constant>();

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
		constructor(readonly value: number, readonly name: string = "") {
			super();
		}

		public add(that: Scalar.Constant): Scalar.Constant;
		public add(that: Scalar.Variable | Scalar.Expression): Scalar.Expression;
		public add(that: Scalar) {
			if(that instanceof Scalar.Constant)
				return Scalar.constant(this.value + that.value);
			return new Scalar.Expression(BinaryOperator.ADD, this, that);
		}

		public sub(that: Scalar.Constant): Scalar.Constant;
		public sub(that: Scalar.Variable | Scalar.Expression): Scalar.Expression;
		public sub(that: Scalar) {
			if(that instanceof Scalar.Constant)
				return Scalar.constant(this.value - that.value);
			return new Scalar.Expression(BinaryOperator.SUB, this, that);
		}

		public mul(that: Scalar.Constant): Scalar.Constant;
		public mul(that: Scalar.Variable | Scalar.Expression): Scalar.Expression;
		public mul(that: Scalar) {
			if(that instanceof Scalar.Constant)
				return Scalar.constant(this.value * that.value);
			return new Scalar.Expression(BinaryOperator.MUL, this, that);
		}

		public div(that: Scalar.Constant): Scalar.Constant;
		public div(that: Scalar.Variable | Scalar.Expression): Scalar.Expression;
		public div(that: Scalar) {
			if(that instanceof Scalar.Constant) {
				if(that.value === 0)
					throw "Division by zero error";
				return Scalar.constant(this.value / that.value);
			}
			return new Scalar.Expression(BinaryOperator.DIV, this, that);
		}

		public pow(that: Scalar.Constant): Scalar.Constant;
		public pow(that: Scalar.Variable | Scalar.Expression): Scalar.Expression;
		public pow(that: Scalar) {
			if(that instanceof Scalar.Constant) {
				if(this.value === 0 && that.value === 0)
					throw "Cannot determine 0 to the power 0";
				return Scalar.constant(Math.pow(this.value, that.value));
			}
			return new Scalar.Expression(BinaryOperator.POW, this, that);
		}
	}

	/**
	 * Represents a variable scalar quantity with no fixed value.
	 * @class
	 * @extends Scalar
	 */
	export class Variable extends Scalar implements _Variable {
		readonly type = "variable";
		/**
		 * Creates a variable scalar object.
		 */
		constructor(readonly name: string) {
			super();
		}

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

		public pow(that: Scalar) {
			return new Scalar.Expression(BinaryOperator.POW, this, that);
		}
	}

	export class Expression extends Scalar implements _Expression {
		readonly type = "expression";
		/** `Set` of `Variable` quantities `this` depends on. */
		readonly arg_list: Set<_Variable>;
		/** Array of `Evaluable` quantity/quantities `this.op` operates on. */
		readonly operands: Evaluable[] = [];

		/**
		 * Creates a scalar expression object using a root binary operation.
		 * @param op {BinaryOperator}
		 * @param lhs {Evaluable} The left hand side operand of the operator.
		 * @param rhs {Evaluable} The right hand side operand of the operator.
		 */
		constructor(op: BinaryOperator, lhs: Evaluable, rhs: Evaluable);
		/**
		 * Creates a scalar expression object using a root unary operation.
		 * @param op {UnaryOperator}
		 * @param arg {Evaluable} The argument of the operator.
		 */
		constructor(op: UnaryOperator, arg: Evaluable);
		constructor(readonly op: Operator, a: Evaluable, b?: Evaluable) {
			super();
			this.arg_list = ExpressionBuilder.createArgList(a, b);
			this.operands.push(a);
			if(b !== undefined)
				this.operands.push(b);
		}

		/**
		 * The left hand side operand for `this.op`.
		 * @throws If `this.op` is a `UnaryOperator`.
		 */
		public get lhs() {
			if(this.operands.length === 2)
				return this.operands[0];
			throw "Unary operators have no left hand argument.";
		}

		/**
		 * The right hand side operand for `this.op`.
		 * @throws If `this.op` is a `UnaryOperator`.
		 */
		public get rhs() {
			if(this.operands.length === 2)
				return this.operands[1];
			throw "Unary operators have no right hand argument.";
		}

		/**
		 * The argument for `this.op`.
		 * @throws If `this.op` is a `BinaryOperator`.
		 */
		public get arg() {
			if(this.operands.length === 1)
				return this.operands[0];
			throw "Binary operators have two arguments.";
		}

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

		public pow(that: Scalar) {
			return new Scalar.Expression(BinaryOperator.POW, this, that);
		}

		/**
		 * Checks whether `this` scalar expression depends on the given `Variable`;
		 * @param v {Variable}
		 */
		public isFunctionOf(v: _Variable): boolean {
			return this.arg_list.has(v);
		}

		/**
		 * Evaluates `this` scalar expression at the given values of the `Variable` quantities.
		 * @param values {Map<Variable, Constant>} The map from variables to constant values.
		 */
		public at(values: Map<_Variable, _Constant>) {
			const res = ExpressionBuilder.evaluateAt(this, values);
			if(isConstant(res))
				return <Scalar.Constant>res;
			if(isVariable(res))
				return <Scalar.Variable>res;
			return <Scalar.Expression>res;
		}
	}

	/**
	 * Creates a new `Scalar.Constant` object if it has not been created before.
	 * Otherwise just returns the previously created object.
	 * @param value {number}
	 */
	export function constant(value: number): Scalar.Constant;
	/**
	 * Creates a new `Scalar.Constant` object if it has not been created before.
	 * Otherwise just returns the previously created object.
	 * @param value {number}
	 * @param name {string}
	 */
	export function constant(value: number, name: string): Scalar.Constant;
	export function constant(value: number, name?: string) {
		let c;
		if(name === undefined) {
			c = CONSTANTS.get(value);
			if(c === undefined) {
				c = new Scalar.Constant(value);
				CONSTANTS.set(value, c);
			}
		} else {
			c = NAMED_CONSTANTS.get(name);
			if(c === undefined) {
				c = new Scalar.Constant(value, name);
				NAMED_CONSTANTS.set(name, c);
			}
		}
		return c;
	}

	/**
	 * Creates a new `Scalar.Variable` object if it has not been created before.
	 * Otherwise just returns the previously created object.
	 * @param value {number}
	 */
	export function variable(name: string) {
		let v = VARIABLES.get(name);
		if(v === undefined) {
			v = new Scalar.Variable(name);
			VARIABLES.set(name, v);
		}
		return v;
	}
}