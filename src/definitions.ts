export interface Token {
	readonly type: "operator" | "expression" | "variable" | "constant";
}

export interface Evaluable extends Token {
	add(that: Evaluable): Evaluable;
	mul(that: Evaluable): Evaluable;
}
export interface Variable extends Evaluable {
	readonly type: "variable";
}
export interface Constant extends Evaluable {
	readonly value: any;
}

export abstract class Operator implements Token {
	readonly type = "operator";
	abstract readonly op: string | Function;
	abstract readonly operation: Function;
}

export class BinaryOperator extends Operator {
	private constructor(readonly op: string, readonly operation: (a: Evaluable, b: Evaluable)=>Evaluable) {
		super();
		//check whether op is a valid binary operator or not
	}

	public static define(symbol: string, operation: (a: Evaluable, b: Evaluable)=>Evaluable) {
		return new BinaryOperator(symbol, operation);
	}

	public operate(lhs: Evaluable, rhs: Evaluable) {
		return this.operation(lhs, rhs);
	}
}

export class UnaryOperator extends Operator {
	private constructor(readonly op: Function, readonly operation: (a: Evaluable)=>Evaluable) {
		super();
		// check whether op is a valid unary operator or not
	}

	public static define(symbol: Function, operation: (a: Evaluable)=>Evaluable) {
		return new UnaryOperator(symbol, operation);
	}

	public operate(arg: Evaluable) {
		return this.operation(arg);
	}
}
