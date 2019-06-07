import { Scalar } from "../src/Scalar";
import { UnaryOperator as UO, sin, math } from "../src/core/operators/unary";
import { isExpression } from "../src/core/definitions";

const x = Scalar.variable("x");
const y = Scalar.variable("y");
const two = Scalar.constant(2);
const expr1 = x.add(y);
const expr2 = x.sub(y);
const expr3 = two.add(y);
const value1 = expr1.at(new Map([
	[x, two]
]));

const sinx = sin(x);
console.log(math[UO.SIN](Math.PI/2));
console.log(math[UO.SIN](Scalar.constant(Math.PI/4)));
console.log(sinx);
console.log(sinx.at(new Map([
	[x, Scalar.constant(Math.PI/4)]
])));

describe("checks Scalar variable system", function() {
	it("checks inheritance", function() {
		expect(isExpression(expr1)).toBe(true);
		expect(isExpression(expr2)).toBe(true);
		expect(isExpression(expr3)).toBe(true);
	});

	it("tests non-duplicating system", function() {
		expect(Scalar.variable("x")).toBe(x);
		expect(Scalar.constant(2)).toBe(two);
	});

	it("checks for expression equivalency", function() {
		expect(value1).toEqual(expr3);
	});
});
