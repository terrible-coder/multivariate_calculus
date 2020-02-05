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
