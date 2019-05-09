import { Token, Evaluable, Constant, Variable } from "./definitions";
import { Expression } from "./expression";
import { ADD, SUB, MUL, DIV } from "./operators";

export abstract class Scalar implements Token, Evaluable {
	readonly abstract type: "variable" | "constant";

	public add(that: Scalar): Evaluable {
		if(this instanceof Scalar.Constant && that instanceof Scalar.Constant)
			return new Scalar.Constant(this.value + that.value);
		return new Expression(ADD, this, that);
	}

	public sub(that: Scalar): Evaluable {
		if(this instanceof Scalar.Constant && that instanceof Scalar.Constant)
			return new Scalar.Constant(this.value - that.value);
		return new Expression(SUB, this, that);
	}

	public mul(that: Scalar): Evaluable {
		if(this instanceof Scalar.Constant && that instanceof Scalar.Constant)
			return new Scalar.Constant(this.value * that.value);
		return new Expression(MUL, this, that);
	}

	public div(that: Scalar): Evaluable {
		if(this instanceof Scalar.Constant && that instanceof Scalar.Constant) {
			if(that.value === 0)
				throw "Division by zero error.";
			return new Scalar.Constant(this.value / that.value);
		}
		return new Expression(DIV, this, that);
	}

	public static Constant = class extends Scalar implements Constant {
		readonly type = "constant";
		constructor(readonly value: number) {
			super();
		}
	}

	public static Variable = class extends Scalar implements Variable {
		readonly type = "variable";
		constructor() {
			super();
		}
	}
}