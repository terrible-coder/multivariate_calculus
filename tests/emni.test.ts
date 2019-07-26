import { Scalar } from "../src/scalar";
import { abs, sin, floor } from "../src/core/math/functions";
import { isExpression } from "../src/core/definitions";

const x = Scalar.variable("x");
const y = Scalar.variable("y");
const two = Scalar.constant(2);
const a = Scalar.constant(2, "a");
const b = Scalar.constant(3, "b");
const expr1 = x.add(y);
const expr2 = x.sub(y);
const expr3 = two.add(y);
const value1 = expr1.at(new Map([
	[x, two]
]));
const sinx = sin(x);
const absx = abs(x);

describe("checks Scalar variable system", function() {
	it("Checks naming system", function() {
		expect(Scalar.constant("a")).toBe(a);
		expect(a).not.toBe(two);
		expect(a.equals(two)).toBe(true);
		expect(()=> Scalar.constant(5, "a")).toThrow();
	});

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

	it("checks expression evaluation", function() {
		const res = expr3.at(new Map([
			[y, Scalar.constant(3)]
		]));
		const expr4 = a.add(y);
		expect(res).toBe(Scalar.constant(5));
		expect(expr4.at(new Map([
			[y, Scalar.constant(3)]
		]))).toBe(res);
		expect(a.add(b)).toBe(res);
	});

	it("checks sine function", function() {
		expect(sin(0)).toBe(Math.sin(0));
		for(let i = 0; i < 2*Math.PI; i += 0.01)
			expect(sin(Scalar.constant(i))).toBe(Scalar.constant(Math.sin(i)));
		for(let i = 0; i < 2*Math.PI; i += 0.01)
			expect(sinx.at(new Map([
				[x, Scalar.constant(i)]
			]))).toBe(Scalar.constant(Math.sin(i)));
	});

	it("checks absolute value", function() {
		expect(abs(0)).toBe(Math.abs(0));
		for(let i = -5; i <= 5; i += 1)
			expect(abs(Scalar.constant(i))).toBe(Scalar.constant(Math.abs(i)));
		for(let i = -5; i <= 5; i += 1)
			expect(absx.at(new Map([
				[x, Scalar.constant(i)]
			]))).toBe(Scalar.constant(Math.abs(i)));
	});

	it("checks floor function", function() {
		expect(floor(0)).toBe(Math.abs(0));
		for(let i = -5; i <= 5; i += 1)
			expect(floor(Scalar.constant(i))).toBe(Scalar.constant(Math.floor(i)));
	});
});
