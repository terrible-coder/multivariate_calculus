import { Scalar } from "../scalar";

export function left_limit(expr: Scalar.Expression, value: Scalar.Constant) {
	const x = Scalar.variable("x");
	let h = 10;
	let prev = <Scalar.Constant>expr.at(new Map([
		[x, Scalar.constant(value.value - h)]
	]));
	while(true) {
		h /= 10;
		let lim = <Scalar.Constant>expr.at(new Map([
			[x, Scalar.constant(value.value - h)]
		]));
		console.log(h, lim);
		if(lim.equals(prev, 1e-5))
			return lim;
		prev = lim;
	}
}

export function right_limit(expr: Scalar.Expression, value: Scalar.Constant) {
	const x = Scalar.variable("x");
	let h = 10;
	let prev = <Scalar.Constant>expr.at(new Map([
		[x, Scalar.constant(value.value + h)]
	]));
	while(true) {
		h /= 10;
		let lim = <Scalar.Constant>expr.at(new Map([
			[x, Scalar.constant(value.value + h)]
		]));
		console.log(h, lim);
		if(lim.equals(prev, 1e-5))
			return lim;
		prev = lim;
	}
}