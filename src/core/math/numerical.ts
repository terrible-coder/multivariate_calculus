import { MathContext } from "./context";
import { BigNum } from "./bignum";
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
export function newton_raphson(f: (x: BigNum) => BigNum, f_: (x: BigNum) => BigNum, x: BigNum, context = BigNum.MODE) {
	const ctx: MathContext = {
		precision: 2 * context.precision,
		rounding: context.rounding
	};
	let X = x;
	let Y: BigNum;
	while (true) {
		if (f(X).equals(BigNum.ZERO, ctx))
			return BigNum.round(X, context);
		Y = BigNum.real(X.toString());
		X = X.sub(f(X).div(f_(X), ctx), ctx);
		if (X.equals(Y, ctx))
			return BigNum.round(X, context);
	}
}

/**
 * The generalised Levi-Civita symbol for \(n\) dimensions.
 * @param args The index values for the levi-civita symbol.
 */
export function levicivita(...args: number[]) {
	const n = args.length;
	for(let i = 1; i <= n; i++)
		if(args[i] > n)
			throw new TypeError("Index value greater than dimension of symbol.");
		else if(args.indexOf(i) != args.lastIndexOf(i))
			return 0;
	let p = 0;
	for(let i = 1; i <= n; i++) {
		const index = args.indexOf(i);
		const jump = index - (i-1);
		args.splice(index, 1);
		args.splice(i-1, 0, i);
		p += jump;
	}
	return p % 2 == 0? 1: -1;
}