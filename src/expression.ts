import { Evaluable, Operator, Variable, BinaryOperator, UnaryOperator, Constant } from "./definitions";
import { MUL, ADD } from "./operators";

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
		return new Expression(ADD, this, that);
	}

	// public sub(that: Evaluable): Expression {
	// 	return new Expression(new BinaryOperator("-"), this, that);
	// }

	public mul(that: Evaluable): Evaluable {
		return new Expression(MUL, this, that);
	}

	public isFunctionOf(v: Variable) {
		return this.arg_list.has(v);
	}

	private static eval(e: Evaluable, values: Map<Variable, Constant>): Evaluable {
		if (e.type === "constant")
			return e;
		if (e.type === "variable")
			return values.get(<Variable>e) || e;
		if (e instanceof Expression) {
			let depends = false;
			e.arg_list.forEach(v => depends = depends || e.isFunctionOf(v));
			if (depends)
				return e.at(values);
		}
		return e;
	}

	private static simplify(e: Evaluable): Evaluable {
		if(e.type === "constant")
			return <Constant>e;
		if(e.type === "variable")
			return <Variable>e;
		if(e instanceof Expression) {
			if(e.op instanceof UnaryOperator)
				return e.op.op(Expression.simplify(e.arg));
			if(e.op instanceof BinaryOperator) {
				switch(e.op.op) {
				case "+": return Expression.simplify(e.lhs).add(Expression.simplify(e.rhs));
				case "*": return Expression.simplify(e.lhs).mul(Expression.simplify(e.rhs));
				}
			}
		}
		throw "Something went wrong.";
	}

	public at(values: Map<Variable, Constant>, simple = true) {
		if (this.op instanceof BinaryOperator)
			return simple?
				this.op.operate(Expression.eval(this.lhs, values), Expression.eval(this.rhs, values)):
				new Expression(this.op, Expression.eval(this.lhs, values), Expression.eval(this.rhs, values))
		else
			return simple?
				(<UnaryOperator>this.op).operate(Expression.eval(this.arg, values)):
				new Expression(<UnaryOperator>this.op, Expression.eval(this.arg, values));
	}
}
