import { MathContext } from "./context";
import { Component } from "./component";
import { mathenv } from "../env";
/**
 * Uses the Newton-Raphson algorithm to find the root of a given equation.
 * The exact derivative (found analytically) is assumed to be known.
 * @param f Function whose root is to be found
 * @param f_ The derivative of `f`.
 * @param x The initial trial solution.
 * @returns The root of the given function `f` correct upto the number of decimal
 * 			places specified by the default [[MathContext]].
 * @ignore
 */
export function newton_raphson(f: (x: Component) => Component, f_: (x: Component) => Component, x: Component, context = mathenv.mode) {
	const ctx: MathContext = {
		precision: 2 * context.precision,
		rounding: context.rounding
	};
	let X = x;
	let Y: Component;
	while (true) {
		if (f(X).equals(Component.ZERO, ctx))
			return Component.round(X, context);
		Y = Component.create(X.toString());
		X = X.sub(f(X).div(f_(X), ctx), ctx);
		if (X.equals(Y, ctx))
			return Component.round(X, context);
	}
}

/**
 * Helper function for inverse trig functions. Transforms the product of two
 * into the square of sum (\\( \alpha^2 \\)) and square of difference (\\( \beta^2 \\)).
 * 
 * \\[ \left[\alpha(x, y)\right]^2 = (x+1)^2 + y^2 \\]
 * 
 * \\[ \left[\beta(x, y)\right]^2 = (x-1)^2 + y^2 \\]
 * 
 * @param x The absolute value of real part.
 * @param y The absolute value of imaginary part.
 * @param ctx The context settings to use.
 * @ignore
 */
export function alpha_beta_sq(x: Component, y: Component, ctx: MathContext) {
	const one = Component.ONE;
	const [xp1_sq, xm1_sq, y_sq] = [
									x.add(one, ctx), x.sub(one, ctx), y
								].map(val => val.mul(val, ctx));
	const alpha2 = xp1_sq.add(y_sq, ctx);
	const beta2 = xm1_sq.add(y_sq, ctx);
	return [alpha2, beta2];
}

/**
 * Helper function for inverse trig functions. Transforms the product of two
 * into a sum (\\( \alpha \\)) and difference (\\( \beta \\)).
 * 
 * \\[ \alpha(x, y) = \sqrt{(x+1)^2 + y^2} \\]
 * 
 * \\[ \beta(x, y) = \sqrt{(x-1)^2 + y^2} \\]
 * 
 * @param x The absolute value of real part.
 * @param y The absolute value of imaginary part.
 * @param ctx The context settings to use.
 */
export function alpha_beta(x: Component, y: Component, ctx: MathContext) {
	const half = Component.create("0.5");
	return alpha_beta_sq(x, y, ctx).map(value => value.pow(half, ctx));
}

/**
 * Checks whether an array contains distinct elements.
 * @param a Array of numbers.
 * @ignore
 */
function distinct(a: number[]) {
	for(let i = 0; i < a.length; i++)
		if(a.lastIndexOf(a[i]) !== i)
			return false;
	return true;
}

/**
 * Checks whether a given combination of numbers is an even permutation
 * of the other.
 * @param mu Combination to check against.
 * @param nu Combination to check.
 * @ignore
 */
function evenPerm(mu: number[], nu: number[]) {
	let p = 0;
	for(let i = 0; i < mu.length; i++) {
		const x = mu[i];
		const index = nu.indexOf(x);
		const jump = index - i;
		nu.splice(index, 1);
		nu.splice(i, 0, x);
		p += jump;
	}
	return p % 2 == 0;
}

/**
 * The generalised Levi-Civita symbol for \(n\) dimensions.
 * @param args The index values for the levi-civita symbol.
 */
export function levicivita(values: number[]): 1 | 0 | -1;
export function levicivita(...values: number[]): 1 | 0 | -1;
export function levicivita(...values: number[] | [number[]]) {
	let args: number[];
	const temp = values[0];
	if(temp instanceof Array)
		args = temp;
	else args = <Array<number>>values;
	const n = args.length;
	let max = args[0];
	args.forEach(x => {
		if(x > max)
			max = x;
	});
	if(max > n)
		throw new TypeError("Index value greater than dimension of symbol.");
	const arrange = new Array(n).fill(0).map((_, i) => i+1);
	return !distinct(args)? 0: evenPerm(args, arrange)? 1: -1;
}

/**
 * The Kronecker delta symbol for 2 dimensions.
 * @param i Index value.
 * @param j Index value.
 */
export function kronecker(i: number, j: number): 0 | 1;
/**
 * The generalised Kronecker delta symbol for any number of dimensions.
 * @param i Index values.
 * @param j Index values.
 */
export function kronecker(i: number[], j: number[]): 0 | 1;
export function kronecker(i: number | number[], j: number | number[]) {
	if(typeof i === "number" && typeof j === "number")
		return i === j ? 1: 0;
	else if(i instanceof Array && j instanceof Array)
		return !distinct(j)? 0: evenPerm(i, j)? 1: -1;
}