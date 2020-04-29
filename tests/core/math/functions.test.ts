import * as func from "../../../src/core/math/functions";
import { Scalar } from "../../../src/scalar";
import { Component } from "../../../src/core/math/component";

describe("Checks mathematical functions", function() {
	describe("neg", function() {
		it("Accessor", function() {
			expect(func["neg"]).toBe(func.neg);
		});

		it("Number", function() {
			for(let i = -2; i <= 2; i += 0.1)
				expect(func.neg(i)).toBe(-i);
		});

		it("Constant scalar", function() {
			for(let i = -2; i <= 2; i += 0.1)
				expect(func.neg(Scalar.constant(i))).toBe(Scalar.constant(-i));
		});

		it("Non-constant Scalar", function() {
			const x = Scalar.variable("x");
			expect(func.neg(x)).toBeInstanceOf(Scalar.Expression);
		});
	});

	describe("sin", function() {
		it("Accessor", function() {
			expect(func["sin"]).toBe(func.sin);
		});

		it("Number", function() {
			for(let i = -Math.PI; i <= Math.PI; i += 0.1)
				expect(func.sin(i)).toBeCloseTo(Math.sin(i));
		});

		it("Constant scalar", function() {
			for(let i = -Math.PI; i <= Math.PI; i += 0.1) {
				expect(func.sin(Scalar.constant(i)).value).toBeCloseTo(Math.sin(i));
			}
		});

		it("Non-constant scalar", function() {
			const x = Scalar.variable("x");
			expect(func.sin(x)).toBeInstanceOf(Scalar.Expression);
		});
	});

	describe("cos", function() {
		it("Accessor", function() {
			expect(func["cos"]).toBe(func.cos);
		});

		it("Number", function() {
			for(let i = -Math.PI; i <= Math.PI; i += 0.1)
				expect(func.cos(i)).toBeCloseTo(Math.cos(i));
		});

		it("Constant scalar", function() {
			for(let i = -Math.PI; i <= Math.PI; i += 0.1) {
				expect(func.cos(Scalar.constant(i)).value).toBeCloseTo(Math.cos(i));
			}
		});

		it("Non-constant scalar", function() {
			const x = Scalar.variable("x");
			expect(func.cos(x)).toBeInstanceOf(Scalar.Expression);
		});
	});

	describe("tan", function() {
		it("Accessor", function() {
			expect(func["tan"]).toBe(func.tan);
		});

		it("Number", function() {
			for(let i = 0; i < Math.PI / 2; i += 0.1)
				expect(func.tan(i)).toBeCloseTo(Math.tan(i));
		});

		it("Constant scalar", function() {
			for(let i = 0; i < Math.PI / 2; i += 0.1)
				expect(func.tan(Scalar.constant(i)).value).toBeCloseTo(Math.tan(i));
		});

		it("Non-constant scalar", function() {
			const x = Scalar.variable("x");
			expect(func.tan(x)).toBeInstanceOf(Scalar.Expression);
		});
	});

	describe("asin", function() {
		it("Accessor", function() {
			expect(func["asin"]).toBe(func.asin);
		});

		it("Number", function() {
			for(let i = -1; i <= 1; i += 0.1)
				expect(func.asin(i)).toBeCloseTo(Math.asin(i));
		});

		it("Constant scalar", function() {
			for(let i = -1; i <= 1; i += 0.1)
				expect(func.asin(Scalar.constant(i)).value).toBeCloseTo(Math.asin(i));
		});

		it("Non-constant scalar", function() {
			const x = Scalar.variable("x");
			expect(func.asin(x)).toBeInstanceOf(Scalar.Expression);
		});
	});

	describe("acos", function() {
		it("Accessor", function() {
			expect(func["acos"]).toBe(func.acos);
		});

		it("Number", function() {
			for(let i = -1; i <= 1; i += 0.1)
				expect(func.acos(i)).toBeCloseTo(Math.acos(i));
		});

		it("Constant scalar", function() {
			for(let i = -1; i <= 1; i += 0.1)
				expect(func.acos(Scalar.constant(i)).value).toBeCloseTo(Math.acos(i));
		});

		it("Non-constant scalar", function() {
			const x = Scalar.variable("x");
			expect(func.acos(x)).toBeInstanceOf(Scalar.Expression);
		});
	});

	describe("atan", function() {
		it("Accessor", function() {
			expect(func["atan"]).toBe(func.atan);
		});

		it("Number", function() {
			for(let i = -15; i <= 15; i += 0.1)
				expect(func.atan(i)).toBeCloseTo(Math.atan(i));
		});

		it("Constant scalar", function() {
			for(let i = -15; i <= 15; i += 0.1)
				expect(func.atan(Scalar.constant(i)).value).toBeCloseTo(Math.atan(i));
		});

		it("Non-constant scalar", function() {
			const x = Scalar.variable("x");
			expect(func.atan(x)).toBeInstanceOf(Scalar.Expression);
		});
	});

	describe("sinh", function() {
		it("Accessor", function() {
			expect(func["sinh"]).toBe(func.sinh);
		});

		it("Number", function() {
			for(let i = -20; i <= 20; i += 0.1)
				expect(func.sinh(i)).toBeCloseTo(Math.sinh(i));
		});

		it("Constant scalar", function() {
			for(let i = -20; i <= 20; i += 0.1)
				expect(func.sinh(Scalar.constant(i)).value).toBeCloseTo(Math.sinh(i));
		});

		it("Non-constant scalar", function() {
			const x = Scalar.variable("x");
			expect(func.sinh(x)).toBeInstanceOf(Scalar.Expression);
		});
	});

	describe("cosh", function() {
		it("Accessor", function() {
			expect(func["cosh"]).toBe(func.cosh);
		});

		it("Number", function() {
			for(let i = -20; i <= 20; i += 0.1)
				expect(func.cosh(i)).toBeCloseTo(Math.cosh(i));
		});

		it("Constant scalar", function() {
			for(let i = -20; i <= 20; i += 0.1)
				expect(func.cosh(Scalar.constant(i)).value).toBeCloseTo(Math.cosh(i));
		});

		it("Non-constant scalar", function() {
			const x = Scalar.variable("x");
			expect(func.cosh(x)).toBeInstanceOf(Scalar.Expression);
		});
	});

	describe("tanh", function() {
		it("Accessor", function() {
			expect(func["tanh"]).toBe(func.tanh);
		});

		it("Number", function() {
			for(let i = -20; i <= 20; i += 0.1)
				expect(func.tanh(i)).toBeCloseTo(Math.tanh(i));
		});

		it("Constant scalar", function() {
			for(let i = -20; i <= 20; i += 0.1)
				expect(func.tanh(Scalar.constant(i)).value).toBeCloseTo(Math.tanh(i));
		});

		it("Non-constant scalar", function() {
			const x = Scalar.variable("x");
			expect(func.tanh(x)).toBeInstanceOf(Scalar.Expression);
		});
	});

	describe("asinh", function() {
		it("Accessor", function() {
			expect(func["asinh"]).toBe(func.asinh);
		});

		it("Number", function() {
			for(let i = -100; i <= 100; i += 0.1)
				expect(func.asinh(i)).toBeCloseTo(Math.asinh(i));
		});

		it("Constant scalar", function() {
			for(let i = -100; i <= 100; i += 0.1)
				expect(func.asinh(Scalar.constant(i)).value).toBeCloseTo(Math.asinh(i));
		});

		it("Non-constant scalar", function() {
			const x = Scalar.variable("x");
			expect(func.asinh(x)).toBeInstanceOf(Scalar.Expression);
		});
	});

	describe("acosh", function() {
		it("Accessor", function() {
			expect(func["acosh"]).toBe(func.acosh);
		});

		it("Number", function() {
			for(let i = 1; i <= 100; i += 0.1)
				expect(func.acosh(i)).toBeCloseTo(Math.acosh(i));
		});

		it("Constant scalar", function() {
			for(let i = 1; i <= 100; i += 0.1)
				expect(func.acosh(Scalar.constant(i)).value).toBeCloseTo(Math.acosh(i));
		});

		it("Non-constant scalar", function() {
			const x = Scalar.variable("x");
			expect(func.acosh(x)).toBeInstanceOf(Scalar.Expression);
		});
	});

	describe("atanh", function() {
		it("Accessor", function() {
			expect(func["atanh"]).toBe(func.atanh);
		});

		it("Number", function() {
			for(let i = -1; i <= 1; i += 0.1)
				expect(func.atanh(i)).toBeCloseTo(Math.atanh(i));
		});

		it("Constant scalar", function() {
			for(let i = -1; i <= 1; i += 0.1)
				expect(func.atanh(Scalar.constant(i)).value).toBeCloseTo(Math.atanh(i));
		});

		it("Non-constant scalar", function() {
			const x = Scalar.variable("x");
			expect(func.atanh(x)).toBeInstanceOf(Scalar.Expression);
		});
	});

	describe("log", function() {
		it("Accessor", function() {
			expect(func["log"]).toBe(func.log);
		});

		it("Number", function() {
			for(let i = 10; i > 0; i -= 0.1)
				expect(func.log(i)).toBeCloseTo(Math.log10(i));
		});

		it("Constant scalar", function() {
			for(let i = 10; i > 0; i -= 0.1)
				expect(func.log(Scalar.constant(i)).value).toBeCloseTo(Math.log10(i));
		});

		it("Non-constant scalar", function() {
			const x = Scalar.variable("x");
			expect(func.log(x)).toBeInstanceOf(Scalar.Expression);
		});
	});

	describe("ln", function() {
		it("Accessor", function() {
			expect(func["ln"]).toBe(func.ln);
		});

		it("Number", function() {
			for(let i = 20; i > 0; i -= 0.1)
				expect(func.ln(i)).toBeCloseTo(Math.log(i));
		});

		it("Constant scalar", function() {
			for(let i = 20; i > 0; i -= 0.1)
				expect(func.ln(Scalar.constant(i)).value).toBeCloseTo(Math.log(i));
		});

		it("Non-constant scalar", function() {
			const x = Scalar.variable("x");
			expect(func.ln(x)).toBeInstanceOf(Scalar.Expression);
		});
	});

	describe("exp", function() {
		it("Accessor", function() {
			expect(func["exp"]).toBe(func.exp);
		});

		it("Number", function() {
			for(let i = -10; i <= 10; i += 0.1)
				expect(func.exp(i)).toBeCloseTo(Math.exp(i));
		});

		it("Constant scalar", function() {
			for(let i = -10; i <= 10; i += 0.1)
				expect(func.exp(Scalar.constant(i)).value).toBeCloseTo(Math.exp(i));
		});

		it("Non-constant scalar", function() {
			const x = Scalar.variable("x");
			expect(func.exp(x)).toBeInstanceOf(Scalar.Expression);
		});
	});

	describe("abs", function() {
		it("Accessor", function() {
			expect(func["abs"]).toBe(func.abs);
		});

		it("Number", function() {
			for(let i = -20; i <= 0; i += 0.1)
				expect(func.abs(i)).toBe(-i);
			for(let i = 0; i <= 20; i += 0.1)
				expect(func.abs(i)).toBe(i)
		});

		it("Constant scalar", function() {
			for(let i = -20; i <= 0; i += 0.1)
				expect(func.abs(Scalar.constant(i)).value).toBe(-i);
			for(let i = 0; i <= 20; i += 0.1)
				expect(func.abs(Scalar.constant(i)).value).toBe(i);
		});

		it("Non-constant scalar", function() {
			const x = Scalar.variable("x");
			expect(func.abs(x)).toBeInstanceOf(Scalar.Expression);
		});
	});

	describe("ceil", function() {
		it("Accessor", function() {
			expect(func["ceil"]).toBe(func.ceil);
		});

		it("Number", function() {
			for(let i = -1.99; i <= -1; i += 0.01)
				expect(func.ceil(i)).toBe(-1);
			for(let i = 1.99; i >= 1; i -= 0.01)
				expect(func.ceil(i)).toBe(2);
		});

		it("Constant scalar", function() {
			for(let i = -1.99; i <= -1; i += 0.01)
				expect(func.ceil(Scalar.constant(i)).value).toBe(-1);
			for(let i = 1.99; i >= 1; i -= 0.01)
				expect(func.ceil(Scalar.constant(i)).value).toBe(2);
		});

		it("Non-constant scalar", function() {
			const x = Scalar.variable("x");
			expect(func.ceil(x)).toBeInstanceOf(Scalar.Expression);
		});
	});

	describe("floor", function() {
		it("Accessor", function() {
			expect(func["floor"]).toBe(func.floor);
		});

		it("Number", function() {
			for(let i = -1.99; i <= -1; i += 0.01)
				expect(func.floor(i)).toBe(-2)
			for(let i = 1.99; i >= 1; i -= 0.01)
				expect(func.floor(i)).toBe(1);
		});

		it("Constant scalar", function() {
			for(let i = -1.99; i <= -1; i += 0.01)
				expect(func.floor(Scalar.constant(i)).value).toBe(-2);
			for(let i = 1.99; i >= 1; i -= 0.01)
				expect(func.floor(Scalar.constant(i)).value).toBe(1);
		});

		it("Non-constant scalar", function() {
			const x = Scalar.variable("x");
			expect(func.floor(x)).toBeInstanceOf(Scalar.Expression);
		});
	});
});

describe("Print", function() {
	console.log = jest.fn();
	it("Objects with toString", function() {
		const obj = Component.ONE;
		func.print(obj);
		expect((<jest.Mock>console.log).mock.calls[0][0]).toBe("1.0");
	});

	it("Objects without toString", function() {
		const obj = new (class {
			constructor() {}
		})();
		func.print(obj);
		expect((<jest.Mock>console.log).mock.calls[1][0]).toBe(obj);
	});
});