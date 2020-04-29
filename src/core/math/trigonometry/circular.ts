import { Component } from "../component";
import { MathContext } from "../context";

/**
 * Calculates the trigonometric sine with rounding according to the given
 * context.
 * @param x A number.
 * @param context The context settings to use.
 */
export function sin(x: Component, context: MathContext) {
	const ctx: MathContext = {
		precision: 2 * context.precision,
		rounding: context.rounding
	};
	x = x.mod(Component.TWO.mul(Component.PI, ctx), ctx);
	if(Component.abs(x).equals(Component.PI, context))
		return Component.ZERO;
	const x_sq = x.mul(x, ctx);
	let sum = Component.ZERO;
	let term = x;
	let n = 0;
	while(true) {
		sum = sum.add(term, ctx);
		const f = Component.create((2 * n + 2) * (2 * n + 3));
		const term1 = term.mul(x_sq, ctx).div(f, ctx).neg;
		if(term1.equals(Component.ZERO, ctx))
			return Component.round(sum, context);
		term = term1;
		n++;
	}
}

/**
 * Calculates the trigonometric cosine with rounding according to the given
 * context.
 * @param x A number.
 * @param context The context settings to use.
 */
export function cos(x: Component, context: MathContext) {
	const ctx: MathContext = {
		precision: 2 * context.precision,
		rounding: context.rounding
	};
	x = x.mod(Component.TWO.mul(Component.PI, ctx), ctx);
	const x_sq = x.mul(x, ctx);
	let sum = Component.ZERO;
	let term = Component.ONE;
	let n = 0;
	while(true) {
		sum = sum.add(term, ctx);
		const f = Component.create((2*n+1) * (2*n+2));
		const term1 = term.mul(x_sq, ctx).div(f, ctx).neg;
		if(term1.equals(Component.ZERO, ctx))
			return Component.round(sum, context);
		term = term1;
		n++;
	}
}

/**
 * Computes the inverse trigonometric sine for \\(x\\) (\\(|x| < 0.5\\))
 * with rounding according to the given context settings.
 * @param x A number.
 * @param context The context settings to use.
 * @ignore
 */
function asin_less(x: Component, context: MathContext) {
	const ctx: MathContext = {
		precision: 2 * context.precision,
		rounding: context.rounding
	};
	const x_sq = x.mul(x, ctx);
	let sum = Component.ZERO;
	let term = x;
	let temp = x;
	let f = Component.ONE;
	let n = 0;
	while(true) {
		sum = sum.add(temp, ctx);
		const f1 = Component.create(2*n + 3);
		const fac = f.div(Component.create(2*n+2), ctx);
		const term1 = term.mul(x_sq, ctx).mul(fac, ctx);
		const temp1 = term1.div(f1, ctx);
		if(temp1.equals(Component.ZERO, ctx))
			return Component.round(sum, context);
		f = f1;
		term = term1;
		temp = temp1;
		n++;
	}
}

/**
 * Calculates the inverse trigonometric sine of a number with rounding
 * according to the given context.
 * @param x A number.
 * @param context The context settings to use.
 */
export function asin(x: Component, context: MathContext): Component {
	if(x.lessThan(Component.ZERO))
		return asin(x.neg, context).neg;
	const half = Component.create("0.5");
	if(x.lessThan(half))
		return asin_less(x, context);
	const ctx: MathContext = {
		precision: context.precision + 5,
		rounding: context.rounding
	};
	const piby2 = Component.PI.div(Component.TWO, ctx);
	const z = Component.ONE.sub(x, ctx).div(Component.TWO, ctx);
	const s = z.pow(half, ctx);
	const temp = asin_less(s, ctx);
	const res = piby2.sub(Component.TWO.mul(temp, ctx), ctx);
	return Component.round(res, context);
}

/**
 * Calculates the inverse trigonometric cosine of a number with rounding
 * according to the given context.
 * @param x A number.
 * @param context The context settings to use.
 */
export function acos(x: Component, context: MathContext) {
	const ctx: MathContext = {
		precision: context.precision + 5,
		rounding: context.rounding
	};
	const half = Component.create("0.5");
	if(Component.abs(x).lessThan(half)) {
		const res = Component.PI.mul(half, ctx).sub(asin_less(x, ctx), ctx);
		return Component.round(res, context);
	}
	const z = Component.ONE.sub(x, ctx).div(Component.TWO, ctx);
	const s = z.pow(half, ctx);
	const temp = asin(s, ctx);
	const res = Component.TWO.mul(temp, ctx);
	return Component.round(res, context);
}
