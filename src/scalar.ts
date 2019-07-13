import { Token, Evaluable, Constant as _Constant, Variable as _Variable, Expression as _Expression, isConstant, isVariable, Operator } from "./core/definitions";
import { BinaryOperator } from "./core/operators/binary";
import { ExpressionBuilder } from "./core/expression";
import { UnaryOperator } from "./core/operators/unary";
import { Vector } from "./vector";

/**
 * Base class to works with scalar quantities.
 * @abstract
 */
export abstract class Scalar implements Token, Evaluable {
	readonly abstract type: "constant" | "variable" | "expression";
	readonly quantity = "scalar";

	/**
	 * Adds two [[Scalar]]s together. If `this` and `that` are both constants
	 * then numerically adds the two and returns a new [[Scalar.Constant]] object
	 * otherwise creates an [[Expression]] out of them and returns the same.
	 * @param that The scalar to add `this` with.
	 * @return The result of algebraic addition.
	 */
	public abstract add(that: Scalar): Scalar;

	/**
	 * Subtracts `that` from `this`. If `this` and `that` are both constants
	 * then numerically subtracts one from the other and returns a new
	 * [[Scalar.Constant]] object otherwise creates an [[Expression]] out of them
	 * and returns the same.
	 * @param that The scalar to subtract from `this`.
	 * @return The result of algebraic subtraction.
	 */
	public abstract sub(that: Scalar): Scalar;

	/**
	 * Multiplies two [[Scalar]]s together. If `this` and `that` are both constants
	 * then numerically multiplies the two and returns a new [[Scalar.Constant]] object
	 * otherwise creates an [[Expression]] out of them and returns the same.
	 * @param that The scalar to multiply `this` with.
	 * @return The result of algebraic multiplication.
	 */
	public abstract mul(that: Scalar): Scalar;

	/**
	 * Divides `this` scalar by `that`. If `this` and `that` are both constants
	 * then numerically divides the two and returns a new [[Scalar.Constant]] object
	 * otherwise creates an [[Expression]] out of them and returns the same.
	 * @param that The scalar to divide `this` by.
	 * @return The result of algebraic division.
	 */
	public abstract div(that: Scalar): Scalar;

	/**
	 * Raises `this` scalar to the power of `that`. If `this` and `that` are both constants
	 * then numerically evaluates the exponentiation and returns a new [[Scalar.Constant]] object
	 * otherwise creates an [[Expression]] out of them and returns the same.
	 * @param that The scalar to divide `this` by.
	 * @return The result of algebraic division.
	 */
	public abstract pow(that: Scalar): Scalar;
}

/**
 * @namespace
 */
export namespace Scalar {
	/**
	 * A mapping from name of scalar variables to [[Scalar.Variable]] objects.
	 * @ignore
	 */
	const VARIABLES = new Map<string, Scalar.Variable>();
	/**
	 * A mapping from numerical constants to [[Scalar.Constant]] objects.
	 * @ignore
	 */
	const CONSTANTS = new Map<number, Scalar.Constant>();
	/**
	 * A mapping from named scalar constants to [[Scalar.Constant]] objects.
	 * @ignore
	 */
	const NAMED_CONSTANTS = new Map<string, Scalar.Constant>();

	/**
	 * Represents a constant scalar quantity with a fixed value.
	 * @extends [[Scalar]]
	 */
	export class Constant extends Scalar implements _Constant {
		readonly type = "constant";
		/**
		 * Creates a [[Scalar.Constant]] object from number.
		 * One may optionally pass in a string by which `this` object
		 * may be identified by.
		 * 
		 * Using the contructor directly for creating vector objects is
		 * not recommended.
		 * 
		 * @see [[Scalar.constant]]
		 * @param value The fixed value `this` should represent.
		 * @param name The name by which `this` is identified.
		 */
		constructor(readonly value: number, readonly name: string = "") {
			super();
		}

