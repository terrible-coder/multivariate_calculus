import { MathContext } from "../context";
import { Component } from "../component";

/**
 * Calculates the exponential of a given number with rounding according to
 * the given context settings.
 * @param x A number
 * @param context The context settings to use.
 */
export function exp(x: Component, context: MathContext) {
	const ctx: MathContext = {
		precision: 2 * context.precision,
		rounding: context.rounding
	};
	let sum = Component.ZERO;
	let term = Component.ONE;
	let n = Component.ZERO;
	while(true) {
		sum = sum.add(term, ctx);
		const term1 = term.mul(x, ctx).div(n.add(Component.ONE), ctx);
		if(Component.abs(term1).equals(Component.ZERO, ctx))
			return Component.round(sum, context);
		term = term1;
		n = n.add(Component.ONE);
	}
}

/**
 * Evaluates the natural logarithm of a given number \\(x\\)(\\(|x| < 1\\)).
 * @param x A number.
 * @param context The context settings to use.
 * @ignore
 */
function ln_less(x: Component, context: MathContext) {
	const ctx: MathContext = {
		precision: 2 * context.precision,
		rounding: context.rounding
	};
	let sum = Component.ZERO;
	let term = x;
	let n = Component.ONE;
	while(true) {
		sum = sum.add(term.div(n, ctx), ctx);
		const term1 = term.mul(x, ctx).neg;
		const term2 = term1.div(n.add(Component.ONE, ctx), ctx);
		if(Component.abs(term2).equals(Component.ZERO, ctx))
			return Component.round(sum, context);
		term = term1;
		n = n.add(Component.ONE);
	}
}

/**
 * Calculates the natural logarithm (to the base \\(e\\)) of a given number
 * with rounding according to the given context settings.
 * @param x A number.
 * @param context The context settings to use.
 */
export function ln(x: Component, context: MathContext): Component {
	if(x.lessEquals(Component.ZERO, context))
		throw new TypeError("Undefined.");
	const ctx: MathContext = {
		precision: 2 * context.precision,
		rounding: context.rounding
	};
	if(x.lessThan(Component.ONE))
		return Component.round(ln(Component.ONE.div(x, ctx), ctx).neg, context);
	const ten = Component.create("10");
	const limit = Component.create("0.9");
	let k = x.integer.length - 1;
	let tenk = Component.intpow(ten, k);
	let f: Component;
	while(true) {
		f = x.div(tenk, ctx).sub(Component.ONE, ctx);
		const abs = Component.abs(f);
		if(abs.lessEquals(limit, ctx))
			break;
		tenk = tenk.mul(ten);
		k++;
	}
	const res = Component.create(k).mul(Component.ln10, ctx).add(ln_less(f, ctx), ctx);
	return Component.round(res, context);
}
