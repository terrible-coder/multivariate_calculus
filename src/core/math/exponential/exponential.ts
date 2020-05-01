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
 * For $ \ln (1+x) $ where $ |x| < 1 $ we can use the definition by integration.
 * 
 * $$ \ln (1+x) = \int_0^x \frac{dt}{1+t} $$
 * Since $ |x| < 1 $
 * 
 * $$ \ln (1+x) = \sum_{n=1}^{\infty} (-1)^{n-1} \frac{x^n}{n} $$
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
	let sum = Component.ZERO;
	let temp = x;
	let term = x;
	let n = 1;
	while(true) {
		sum = sum.add(term, ctx);
		const temp1 = temp.mul(x, ctx).neg;
		const term1 = temp1.div(Component.create(n+1), ctx);
		if(term1.equals(Component.ZERO, ctx))
			return Component.round(sum, context);
		temp = temp1;
		term = term1;
		n++;
	}
}

/**
 * Reduces the range of the argument of the logarithm function.
 * Method:
 * For every number $ x > 1 $ we can write it as
 * 
 * $$ x = 10^k(1 + f) $$
 * 
 * where $ k $ is such that $ |f| < 1 $.
 * 
 * @param x A number.
 * @param context The context settings to use.
 */
function reduce_range(x: Component, context: MathContext): [number, Component] {
	const ten = Component.create("10");
	let k = x.integer.length - 1;
	let tenk = Component.intpow(ten, k);
	let f: Component;
	while(true) {
		const s = x.div(tenk, context);
		f = s.sub(Component.ONE, context);
		const abs = Component.abs(f);
		if(abs.lessThan(Component.ONE))
			break;
		tenk = tenk.mul(ten);
		k++;
	}
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
	if(x.lessThan(Component.ONE))
		return Component.round(ln(Component.ONE.div(x, ctx), ctx).neg, context);
	const [k, f] = reduce_range(x, ctx);
	let ln_1pf: Component;
	const check = f.add(Component.ONE).pow(Component.TWO).moreThan(Component.TWO);
	if(check) {
		const num = Component.ONE.sub(f, ctx);
		const den = Component.ONE.add(f, ctx);
		const less = num.div(den, ctx);
		const res = ln_1p(less, ctx);
		ln_1pf = Component.ln2.sub(res, ctx);
	} else ln_1pf = ln_1p(f, ctx);
	const a = Component.create(k).mul(Component.ln10, ctx);
	const res = a.add(ln_1pf, ctx);
	return Component.round(res, context);
}