		/**
		 * Checks for equality of two scalar constants. The equality check
		 * for floating point numbers becomes problematic in the decimal system.
		 * The binary representation is finite and therefore even if two values
		 * are in fact equal they may not return true by using the `==` or `===`
		 * equality. To tackle this problem we use a tolerance value, if the
		 * difference of the two numerical values is less than that tolerance
		 * value then we can assume the values to be practically equal. Smaller
		 * tolerance values will result in more accurate checks.
		 * This function allows a default tolerance of `1e-14` for floating point numbers.
		 * @param that The value to check equality with.
		 */
		public equals(that: Scalar.Constant): boolean;
		/**
		 * Checks for equality of two scalar constants. The equality check
		 * for floating point numbers becomes problematic in the decimal system.
		 * The binary representation is finite and therefore even if two values
		 * are in fact equal they may not return true by using the `==` or `===`
		 * equality. To tackle this problem we use a tolerance value, if the
		 * difference of the two numerical values is less than that tolerance
		 * value then we can assume the values to be practically equal. Smaller
		 * tolerance values will result in more accurate checks.
		 * @param that The value to check equality with.
		 * @param tolerance The tolerance permitted for floating point numbers.
		 */
		public equals(that: Scalar.Constant, tolerance: number): boolean;
		public equals(that: Scalar.Constant, tolerance?: number) {
			return Math.abs(this.value - that.value) < (tolerance || 1e-14);
		}

		/**
		 * Adds two [[Scalar.Constant]] objects numerically.
		 * @param that The [[Scalar.Constant]] to add to `this`.
		 * @return The algebraic sum of `this` and `that`.
		 */
		public add(that: Scalar.Constant): Scalar.Constant;
		/**
		 * Creates and returns a [[Scalar.Expression]] for the addition of
		 * two [[Scalar]] objects. The [[type]] of `this` does not matter because
		 * adding a variable scalar to another scalar always results in an expresion.
		 * @param that The [[Vector]] to add to `this`.
		 * @return Expression for sum of `this` and `that`.
		 */
		public add(that: Scalar.Variable | Scalar.Expression): Scalar.Expression;
		public add(that: Scalar) {
			if(that instanceof Scalar.Constant)
				return Scalar.constant(this.value + that.value);
			return new Scalar.Expression(BinaryOperator.ADD, this, that);
		}

		/**
		 * Subtracts one [[Scalar.Constant]] object from another numerically.
		 * @param that The [[Scalar.Constant]] to subtract from `this`.
		 * @return The algebraic difference of `this` from `that`.
		 */
		public sub(that: Scalar.Constant): Scalar.Constant;
		/**
		 * Creates and returns a [[Scalar.Expression]] for the subtraction of
		 * two [[Scalar]] objects. The [[type]] of `this` does not matter because
		 * subtracting a variable scalar from another scalar always results in an expresion.
		 * @param that The [[Scalar]] to add to `this`.
		 * @return Expression for subtracting `that` from `this`.
		 */
		public sub(that: Scalar.Variable | Scalar.Expression): Scalar.Expression;
		public sub(that: Scalar) {
			if(that instanceof Scalar.Constant)
				return Scalar.constant(this.value - that.value);
			return new Scalar.Expression(BinaryOperator.SUB, this, that);
		}

		/**
		 * Multiplies two [[Scalar.Constant]] objects numerically.
		 * @param that The [[Scalar.Constant]] to subtract from `this`.
		 * @return The vector difference of `this` from `that`.
		 */
		public mul(that: Scalar.Constant): Scalar.Constant;
		/**
		 * Creates and returns a [[Scalar.Expression]] for the multiplication of
		 * two [[Scalar]] objects. The [[type]] of `this` does not matter because
		 * multiplying a variable scalar by another scalar always results in an expresion.
		 * @param that The [[Scalar]] to add to `this`.
		 * @return Expression for subtracting `that` from `this`.
		 */
		public mul(that: Scalar.Variable | Scalar.Expression): Scalar.Expression;
		/**
		 * Scales a [[Vector.Constant]] object numerically.
		 * @see [[Vector.scale]]
		 * @param that The [[Vector.Constant]] to scale by the amount of `this`.
		 * @return The scaled vector.
		 */
		public mul(that: Vector.Constant): Vector.Constant;
		/**
		 * Creates and returns a [[Vector.Expression]] for the scaling of
		 * a [[Vector]] object. The [[type]] of `this` does not matter because
		 * scaling a variable vector by a scalar always results in an expresion.
		 * @param that The [[Vector]] to scale by the amount of `this`.
		 * @return Expression for scaling `that` by `this`.
		 */
		public mul(that: Vector.Variable | Vector.Expression): Vector.Expression;
		public mul(that: Scalar | Vector) {
			if(that instanceof Scalar) {
				if(that instanceof Scalar.Constant)
					return Scalar.constant(this.value * that.value);
				return new Scalar.Expression(BinaryOperator.MUL, this, that);
			}
			if(that instanceof Vector.Constant)
				return new Vector.Constant(that.value.map(x => this.value * x.value));
			return new Vector.Expression(BinaryOperator.MUL, this, that);
		}

