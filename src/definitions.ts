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

export class Operator implements Token {
	readonly type = "operator";
}

export class BinaryOperator extends Operator {
	constructor(readonly op: string, readonly lhs: Token, readonly rhs: Token) {
		super();
	}
}

export class UnaryOperator extends Operator {
	constructor(readonly op: Function, readonly child: Token) {
		super();
	}
}

export class Expression implements Evaluable {
	readonly type = "expression";
	readonly root: Operator;
	arg_list: Set<Variable>;
	constructor(root: Operator);
	constructor(expr: Expression);

	constructor(a: Operator|Expression) {
		if(a instanceof Expression)
			this.root = a.root;
		else this.root = a;
		this.arg_list = argList(this.root);
	}

	public add(that: Evaluable): Expression {
		if(that instanceof Expression)
			return new Expression(new BinaryOperator("+", this.root, that.root));
		return new Expression(new BinaryOperator("+", this.root, that));
	}

	public sub(that: Evaluable): Expression {
		if(that instanceof Expression)
			return new Expression(new BinaryOperator("-", this.root, that.root));
		return new Expression(new BinaryOperator("-", this.root, that));
	}

	public mul(that: Evaluable): Evaluable {
		if(that instanceof Expression)
			return new Expression(new BinaryOperator("*", this.root, that.root));
		return new Expression(new BinaryOperator("*", this.root, that));
	}
}

function argList(op: Operator): Set<Variable> {
	const list = new Set<Variable>();
	if(op instanceof UnaryOperator) {
		if(op.child instanceof Operator)
			argList(op.child).forEach(x => list.add(x));
		else if(op.child.type === "variable")
			list.add(<Variable>op.child);
	} else if(op instanceof BinaryOperator) {
		if(op.lhs instanceof Operator)
			argList(op.lhs).forEach(x => list.add(x));
		else if(op.lhs.type === "variable")
			list.add(<Variable>op.lhs);
		if(op.rhs instanceof Operator)
			argList(op.rhs).forEach(x => list.add(x));
		else if(op.rhs.type === "variable")
			list.add(<Variable>op.rhs);
	}
	return list
}