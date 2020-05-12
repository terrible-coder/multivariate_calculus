import { Component } from "../component";
import { MathContext } from "../context";
import { Exponent } from "../exponential/exponential";

const ln = Exponent.ln;

export namespace TrigHyperbolic {
	/**
	 * Calculates the hyperbolic sine with rounding according to the given context.
	 * @param x A number.
	 * @param context The context settings to use.
	 */
	export function sinh(x: Component, context: MathContext) {
		const ctx: MathContext = {
			precision: 2 * context.precision,
			rounding: context.rounding
		};
		const x_sq = x.mul(x, ctx);
		let sum = Component.ZERO;
		let term = x;
		let n = 0;
		while(true) {
			sum = sum.add(term, ctx);
			const f = Component.create((2*n + 2) * (2*n + 3));
			const term1 = term.mul(x_sq, ctx).div(f, ctx);
			if(term1.equals(Component.ZERO, ctx))
				return Component.round(sum, context);
			term = term1;
			n++;
		}
	}
	
	/**
	 * Calculates the hyperbolic cosine with rounding according to the given context.
	 * @param x A number.
	 * @param context The context settings to use.
	 */
	export function cosh(x: Component, context: MathContext) {
		const ctx: MathContext = {
			precision: 2 * context.precision,
			rounding: context.rounding
		};
		const x_sq = x.mul(x, ctx);
		let sum = Component.ZERO;
		let term = Component.ONE;
		let n = 0;
		while(true) {
			sum = sum.add(term, ctx);
			const f = Component.create((2*n + 1) * (2*n + 2));
			const term1 = term.mul(x_sq, ctx).div(f, ctx);
			if(term1.equals(Component.ZERO, ctx))
				return Component.round(sum, context);
			term = term1;
			n++;
		}
	}
	
	/**
	 * Calculates the inverse hyperbolic sine with rounding according to the
	 * given context.
	 * @param x A number.
	 * @param context The context settings to use.
	 */
	export function asinh(x: Component, context: MathContext) {
		const ctx: MathContext = {
			precision: 2 * context.precision,
			rounding: context.rounding
		};
		const a = x;
		const b = x.pow(Component.TWO, ctx).add(Component.ONE, ctx).pow(Component.create("0.5"), ctx);
		const exp = a.add(b, ctx);
		const res = ln(exp, ctx);
		return Component.round(res, context);
	}
	
	/**
	 * Calculates the inverse hyperbolic cosine with rounding according to the
	 * given context.
	 * @param x A number.
	 * @param context The context settings to use.
	 */
	export function acosh(x: Component, context: MathContext) {
		const ctx: MathContext = {
			precision: 2 * context.precision,
			rounding: context.rounding
		};
		const a = x;
		const b = x.pow(Component.TWO, ctx).sub(Component.ONE, ctx).pow(Component.create("0.5"), ctx);
		const exp = a.add(b, ctx);
		const res = ln(exp, ctx);
		return Component.round(res, context);
	}
}