		/**
		 * Divides one [[Scalar.Constant]] object by another numerically.
		 * @param that The [[Scalar.Constant]] to divide `this` by.
		 * @return The scalar quotient of dividing `this` by `that`.
		 */
		public div(that: Scalar.Constant): Scalar.Constant;
		/**
		 * Creates and returns a [[Scalar.Expression]] for the division of
		 * two [[Scalar]] objects. The [[type]] of `this` does not matter because
		 * dividing a variable scalar by another scalar always results in an expresion.
		 * @param that The [[Scalar]] to divide `this` by `this`.
		 * @return Expression for dividing `this` by `that`.
		 */
		public div(that: Scalar.Variable | Scalar.Expression): Scalar.Expression;
		public div(that: Scalar) {
			if(that instanceof Scalar.Constant) {
				if(that.value === 0)
					throw "Division by zero error";
				return Scalar.constant(this.value / that.value);
			}
			return new Scalar.Expression(BinaryOperator.DIV, this, that);
		}

		/**
		 * Raises a [[Scalar.Constant]] object to the power of another numerically.
		 * @param that The [[Scalar.Constant]] power to raise `this` to.
		 * @return The scalar exponentiation of `this` by `that`.
		 */
		public pow(that: Scalar.Constant): Scalar.Constant;
		/**
		 * Creates and returns a [[Scalar.Expression]] for exponentiation of
		 * two [[Scalar]] objects. The [[type]] of `this` does not matter because
		 * exponentiating a scalar by a variable scalar always results in an expresion.
		 * @param that The [[Scalar]] power to raise `this` to.
		 * @return Expression for exponentiating `this` by `that`.
		 */
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
	 * @extends [[Scalar]]
	 */
	export class Variable extends Scalar implements _Variable {
		readonly type = "variable";
		/**
		 * Creates a [[Scalar.Variable]] object.
		 * 
		 * Using the contructor directly for creating vector objects is
		 * not recommended.
		 * 
		 * @see [[Scalar.variable]]
		 * @param name The name with which the [[Scalar.Variable]] is going to be identified.
		 */
		constructor(readonly name: string) {
			super();
		}

		/**
		 * Creates and returns a [[Scalar.Expression]] for the addition of
		 * two [[Scalar]] objects. The [[type]] of `this` does not matter because
		 * adding a variable scalar to another scalar always results in an expresion.
		 * @param that The [[Vector]] to add to `this`.
		 * @return Expression for sum of `this` and `that`.
		 */
		public add(that: Scalar) {
			return new Scalar.Expression(BinaryOperator.ADD, this, that);
		}

		/**
		 * Creates and returns a [[Scalar.Expression]] for the subtraction of
		 * two [[Scalar]] objects. The [[type]] of `this` does not matter because
		 * subtracting a variable scalar from another scalar always results in an expresion.
		 * @param that The [[Scalar]] to add to `this`.
		 * @return Expression for subtracting `that` from `this`.
		 */
		public sub(that: Scalar) {
			return new Scalar.Expression(BinaryOperator.SUB, this, that);
		}

