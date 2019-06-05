import { Scalar } from "../src/scalar";
import { UnaryOperator as UO, sin, math } from "../src/core/operators/unary";
import { isExpression } from "../src/core/definitions";

const x = new Scalar.Variable();
const y = new Scalar.Variable();
const z = x.add(y);
const w = x.sub(y);
const z1 = z.at(new Map([
	[x, new Scalar.Constant(2)]
]));
const sinx = sin(x);
console.log(math[UO.SIN](Math.PI/2));
console.log(math[UO.SIN](new Scalar.Constant(Math.PI/4)));
console.log(sinx);
console.log(sinx.at(new Map([
	[x, new Scalar.Constant(Math.PI/4)]
])));
it("bitching", function() {
	expect(isExpression(z)).toBe(true);
	expect(isExpression(w)).toBe(true);
	console.log(z1);
});