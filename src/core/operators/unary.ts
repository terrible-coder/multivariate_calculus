import { Scalar } from "../../scalar";
import { Evaluable } from "../definitions";

export class math {
	[x: string]: any;

	public static sin(x: number): number;
	public static sin(x: Scalar.Constant): Scalar.Constant;
	public static sin(x: Scalar): Scalar.Expression;
	public static sin(x: number | Evaluable) {
		if(typeof x === "number")
			return Math.sin(x);
		if(x instanceof Scalar.Constant)
			return new Scalar.Constant(Math.sin(x.value));
		return new Scalar.Expression(UnaryOperator.SIN, x);
	}

	public static cos(x: number): number;
	public static cos(x: Scalar.Constant): Scalar.Constant;
	public static cos(x: Scalar): Scalar.Expression;
	public static cos(x: number | Evaluable) {
		if(typeof x === "number")
			return Math.cos(x);
		if(x instanceof Scalar.Constant)
			return new Scalar.Constant(Math.cos(x.value));
		return new Scalar.Expression(UnaryOperator.COS, x);
	}

	public static tan(x: number): number;
	public static tan(x: Scalar.Constant): Scalar.Constant;
	public static tan(x: Scalar): Scalar.Expression;
	public static tan(x: number | Evaluable) {
		if(typeof x === "number")
			return Math.tan(x);
		if(x instanceof Scalar.Constant)
			return new Scalar.Constant(Math.tan(x.value));
		return new Scalar.Expression(UnaryOperator.TAN, x);
	}

	public static asin(x: number): number;
	public static asin(x: Scalar.Constant): Scalar.Constant;
	public static asin(x: Scalar): Scalar.Expression;
	public static asin(x: number | Evaluable) {
		if(typeof x === "number")
			return Math.asin(x);
		if(x instanceof Scalar.Constant)
			return new Scalar.Constant(Math.asin(x.value));
		return new Scalar.Expression(UnaryOperator.ASIN, x);
	}

	public static acos(x: number): number;
	public static acos(x: Scalar.Constant): Scalar.Constant;
	public static acos(x: Scalar): Scalar.Expression;
	public static acos(x: number | Evaluable) {
		if(typeof x === "number")
			return Math.asin(x);
		if(x instanceof Scalar.Constant)
			return new Scalar.Constant(Math.acos(x.value));
		return new Scalar.Expression(UnaryOperator.ACOS, x);
	}

	public static atan(x: number): number;
	public static atan(x: Scalar.Constant): Scalar.Constant;
	public static atan(x: Scalar): Scalar.Expression;
	public static atan(x: number | Evaluable) {
		if(typeof x === "number")
			return Math.atan(x);
		if(x instanceof Scalar.Constant)
			return new Scalar.Constant(Math.atan(x.value));
		return new Scalar.Expression(UnaryOperator.ATAN, x);
	}

	public static log(x: number): number;
	public static log(x: Scalar.Constant): Scalar.Constant;
	public static log(x: Scalar): Scalar.Expression;
	public static log(x: number | Evaluable) {
		if(typeof x === "number")
			return Math.log10(x);
		if(x instanceof Scalar.Constant)
			return new Scalar.Constant(Math.log10(x.value));
		return new Scalar.Expression(UnaryOperator.LOG, x);
	}

	public static ln(x: number): number;
	public static ln(x: Scalar.Constant): Scalar.Constant;
	public static ln(x: Scalar): Scalar.Expression;
	public static ln(x: number | Evaluable) {
		if(typeof x === "number")
			return Math.log(x);
		if(x instanceof Scalar.Constant)
			return new Scalar.Constant(Math.log(x.value));
		return new Scalar.Expression(UnaryOperator.LN, x);
	}

	public static exp(x: number): number;
	public static exp(x: Scalar.Constant): Scalar.Constant;
	public static exp(x: Scalar): Scalar.Expression;
	public static exp(x: number | Evaluable) {
		if(typeof x === "number")
			return Math.exp(x);
		if(x instanceof Scalar.Constant)
			return new Scalar.Constant(Math.exp(x.value));
		return new Scalar.Expression(UnaryOperator.EXP, x);
	}
}

export const sin = math.sin;
export const cos = math.cos;
export const tan = math.tan;
export const asin = math.asin;
export const acos = math.acos;
export const atan = math.atan;
export const log = math.log;
export const ln = math.ln;
export const exp = math.exp;

export enum UnaryOperator {
	SIN = "sin",
	COS = "cos",
	TAN = "tan",
	ASIN = "asin",
	ACOS = "acos",
	ATAN = "atan",
	LOG = "log",
	LN = "ln",
	EXP = "exp"
}

export function isUnaryOperator(s: string): s is UnaryOperator {
	for(let k in UnaryOperator)
		if(UnaryOperator[k] === s)
			return true;
	return false;
}