import { Token, Evaluable, Constant, Variable } from "./definitions";
import { Expression } from "./expression";
import { ADD, SUB, MUL, DIV } from "./operators";

/**
 * Base class to works with scalar quantities.
 */
export abstract class Scalar implements Token, Evaluable {
	readonly abstract type: "variable" | "constant";

	/**
	 * Adds two `Scalar`s together. If `this` and `that` are both constants
	 * then numerically adds the two and returns a new `Scalar.Constant` object
	 * otherwise creates an `Expression` out of them and returns the same.
	 * @param that {Scalar} The scalar to add `this` with.
	 * @returns {Evaluable} The result of algebraic addition.
	 */
	public add(that: Scalar): Evaluable {
		if(this instanceof Scalar.Constant && that instanceof Scalar.Constant)
			return new Scalar.Constant(this.value + that.value);
		return new Expression(ADD, this, that);
	}

	/**
	 * Subtracts `that` from `this`. If `this` and `that` are both constants
	 * then numerically subtracts one from the other and returns a new
	 * `Scalar.Constant` object otherwise creates an `Expression` out of them
	 * and returns the same.
	 * @param that {Scalar} The scalar to subtract from `this`.
	 * @returns {Evaluable} The result of algebraic subtraction.
	 */
	public sub(that: Scalar): Evaluable {
		if(this instanceof Scalar.Constant && that instanceof Scalar.Constant)
			return new Scalar.Constant(this.value - that.value);
		return new Expression(SUB, this, that);
	}

	/**
	 * Multiplies two `Scalar`s together. If `this` and `that` are both constants
	 * then numerically multiplies the two and returns a new `Scalar.Constant` object
	 * otherwise creates an `Expression` out of them and returns the same.
	 * @param that {Scalar} The scalar to multiply `this` with.
	 * @returns {Evaluable} The result of algebraic multiplication.
	 */
	public mul(that: Scalar): Evaluable {
		if(this instanceof Scalar.Constant && that instanceof Scalar.Constant)
			return new Scalar.Constant(this.value * that.value);
		return new Expression(MUL, this, that);
	}

	/**
	 * Divides `this` scalar by `that`. If `this` and `that` are both constants
	 * then numerically divides the two and returns a new `Scalar.Constant` object
	 * otherwise creates an `Expression` out of them and returns the same.
	 * @param that {Scalar} The scalar to divide `this` by.
	 * @returns {Evaluable} The result of algebraic division.
	 */
	public div(that: Scalar): Evaluable {
		if(this instanceof Scalar.Constant && that instanceof Scalar.Constant) {
			if(that.value === 0)
				throw "Division by zero error.";
			return new Scalar.Constant(this.value / that.value);
		}
		return new Expression(DIV, this, that);
	}

	/**
	 * Represents a constant scalar quantity with a fixed value.
	 * @class
	 * @extends Scalar
	 */
	public static Constant = class extends Scalar implements Constant {
		readonly type = "constant";
		/**
		 * Creates a constant scalar value.
		 * @param value {number} The fixed value of this `Constant`.
		 */
		constructor(readonly value: number) {
			super();
		}
	}

	/**
	 * Represents a variable scalar quantity with no fixed value.
	 * @class
	 * @extends Scalar
	 */
	public static Variable = class extends Scalar implements Variable {
		readonly type = "variable";
		/**
		 * Creates a variable scalar object.
		 */
		constructor() {
			super();
		}
	}
}