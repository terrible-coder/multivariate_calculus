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

function distinct(a: number[]) {
	for(let i = 0; i < a.length; i++)
		if(a.lastIndexOf(a[i]) !== i)
			return false;
	return true;
}

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