import { Evaluable, Variable, isExpression, isVariable, Expression, Constant } from "./definitions";
import { isBinaryOperator } from "./operators/binary";
import { isUnaryOperator } from "./operators/unary";
import * as func from "./math/functions";

/**
 * Contains helper functions needed by any class that is an [[Expression]].
 */
export namespace ExpressionBuilder {
	/**
	 * Given any one or two [[Evaluable]] quantities, contructs a `Set` of
	 * unknowns it/they depend on.
	 * @param a First [[Evaluable]]
	 * @param b Second [[Evaluable]]
	 */
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

	/**
	 * Given an [[Expression]] and a `Map` of variables to constants, evaluates
	 * the value of the given expression at the given values of variables.
	 * It is like evaluating the expression by substituting the specified
	 * variables by respective constant values.
	 * @param exp The [[Expression]] to evaluate
	 * @param values The map of [[Variable]]s to [[Constant]]s.
	 */
	export function evaluateAt(exp: Expression, values: Map<Variable, Constant>) {
		if(isBinaryOperator(exp.op))
			return simplify(exp.lhs, values)[exp.op](simplify(exp.rhs, values));
		if(isUnaryOperator(exp.op))
			return ((<any>func)[exp.op])(simplify(exp.arg, values));
	}
}