import { Scalar } from "../../scalar";
import { Evaluable } from "../definitions";
import { UnaryOperator } from "../operators/unary";

/**
 * @ignore
 */
export class math {
	[x: string]: any;

	public static neg(x: number): number;
	public static neg(x: Scalar.Constant): Scalar.Constant;
	public static neg(x: Scalar): Scalar.Expression;
	public static neg(x: number | Evaluable) {
		if(typeof x === "number")
			return -x;
		if(x instanceof Scalar.Constant)
			return Scalar.constant(-x.value);
		if(x instanceof Scalar.Variable || x instanceof Scalar.Expression)
			return new Scalar.Expression(UnaryOperator.NEG, x);
	}

	public static sin(x: number): number;
	public static sin(x: Scalar.Constant): Scalar.Constant;
	public static sin(x: Scalar): Scalar.Expression;
	public static sin(x: number | Evaluable) {
		if(typeof x === "number")
			return Math.sin(x);
		if(x instanceof Scalar.Constant)
			return Scalar.constant(Math.sin(x.value));
		if(x instanceof Scalar.Variable || x instanceof Scalar.Expression)
			return new Scalar.Expression(UnaryOperator.SIN, x);
	}

	public static cos(x: number): number;
	public static cos(x: Scalar.Constant): Scalar.Constant;
	public static cos(x: Scalar): Scalar.Expression;
	public static cos(x: number | Evaluable) {
		if(typeof x === "number")
			return Math.cos(x);
		if(x instanceof Scalar.Constant)
			return Scalar.constant(Math.cos(x.value));
		if(x instanceof Scalar.Variable || x instanceof Scalar.Expression)
			return new Scalar.Expression(UnaryOperator.COS, x);
	}

	public static tan(x: number): number;
	public static tan(x: Scalar.Constant): Scalar.Constant;
	public static tan(x: Scalar): Scalar.Expression;
	public static tan(x: number | Evaluable) {
		if(typeof x === "number")
			return Math.tan(x);
		if(x instanceof Scalar.Constant)
			return Scalar.constant(Math.tan(x.value));
		if(x instanceof Scalar.Variable || x instanceof Scalar.Expression)
			return new Scalar.Expression(UnaryOperator.TAN, x);
	}

	public static asin(x: number): number;
	public static asin(x: Scalar.Constant): Scalar.Constant;
	public static asin(x: Scalar): Scalar.Expression;
	public static asin(x: number | Evaluable) {
		if(typeof x === "number")
			return Math.asin(x);
		if(x instanceof Scalar.Constant)
			return Scalar.constant(Math.asin(x.value));
		if(x instanceof Scalar.Variable || x instanceof Scalar.Expression)
			return new Scalar.Expression(UnaryOperator.ASIN, x);
	}

	public static acos(x: number): number;
	public static acos(x: Scalar.Constant): Scalar.Constant;
	public static acos(x: Scalar): Scalar.Expression;
	public static acos(x: number | Evaluable) {
		if(typeof x === "number")
			return Math.asin(x);
		if(x instanceof Scalar.Constant)
			return Scalar.constant(Math.acos(x.value));
		if(x instanceof Scalar.Variable || x instanceof Scalar.Expression)
			return new Scalar.Expression(UnaryOperator.ACOS, x);
	}

	public static atan(x: number): number;
	public static atan(x: Scalar.Constant): Scalar.Constant;
	public static atan(x: Scalar): Scalar.Expression;
	public static atan(x: number | Evaluable) {
		if(typeof x === "number")
			return Math.atan(x);
		if(x instanceof Scalar.Constant)
			return Scalar.constant(Math.atan(x.value));
		if(x instanceof Scalar.Variable || x instanceof Scalar.Expression)
			return new Scalar.Expression(UnaryOperator.ATAN, x);
	}

	public static sinh(x: number): number;
	public static sinh(x: Scalar.Constant): Scalar.Constant;
	public static sinh(x: Scalar): Scalar.Expression;
	public static sinh(x: number | Evaluable) {
		if(typeof x === "number")
			return Math.sinh(x);
		if(x instanceof Scalar.Constant)
			return Scalar.constant(Math.sinh(x.value));
		if(x instanceof Scalar.Variable || x instanceof Scalar.Expression)
			return new Scalar.Expression(UnaryOperator.SINH, x);
	}

	public static cosh(x: number): number;
	public static cosh(x: Scalar.Constant): Scalar.Constant;
	public static cosh(x: Scalar): Scalar.Expression;
	public static cosh(x: number | Evaluable) {
		if(typeof x === "number")
			return Math.cosh(x);
		if(x instanceof Scalar.Constant)
			return Scalar.constant(Math.cosh(x.value));
		if(x instanceof Scalar.Variable || x instanceof Scalar.Expression)
			return new Scalar.Expression(UnaryOperator.COSH, x);
	}

	public static tanh(x: number): number;
	public static tanh(x: Scalar.Constant): Scalar.Constant;
	public static tanh(x: Scalar): Scalar.Expression;
	public static tanh(x: number | Evaluable) {
		if(typeof x === "number")
			return Math.tanh(x);
		if(x instanceof Scalar.Constant)
			return Scalar.constant(Math.tanh(x.value));
		if(x instanceof Scalar.Variable || x instanceof Scalar.Expression)
			return new Scalar.Expression(UnaryOperator.TANH, x);
	}

