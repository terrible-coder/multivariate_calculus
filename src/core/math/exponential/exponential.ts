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
 * Evaluates the natural logarithm of $ 1 + x $ ($ |x| < \sqrt{2}-1 $).
 * Method:
 * For faster convergence we can write $ \ln (1+x) $ as
 * 
 * $$ \ln (1+x) = \ln (1+s) - \ln (1-s) $$
 * 
 * This gives us $ s = \frac{x}{2+x} $ and
 * 
 * $$ \ln (1+x) = 2 \sum_{n=0}^{\infty} \frac{s^{2n+1}}{2n+1} $$
 * 
 * @param x A number.
 * @param context The context settings to use.
 * @ignore
 */
function ln_1p(x: Component, context: MathContext) {
	const ctx: MathContext = {
		precision: 2 * context.precision,
		rounding: context.rounding
	};
	const s = x.div(Component.TWO.add(x, ctx), ctx);
	const s_sq = s.mul(s, ctx);
	let sum = Component.ZERO;
	let temp = s;
	let term = s;
	let n = 0;
	while(true) {
		sum = sum.add(term, ctx);
		const temp1 = temp.mul(s_sq, ctx);
		const term1 = temp1.div(Component.create(2*n+3), ctx);
		if(term1.equals(Component.ZERO, ctx))
			break;
		temp = temp1;
		term = term1;
		n++;
	}
	const res = Component.TWO.mul(sum, ctx);
	return Component.round(res, context);
}

/**
 * Reduces the range of the argument of the logarithm function.
 * Method:
 * For every number $ x > 1 $ we can write it as
 * 
 * $$ x = 2^k(1 + f) $$
 * 
 * where $ k $ is such that $ |f| < 1 $.
 * 
 * @param x A number.
 * @param context The context settings to use.
 */
function range_adjust(x: Component, context: MathContext): [number, Component] {
	const two = Component.TWO;
	const half = Component.create("0.5");
	const increment = x.lessThan(Component.ONE)? -1: 1;
	const multiplier = increment === 1? two: half;
	let k = 0;
	let twok = Component.ONE;
	let fplus1: Component;
	while(true) {
		fplus1 = x.div(twok, context);
		const sq = fplus1.mul(fplus1, context);
		if(sq.moreEquals(half, context) && sq.lessEquals(two, context))
			break;
		twok = twok.mul(multiplier, context);
		k += increment;
	}
	const f = fplus1.sub(Component.ONE, context);
	return [k, f];
}

/**
 * Calculates the natural logarithm (to the base $ e $) of a given number
 * with rounding according to the given context settings.
 * @param x A number.
 * @param context The context settings to use.
 */
export function ln(x: Component, context: MathContext): Component {
	if(x.lessEquals(Component.ZERO, context))
		throw new TypeError("Undefined.");
	if(x.equals(Component.ONE, context))
		return Component.ZERO;
	const ctx: MathContext = {
		precision: context.precision + 5,
		rounding: context.rounding
	};
	const [k, f] = range_adjust(x, ctx);
	let ln_1pf = ln_1p(f, ctx);
	const res = Component.create(k).mul(Component.ln2, ctx).add(ln_1pf, ctx);
	return Component.round(res, context);
}