		/**
		 * Creates and returns a [[Scalar.Expression]] for the multiplication of
		 * two [[Scalar]] objects. The [[type]] of `this` does not matter because
		 * multiplying a variable scalar by another scalar always results in an expresion.
		 * @param that The [[Scalar]] to add to `this`.
		 * @return Expression for subtracting `that` from `this`.
		 */
		public mul(that: Scalar): Scalar.Expression;
		/**
		 * Creates and returns a [[Vector.Expression]] for the scaling of
		 * a [[Vector]] object. The [[type]] of `this` does not matter because
		 * scaling a variable vector by a scalar always results in an expresion.
		 * @param that The [[Vector]] to scale by the amount of `this`.
		 * @return Expression for scaling `that` by `this`.
		 */
		public mul(that: Vector): Vector.Expression;
		public mul(that: Scalar | Vector) {
			if(that instanceof Scalar)
				return new Scalar.Expression(BinaryOperator.MUL, this, that);
			return new Vector.Expression(BinaryOperator.MUL, this, that);
		}

		/**
		 * Creates and returns a [[Scalar.Expression]] for the division of
		 * two [[Scalar]] objects. The [[type]] of `this` does not matter because
		 * dividing a variable scalar by another scalar always results in an expresion.
		 * @param that The [[Scalar]] to divide `this` by `this`.
		 * @return Expression for dividing `this` by `that`.
		 */
		public div(that: Scalar) {
			return new Scalar.Expression(BinaryOperator.DIV, this, that);
		}

		/**
		 * Creates and returns a [[Scalar.Expression]] for exponentiation of
		 * two [[Scalar]] objects. The [[type]] of `this` does not matter because
		 * exponentiating a scalar by a variable scalar always results in an expresion.
		 * @param that The [[Scalar]] power to raise `this` to.
		 * @return Expression for exponentiating `this` by `that`.
		 */
		public pow(that: Scalar) {
			return new Scalar.Expression(BinaryOperator.POW, this, that);
		}
	}

	/**
	 * @extends [[Scalar]]
	 */
	export class Expression extends Scalar implements _Expression {
		readonly type = "expression";
		/** `Set` of [[Variable]] quantities `this` depends on. */
		readonly arg_list: Set<_Variable>;
		/** Array of `Evaluable` quantity/quantities `this.op` operates on. */
		readonly operands: Evaluable[] = [];

		/**
		 * Creates a scalar expression object using a root binary operation.
		 * @param op {BinaryOperator}
		 * @param lhs The left hand side operand of the operator.
		 * @param rhs The right hand side operand of the operator.
		 */
		constructor(op: BinaryOperator, lhs: Evaluable, rhs: Evaluable);
		/**
		 * Creates a scalar expression object using a root unary operation.
		 * @param op {UnaryOperator}
		 * @param arg The argument of the operator.
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

		/**
		 * Creates and returns a [[Scalar.Expression]] for the addition of
		 * two [[Scalar]] objects. The [[type]] of `this` does not matter because
		 * adding a unknown scalar/scalar expression to another scalar always results in an expresion.
		 * @param that The [[Vector]] to add to `this`.
		 * @return Expression for sum of `this` and `that`.
		 */
		public add(that: Scalar) {
			return new Scalar.Expression(BinaryOperator.ADD, this, that);
		}

		/**
		 * Creates and returns a [[Scalar.Expression]] for the subtraction of
		 * two [[Scalar]] objects. The [[type]] of `this` does not matter because
		 * subtracting a unknown scalar/scalar expression from another scalar always results in an expresion.
		 * @param that The [[Scalar]] to add to `this`.
		 * @return Expression for subtracting `that` from `this`.
		 */
		public sub(that: Scalar) {
			return new Scalar.Expression(BinaryOperator.SUB, this, that);
		}

		/**
		 * Creates and returns a [[Scalar.Expression]] for the multiplication of
		 * two [[Scalar]] objects. The [[type]] of `this` does not matter because
		 * multiplying a unknown scalar/scalar expression by another scalar always results in an expresion.
		 * @param that The [[Scalar]] to add to `this`.
		 * @return Expression for subtracting `that` from `this`.
		 */
		public mul(that: Scalar): Scalar.Expression;
		/**
		 * Creates and returns a [[Vector.Expression]] for the scaling of
		 * a [[Vector]] object. The [[type]] of `this` does not matter because
		 * scaling a unknown vector/scalar expression by a scalar always results in an expresion.
		 * @param that The [[Vector]] to scale by the amount of `this`.
		 * @return Expression for scaling `that` by `this`.
		 */
		public mul(that: Vector): Vector.Expression;
		public mul(that: Scalar | Vector) {
			if(that instanceof Scalar)
				return new Scalar.Expression(BinaryOperator.MUL, this, that);
			return new Vector.Expression(BinaryOperator.MUL, this, that);
		}