	public static asinh(x: number): number;
	public static asinh(x: Scalar.Constant): Scalar.Constant;
	public static asinh(x: Scalar): Scalar.Expression;
	public static asinh(x: number | Evaluable) {
		if(typeof x === "number")
			return Math.asinh(x);
		if(x instanceof Scalar.Constant)
			return Scalar.constant(Math.asinh(x.value));
		if(x instanceof Scalar.Variable || x instanceof Scalar.Expression)
			return new Scalar.Expression(UnaryOperator.ASINH, x);
	}

	public static acosh(x: number): number;
	public static acosh(x: Scalar.Constant): Scalar.Constant;
	public static acosh(x: Scalar): Scalar.Expression;
	public static acosh(x: number | Evaluable) {
		if(typeof x === "number")
			return Math.asinh(x);
		if(x instanceof Scalar.Constant)
			return Scalar.constant(Math.acosh(x.value));
		if(x instanceof Scalar.Variable || x instanceof Scalar.Expression)
			return new Scalar.Expression(UnaryOperator.ACOSH, x);
	}

	public static atanh(x: number): number;
	public static atanh(x: Scalar.Constant): Scalar.Constant;
	public static atanh(x: Scalar): Scalar.Expression;
	public static atanh(x: number | Evaluable) {
		if(typeof x === "number")
			return Math.atanh(x);
		if(x instanceof Scalar.Constant)
			return Scalar.constant(Math.atanh(x.value));
		if(x instanceof Scalar.Variable || x instanceof Scalar.Expression)
			return new Scalar.Expression(UnaryOperator.ATANH, x);
	}

	public static log(x: number): number;
	public static log(x: Scalar.Constant): Scalar.Constant;
	public static log(x: Scalar): Scalar.Expression;
	public static log(x: number | Evaluable) {
		if(typeof x === "number")
			return Math.log10(x);
		if(x instanceof Scalar.Constant)
			return Scalar.constant(Math.log10(x.value));
		if(x instanceof Scalar.Variable || x instanceof Scalar.Expression)
			return new Scalar.Expression(UnaryOperator.LOG, x);
	}

	public static ln(x: number): number;
	public static ln(x: Scalar.Constant): Scalar.Constant;
	public static ln(x: Scalar): Scalar.Expression;
	public static ln(x: number | Evaluable) {
		if(typeof x === "number")
			return Math.log(x);
		if(x instanceof Scalar.Constant)
			return Scalar.constant(Math.log(x.value));
		if(x instanceof Scalar.Variable || x instanceof Scalar.Expression)
			return new Scalar.Expression(UnaryOperator.LN, x);
	}

	public static exp(x: number): number;
	public static exp(x: Scalar.Constant): Scalar.Constant;
	public static exp(x: Scalar): Scalar.Expression;
	public static exp(x: number | Evaluable) {
		if(typeof x === "number")
			return Math.exp(x);
		if(x instanceof Scalar.Constant)
			return Scalar.constant(Math.exp(x.value));
		if(x instanceof Scalar.Variable || x instanceof Scalar.Expression)
			return new Scalar.Expression(UnaryOperator.EXP, x);
	}

	public static sqrt(x: number): number;
	public static sqrt(x: Scalar.Constant): Scalar.Constant;
	public static sqrt(x: Scalar): Scalar.Expression;
	public static sqrt(x: number | Evaluable) {
		if(typeof x === "number")
			return Math.sqrt(x);
		if(x instanceof Scalar.Constant)
			return Scalar.constant(Math.sqrt(x.value));
		if(x instanceof Scalar.Variable || x instanceof Scalar.Expression)
			return new Scalar.Expression(UnaryOperator.SQRT, x);
	}

	public static abs(x: number): number;
	public static abs(x: Scalar.Constant): Scalar.Constant;
	public static abs(x: Scalar): Scalar.Expression;
	public static abs(x: number | Evaluable) {
		if(typeof x === "number")
			return Math.abs(x);
		if(x instanceof Scalar.Constant)
			return Scalar.constant(Math.abs(x.value));
		if(x instanceof Scalar.Variable || x instanceof Scalar.Expression)
			return new Scalar.Expression(UnaryOperator.ABS, x);
	}

	public static floor(x: number): number;
	public static floor(x: Scalar.Constant): Scalar.Constant;
	public static floor(x: Scalar): Scalar.Expression;
	public static floor(x: number | Evaluable) {
		if(typeof x === "number")
			return Math.floor(x);
		if(x instanceof Scalar.Constant)
			return Scalar.constant(Math.floor(x.value));
		if(x instanceof Scalar.Variable || x instanceof Scalar.Expression)
			return new Scalar.Expression(UnaryOperator.FLOOR, x);
	}

	public static ceil(x: number): number;
	public static ceil(x: Scalar.Constant): Scalar.Constant;
	public static ceil(x: Scalar): Scalar.Expression;
	public static ceil(x: number | Evaluable) {
		if(typeof x === "number")
			return Math.ceil(x);
		if(x instanceof Scalar.Constant)
			return Scalar.constant(Math.ceil(x.value));
		if(x instanceof Scalar.Variable || x instanceof Scalar.Expression)
			return new Scalar.Expression(UnaryOperator.CEIL, x);
	}
}
