import { Evaluable, Variable, isExpression, isVariable, Expression, Constant } from "./definitions";
import { isBinaryOperator } from "./operators";
import { isUnaryOperator, math } from "./unary";

export namespace ExpressionBuilder {
	export function createArgList(a: Evaluable, b?: Evaluable) {
		const list = new Set<Variable>();
		if(isExpression(a))
			a.arg_list.forEach(v => list.add(v));
		else if(isVariable(a))
			list.add(a);
		if(b !== undefined) {
			if(isExpression(b))
				b.arg_list.forEach(v => list.add(v));
			else if(isVariable(b))
				list.add(b);
		}
		return list;
	}

	function simplify(e: Evaluable, values: Map<Variable, Constant>): Evaluable {
		if(isExpression(e)) {
			let depends = false;
			e.arg_list.forEach(v => depends = depends || values.has(v));
			if(depends)
				return evaluateAt(e, values);
		}
		return values.get(<Variable>e) || e;
	}

	export function evaluateAt(exp: Expression, values: Map<Variable, Constant>) {
		if(isBinaryOperator(exp.op))
			return simplify(exp.lhs, values)[exp.op](simplify(exp.rhs, values));
		if(isUnaryOperator(exp.op))
			return (<any>math[exp.op])(simplify(exp.arg, values));
	}
}