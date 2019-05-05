import { Evaluable, Operator, Variable, BinaryOperator, UnaryOperator } from "./definitions";

type UnaryOperands = {
	readonly arg: Evaluable;
};

type BinaryOperands = {
	readonly lhs: Evaluable;
	readonly rhs: Evaluable;
};

export class Expression implements Evaluable {
	readonly type = "expression";
	readonly op: Operator;
	private readonly operands: BinaryOperands | UnaryOperands;
	readonly arg_list: Set<Variable>;
	constructor(op: BinaryOperator, lhs: Evaluable, rhs: Evaluable);
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

	public get lhs(): Evaluable {
		if ("lhs" in this.operands)
			return this.operands.lhs;
		throw "Unary operator does not have left hand side argument.";
	}

	public get rhs(): Evaluable {
		if ("rhs" in this.operands)
			return this.operands.rhs;
		throw "Unary operator does not have left hand side argument.";
	}

	public get arg(): Evaluable {
		if ("arg" in this.operands)
			return this.operands.arg;
		throw "Unary operator does not have left hand side argument.";
	}

	public add(that: Evaluable): Expression {
		return new Expression(new BinaryOperator("+"), this, that);
	}

	public sub(that: Evaluable): Expression {
		return new Expression(new BinaryOperator("-"), this, that);
	}

	public mul(that: Evaluable): Evaluable {
		return new Expression(new BinaryOperator("*"), this, that);
	}
}
