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
}

export class BinaryOperator extends Operator {
	constructor(readonly op: string) {
		super();
		//check whether op is a valid binary operator or not
	}
}

export class UnaryOperator extends Operator {
	constructor(readonly op: Function) {
		super();
		// check whether op is a valid unary operator or not
	}
}
