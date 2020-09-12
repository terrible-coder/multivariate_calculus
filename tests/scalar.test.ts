import { Scalar } from "../src/scalar";
import { Component } from "../src/core/math/component";
import { BigNum } from "../src/core/math/bignum";
import { Overwrite } from "../src/core/errors";

function randomDigit() {
	const digit = (10 * Math.random()) | 0;
	return digit.toString();
}

describe("Scalars", function() {
	describe("Creates constants", function() {
		describe("decimal notation", function() {
			test("from 1 real", function() {
				for(let i = 0; i < 100; i++) {
					let rand: number;
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
					const components: string[] = [];
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

		describe("exponential notation", function() {
			describe("from 1 real", function() {
				test("positive exponent", function() {
					for(let i = 0; i < 100; i++) {
						const integers = randomDigit();
						const decimals = new Array(3).fill(0).map(() => randomDigit()).join("");
						const numString = `${integers}.${decimals}e2`;
						const num = Component.create(numString);
						const resultString = integers + decimals.substring(0, 2) + "." + decimals.substring(2);
						expect(Scalar.constant(num).value).toEqual(BigNum.real(resultString));
					}
					for(let i = 0; i < 100; i++) {
						const integers = randomDigit();
						const decimals = new Array(3).fill(0).map(() => randomDigit()).join("");
						const numString = `${integers}.${decimals}e+2`;
						const num = Component.create(numString);
						const resultString = integers + decimals.substring(0, 2) + "." + decimals.substring(2);
						expect(Scalar.constant(num).value).toEqual(BigNum.real(resultString));
					}
				});

				test("negative exponent", function() {
					for(let i = 0; i < 100; i++) {
						const integers = randomDigit();
						const decimals = new Array(3).fill(0).map(() => randomDigit()).join("");
						const numString = `${integers}.${decimals}e-2`;
						const num = Component.create(numString);
						const resultString = "0.0" + integers + decimals;
						expect(Scalar.constant(num).value).toEqual(BigNum.real(resultString));
					}
				});
			});
		});

		describe("from 5 real", function() {
			test("positive exponent", function() {
				for(let i = 0; i < 100; i++) {
					const components: string[] = [];
					const result = [];
					for(let j = 0; j < 5; j++) {
						const integers = randomDigit();
						const decimals = new Array(3).fill(0).map(() => randomDigit()).join("");
						const numString = `${integers}.${decimals}e2`;
						components.push(numString);
						result.push(integers + decimals.substring(0, 2) + "." + decimals.substring(2));
					}
					const num = BigNum.hyper(components);
					const res = BigNum.hyper(result);
					expect(Scalar.constant(num).value).toEqual(res);
				}
				for(let i = 0; i < 100; i++) {
					const components: string[] = [];
					const result = [];
					for(let j = 0; j < 5; j++) {
						const integers = randomDigit();
						const decimals = new Array(3).fill(0).map(() => randomDigit()).join("");
						const numString = `${integers}.${decimals}e+2`;
						components.push(numString);
						result.push(integers + decimals.substring(0, 2) + "." + decimals.substring(2));
					}
					const num = BigNum.hyper(components);
					const res = BigNum.hyper(result);
					expect(Scalar.constant(num).value).toEqual(res);
				}
			});

			test("negative exponent", function() {
				for(let i = 0; i < 100; i++) {
					const components: string[] = [];
					const result = [];
					for(let j = 0; j < 5; j++) {
						const integers = randomDigit();
						const decimals = new Array(3).fill(0).map(() => randomDigit()).join("");
						const numString = `${integers}.${decimals}e-2`;
						components.push(numString);
						result.push("0.0" + integers + decimals);
					}
					const num = BigNum.hyper(components);
					const res = BigNum.hyper(result);
					expect(Scalar.constant(num).value).toEqual(res);
				}
			});
		});
	
		test("from numbers", function() {
			for(let i = 0; i < 10; i++) {
				expect(Scalar.constant(i)).toBeInstanceOf(Scalar.Constant);
				expect(Scalar.constant(i).value).toEqual(BigNum.real(i));
			}
		});

		test("from array of numbers", function() {
			for(let i = 0; i < 10; i++) {
				const a = new Array(i+1).fill(0).map(() => (10 * Math.random()) | 0);
				expect(Scalar.constant(a)).toBeInstanceOf(Scalar.Constant);
				expect(Scalar.constant(a).value).toEqual(BigNum.hyper(a));
			}
		});

		test("from array of strings", function() {
			for(let i = 0; i < 10; i++) {
				const a = new Array(i+1).fill(0).map(() => (10 * Math.random()).toString());
				expect(Scalar.constant(a)).toBeInstanceOf(Scalar.Constant);
				expect(Scalar.constant(a).value).toEqual(BigNum.hyper(a));
			}
		});

		test("from Components", function() {
			for(let i = 0; i < 10; i++) {
				const a = Component.create(i);
				expect(Scalar.constant(a)).toBeInstanceOf(Scalar.Constant);
				expect(Scalar.constant(a).value).toEqual(new BigNum(a));
			}
		});

		test("from BigNum", function() {
			for(let i = 0; i < 10; i++) {
				const comps = new Array(i+1).fill(0).map(() => (10 * Math.random()) | 0);
				const a = BigNum.hyper(comps);  
				expect(Scalar.constant(a)).toBeInstanceOf(Scalar.Constant);
				expect(Scalar.constant(a).value).toEqual(a);
			}
		});
	});

	describe("Constants", function() {
		const a = Scalar.constant(2, "a"), b = Scalar.constant(3, "b");

		it("has naming system", function() {
			expect(a).not.toBe(Scalar.constant(2));
		});

		describe("Names correctly", function() {
	
			test("for numbers", function() {
				const name = "A";
				const A = Scalar.constant(5, name);
				expect(Scalar.constant(name)).toBe(A);
				expect(() => Scalar.constant(1, name)).toThrow(Overwrite);
			});
	
			test("for array of numbers", function() {
				const name = "B";
				const B = Scalar.constant([5, 2, 1], name);
				expect(Scalar.constant(name)).toBe(B);
				expect(() => Scalar.constant(["1"], name)).toThrow(Overwrite);
			});
	
			test("for array of strings", function() {
				const name = "C";
				const C = Scalar.constant(["5", "-1", "3"], name);
				expect(Scalar.constant(name)).toBe(C);
				expect(() => Scalar.constant([1, -1, 0, -4], name)).toThrow(Overwrite);
			});
	
			test("for Components", function() {
				const name = "D";
				const D = Scalar.constant(Component.create(-5), name);
				expect(Scalar.constant(name)).toBe(D);
				expect(() => Scalar.constant(1, name)).toThrow(Overwrite);
			});
	
			test("for BigNum", function() {
				const name = "E";
				const E = Scalar.constant(BigNum.complex("15", "21"), name);
				expect(Scalar.constant(name)).toBe(E);
				expect(() => Scalar.constant(1, name)).toThrow(Overwrite);
			});
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

		it("Exponentiates", function() {
			const res = a.pow(b);
			expect(res).toEqual(Scalar.constant(8));
			expect(a.pow(Scalar.ZERO)).toEqual(Scalar.constant(1));
			expect(() => Scalar.ZERO.pow(Scalar.ZERO)).toThrowError("0 raised to the power 0");
		});
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