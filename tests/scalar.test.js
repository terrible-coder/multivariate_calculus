const { Scalar } = require("../build/scalar");
const { Component } = require("../build/core/math/component");
const { BigNum } = require("../build/core/math/bignum");
// const { DivisionByZero, Overwrite } = require("../build/core/errors");

function randomDigit() {
	const digit = (10 * Math.random()) | 0;
	return digit.toString();
}

describe("Scalars", function() {
	describe("Creates constants", function() {
		describe("decimal notation", function() {
			test("from 1 real", function() {
				for(let i = 0; i < 100; i++) {
					let rand;
					rand = (10 * Math.random()) | 0;
					const integers = new Array(rand).fill(0).map(() => randomDigit()).join("");
					rand = (10 * Math.random()) | 0;
					const decimals = new Array(rand).fill(0).map(() => randomDigit()).join("");
					const numString = integers + "." + decimals;
					const num = Component.create(numString);
					expect(Scalar.constant(num).value).toEqual(BigNum.real(numString));
				}
			});
	
			test("from 5 reals", function() {
				for(let i = 0; i < 100; i++) {
					const components = [];
					for(let j = 0; j < 5; j++) {
						let rand;
						rand = (10 * Math.random()) | 0;
						const integers = new Array(rand).fill(0).map(() => randomDigit()).join("");
						rand = (10 * Math.random()) | 0;
						const decimals = new Array(rand).fill(0).map(() => randomDigit()).join("");
						const numString = integers + "." + decimals;
						components.push(numString);
					}
					const num = BigNum.hyper(components);
					expect(Scalar.constant(num).value).toEqual(num);
				}
			});
		});
	});

	describe("Constants", function() {
		const a = Scalar.constant(2, "a"), b = Scalar.constant(3, "b");

		it("Has naming system", function() {
			expect(a).not.toBe(Scalar.constant(2));
		});

		it("Names correctly", function() {
			expect(Scalar.constant("a")).toBe(a);
			expect(Scalar.constant("b")).toBe(b);
			expect(() => Scalar.constant(5, "a")).toThrowError("already been declared");
		});

		it("Checks equality", function() {
			expect(a.equals(Scalar.constant(2))).toBe(true);
			expect(b.equals(Scalar.constant(3))).toBe(true);
		});

		it("Adds", function() {
			const sum = a.add(b);
			expect(sum).toEqual(Scalar.constant(5));
		});

		it("Subtracts", function() {
			const diff = a.sub(b);
			expect(diff).toEqual(Scalar.constant(-1));
		});

		it("Multiplies", function() {
			const prod = a.mul(b);
			expect(prod).toEqual(Scalar.constant(6));
			expect(prod.mul(Scalar.ZERO)).toEqual(Scalar.ZERO);
		});

		it("Divides", function() {
			const quo = b.div(a);
			expect(quo).toEqual(Scalar.constant(1.5));
			expect(() => a.div(Scalar.ZERO)).toThrowError("Division by zero");
		});

		// it("Exponentiates", function() {
		// 	const res = a.pow(b);
		// 	expect(res).toEqual(Scalar.constant(8));
		// 	expect(a.pow(Scalar.ZERO)).toEqual(Scalar.constant(1));
		// 	expect(() => Scalar.ZERO.pow(Scalar.ZERO)).toThrowError("0 raised to the power 0");
		// });
	});

	describe("Variables", function() {
		const x = Scalar.variable("x"), y = Scalar.variable("y");

		it("Names correctly", function() {
			expect(Scalar.variable("x")).toBe(x);
			expect(Scalar.variable("y")).toBe(y);
		});
	});

	describe("Expressions", function() {
		const x = Scalar.variable("x"), y = Scalar.variable("y");
		const two = Scalar.constant(2), three = Scalar.constant(3);

		it("Inherits correctly", function() {
			expect(x.add(two)).toBeInstanceOf(Scalar.Expression);
			expect(x.sub(two)).toBeInstanceOf(Scalar.Expression);
			expect(x.mul(two)).toBeInstanceOf(Scalar.Expression);
			expect(x.div(two)).toBeInstanceOf(Scalar.Expression);
			expect(x.pow(two)).toBeInstanceOf(Scalar.Expression);
		});

		it("Evaluates expressions", function() {
			const e = x.add(two);
			const res1 = e.at(new Map([
				[x, three]
			]));
			expect(res1).toEqual(Scalar.constant(5));
			const res2 = e.at(new Map([
				[x, two]
			]));
			expect(res2).toEqual(Scalar.constant(4));
		});

		it("Checks expression equivalency", function() {
			const e1 = x.add(y).at(new Map([
				[y, two]
			]));
			const e2 = x.add(two);
			expect(e1).toEqual(e2);
		});
	});
});