		/**
		 * Creates and returns a [[Scalar.Expression]] for the division of
		 * two [[Scalar]] objects. The [[type]] of `this` does not matter because
		 * dividing a unknown scalar/scalar expression by another scalar always results in an expresion.
		 * @param that The [[Scalar]] to divide `this` by `this`.
		 * @return Expression for dividing `this` by `that`.
		 */
		public div(that: Scalar) {
			return new Scalar.Expression(BinaryOperator.DIV, this, that);
		}

		/**
		 * Creates and returns a [[Scalar.Expression]] for exponentiation of
		 * two [[Scalar]] objects. The [[type]] of `this` does not matter because
		 * exponentiating a scalar by a unknown scalar/scalar expression always results in an expresion.
		 * @param that The [[Scalar]] power to raise `this` to.
		 * @return Expression for exponentiating `this` by `that`.
		 */
		public pow(that: Scalar) {
			return new Scalar.Expression(BinaryOperator.POW, this, that);
		}

		/**
		 * Checks whether `this` [[Scalar.Expression]] depends on a given
		 * [[Variable]].
		 * @param v The [[Variable]] to check against.
		 */
		public isFunctionOf(v: _Variable): boolean {
			return this.arg_list.has(v);
		}

		/**
		 * Evaluates this [[Scalar.Expression]] at the given values for the
		 * [[Variable]] objects `this` depends on. In case `this` is not a
		 * function of any of the variables in the mapping then `this` is returned
		 * as is. 
		 * @param values A map from the [[Variable]] quantities to [[Constant]] quantities.
		 * @return The result after evaluating `this` at the given values.
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
	 * Creates a new [[Scalar.Constant]] object from a number
	 * if it has not been created before.
	 * Otherwise just returns the previously created object.
	 * 
	 * This is the recommended way of creating [[Scalar.Constant]] objects instead of
	 * using the constructor.
	 * @param value The fixed value the [[Scalar.Constant]] is supposed to represent.
	 */
	export function constant(value: number): Scalar.Constant;
	/**
	 * Defines a named [[Scalar.Constant]] object from a number
	 * if it has not been created before.
	 * Otherwise just returns the previously created object.
	 * 
	 * This is the recommended way of creating named [[Scalar.Constant]] objects instead of
	 * using the constructor.
	 * @param value The fixed value the [[Scalar.Constant]] is supposed to represent.
	 * @param name The string with which `this` object is identified.
	 * @throws Throws an error if a [[Scalar.Constant]] with the same name has been defined previously.
	 */
	export function constant(value: number, name: string): Scalar.Constant;
	/**
	 * Returns a previously declared named [[Scalar.Constant]] object.
	 * @param name The name of the named [[Scalar.Constant]] object to be retrieved.
	 */
	export function constant(name: string): Scalar.Constant;
	export function constant(a: number | string, b?: string) {
		let c;
		if(typeof a === "number") {
			if(b === undefined) {
				c = CONSTANTS.get(a);
				if(c === undefined) {
					c = new Scalar.Constant(a);
					CONSTANTS.set(a, c);
				}
			} else {
				c = NAMED_CONSTANTS.get(b);
				if(c !== undefined)
					throw "Attempt to redefine a constant: A constant with the same name already exists.";
				c = new Scalar.Constant(a, b);
				NAMED_CONSTANTS.set(b, c);
			}
		} else {
			c = NAMED_CONSTANTS.get(a);
			if(c === undefined)
				throw "No such constant defined.";
		}
		return c;
	}

	/**
	 * Creates a new [[Scalar.Variable]] object if it has not been created before.
	 * Otherwise just returns the previously created object.
	 * @param value 
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