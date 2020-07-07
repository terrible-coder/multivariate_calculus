import { MathContext } from "../context";
import { Component } from "../component";

export namespace Exponent {
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
		const threshold = Component.create("0.5").mul(Component.ln2, ctx);
		// range reduction
		let k = 0;
		let r: Component;
		let ln2_sum = Component.ZERO;
		const increment = x.lessThan(Component.ZERO)? -1: 1;
		while(true) {
			r = x.sub(ln2_sum, ctx);
			if(r.lessEquals(threshold, ctx))
				break;
			ln2_sum = increment === 1? ln2_sum.add(Component.ln2, ctx) : ln2_sum.sub(Component.ln2, ctx);
			k += increment;
		}
		let sum = Component.ZERO;
		let term = Component.ONE;
		let n = 0;
		while(true) {
			sum = sum.add(term, ctx);
			const term1 = term.mul(r, ctx).div(Component.create(n + 1), ctx);
			if(term1.equals(Component.ZERO, ctx))
				break;
			term = term1;
			n++;
		}
		const temp = Component.intpow(Component.TWO, Math.abs(k), ctx);
		const two_k = k >= 0? temp: Component.ONE.div(temp, ctx);
		const res = two_k.mul(sum, ctx);
		return Component.round(res, context);
	}
	
	/**
	 * Evaluates the natural logarithm of \\( 1 + x \\) (\\( |x| < \sqrt{2}-1 \\)).
	 * 
	 * **Method**:
	 * 
	 * For faster convergence we can write \\( \ln (1+x) \\) as
	 * 
	 * \\[ \ln (1+x) = \ln (1+s) - \ln (1-s) \\]
	 * 
	 * This gives us \\( s = \frac{x}{2+x} \\) and
	 * 
	 * \\[ \ln (1+x) = 2 \sum_{n=0}^{\infty} \frac{s^{2n+1}}{2n+1} \\]
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
	 * 
	 * **Method**:
	 * 
	 * For every number \\( x > 1 \\) we can write it as
	 * 
	 * \\[ x = 2^k(1 + f) \\]
	 * 
	 * where \\( k \\) is such that \\( |f| < 1 \\).
	 * 
	 * @param x A number.
	 * @param context The context settings to use.
	 * @ignore
	 */
	function range_adjust(x: Component, context: MathContext): [number, Component] {
		const two = Component.TWO;
		const half = Component.create("0.5");
		const increment = x.lessThan(Component.ONE)? -1: 1;
		const multiplier = increment === 1? two: half;
		let k = 0;
		let two_k = Component.ONE;
		let fPlus1: Component;
		while(true) {
			fPlus1 = x.div(two_k, context);
			const sq = fPlus1.mul(fPlus1, context);
			if(sq.moreEquals(half, context) && sq.lessEquals(two, context))
				break;
			two_k = two_k.mul(multiplier, context);
			k += increment;
		}
		const f = fPlus1.sub(Component.ONE, context);
		return [k, f];
	}
	
	/**
	 * Calculates the natural logarithm (to the base \\( e \\)) of a given number
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
	
	/**
	 * Raises `base` to the power of `ex` using the rounding according to the
	 * given context settings.
	 * @param ex A number.
	 * @param context The context settings object to use.
	 */
	export function pow(base: Component, ex: Component, context: MathContext): Component {
		if(base.equals(Component.ZERO, context))
			return Component.ZERO;
		const ctx: MathContext = {
			precision: context.precision + 5,
			rounding: context.rounding
		};
		const exp_isInteger = ex.decimal === "" || ex.decimal === "0";
		// const exp_isNegative = ex.lessThan(Component.ZERO);
		// const base_isInteger = base.decimal === "" || base.decimal === "0";
		const base_isNegative = base.lessThan(Component.ZERO);
		if(base_isNegative && !exp_isInteger)
			throw new TypeError("Raising negative numbers to fractional powers not defined.");
		let sign: number;
		let a: Component, b: Component;
		if(base_isNegative) {
			sign = ex.mod(Component.TWO, context).equals(Component.ZERO, context)? 1: -1;
			a = base.neg;
			b = ex;
		} else {
			sign = 1;
			a = base;
			b = ex;
		}
		const y = b.mul(Component.ln(a, ctx), ctx);
		const temp = Component.exp(y, ctx);
		const res = sign === 1? temp: temp.neg;
		return Component.round(res, context);
	}
}
