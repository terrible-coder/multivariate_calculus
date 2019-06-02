import { Scalar, isExpression } from "../src";

const x = new Scalar.Variable();
const y = new Scalar.Variable();
const z = x.add(y);
const w = x.sub(y);
const z1 = z.at(new Map([
	[x, new Scalar.Constant(2)]
]));

it("bitching", function() {
	expect(isExpression(z)).toBe(true);
	expect(isExpression(w)).toBe(true);
	console.log(z1);
});