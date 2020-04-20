import { math } from "../../../src/core/math/math";
import { Scalar } from "../../../src/scalar";

describe("Checks mathematical functions", function() {
	describe("neg", function() {
		it("Accessor", function() {
			expect(math["neg"]).toBe(math.neg);
		});

		it("Number", function() {
			for(let i = -2; i <= 2; i += 0.1)
				expect(math.neg(i)).toBe(-i);
		});

		it("Constant scalar", function() {
			for(let i = -2; i <= 2; i += 0.1)
				expect(math.neg(Scalar.constant(i))).toBe(Scalar.constant(-i));
		});

		it("Non-constant Scalar", function() {
			const x = Scalar.variable("x");
			expect(math.neg(x)).toBeInstanceOf(Scalar.Expression);
		});
	});

	describe("sin", function() {
		it("Accessor", function() {
			expect(math["sin"]).toBe(math.sin);
		});

		it("Number", function() {
			for(let i = -Math.PI; i <= Math.PI; i += 0.1)
				expect(math.sin(i)).toBeCloseTo(Math.sin(i));
		});

		it("Constant scalar", function() {
			for(let i = -Math.PI; i <= Math.PI; i += 0.1) {
				expect(math.sin(Scalar.constant(i)).value).toBeCloseTo(Math.sin(i));
			}
		});

		it("Non-constant scalar", function() {
			const x = Scalar.variable("x");
			expect(math.sin(x)).toBeInstanceOf(Scalar.Expression);
		});
	});

	describe("cos", function() {
		it("Accessor", function() {
			expect(math["cos"]).toBe(math.cos);
		});

		it("Number", function() {
			for(let i = -Math.PI; i <= Math.PI; i += 0.1)
				expect(math.cos(i)).toBeCloseTo(Math.cos(i));
		});

		it("Constant scalar", function() {
			for(let i = -Math.PI; i <= Math.PI; i += 0.1) {
				expect(math.cos(Scalar.constant(i)).value).toBeCloseTo(Math.cos(i));
			}
		});

		it("Non-constant scalar", function() {
			const x = Scalar.variable("x");
			expect(math.cos(x)).toBeInstanceOf(Scalar.Expression);
		});
	});

	describe("tan", function() {
		it("Accessor", function() {
			expect(math["tan"]).toBe(math.tan);
		});

		it("Number", function() {
			for(let i = 0; i < Math.PI / 2; i += 0.1)
				expect(math.tan(i)).toBeCloseTo(Math.tan(i));
		});

		it("Constant scalar", function() {
			for(let i = 0; i < Math.PI / 2; i += 0.1)
				expect(math.tan(Scalar.constant(i)).value).toBeCloseTo(Math.tan(i));
		});

		it("Non-constant scalar", function() {
			const x = Scalar.variable("x");
			expect(math.tan(x)).toBeInstanceOf(Scalar.Expression);
		});
	});

	describe("asin", function() {
		it("Accessor", function() {
			expect(math["asin"]).toBe(math.asin);
		});

		it("Number", function() {
			for(let i = -1; i <= 1; i += 0.1)
				expect(math.asin(i)).toBeCloseTo(Math.asin(i));
		});

		it("Constant scalar", function() {
			for(let i = -1; i <= 1; i += 0.1)
				expect(math.asin(Scalar.constant(i)).value).toBeCloseTo(Math.asin(i));
		});

		it("Non-constant scalar", function() {
			const x = Scalar.variable("x");
			expect(math.asin(x)).toBeInstanceOf(Scalar.Expression);
		});
	});

	describe("acos", function() {
		it("Accessor", function() {
			expect(math["acos"]).toBe(math.acos);
		});

		it("Number", function() {
			for(let i = -1; i <= 1; i += 0.1)
				expect(math.acos(i)).toBeCloseTo(Math.acos(i));
		});

		it("Constant scalar", function() {
			for(let i = -1; i <= 1; i += 0.1)
				expect(math.acos(Scalar.constant(i)).value).toBeCloseTo(Math.acos(i));
		});

		it("Non-constant scalar", function() {
			const x = Scalar.variable("x");
			expect(math.acos(x)).toBeInstanceOf(Scalar.Expression);
		});
	});

	describe("atan", function() {
		it("Accessor", function() {
			expect(math["atan"]).toBe(math.atan);
		});

		it("Number", function() {
			for(let i = -15; i <= 15; i += 0.1)
				expect(math.atan(i)).toBeCloseTo(Math.atan(i));
		});

		it("Constant scalar", function() {
			for(let i = -15; i <= 15; i += 0.1)
				expect(math.atan(Scalar.constant(i)).value).toBeCloseTo(Math.atan(i));
		});

		it("Non-constant scalar", function() {
			const x = Scalar.variable("x");
			expect(math.atan(x)).toBeInstanceOf(Scalar.Expression);
		});
	});

	describe("sinh", function() {
		it("Accessor", function() {
			expect(math["sinh"]).toBe(math.sinh);
		});

		it("Number", function() {
			for(let i = -20; i <= 20; i += 0.1)
				expect(math.sinh(i)).toBeCloseTo(Math.sinh(i));
		});

		it("Constant scalar", function() {
			for(let i = -20; i <= 20; i += 0.1)
				expect(math.sinh(Scalar.constant(i)).value).toBeCloseTo(Math.sinh(i));
		});

		it("Non-constant scalar", function() {
			const x = Scalar.variable("x");
			expect(math.sinh(x)).toBeInstanceOf(Scalar.Expression);
		});
	});

	describe("cosh", function() {
		it("Accessor", function() {
			expect(math["cosh"]).toBe(math.cosh);
		});

		it("Number", function() {
			for(let i = -20; i <= 20; i += 0.1)
				expect(math.cosh(i)).toBeCloseTo(Math.cosh(i));
		});

		it("Constant scalar", function() {
			for(let i = -20; i <= 20; i += 0.1)
				expect(math.cosh(Scalar.constant(i)).value).toBeCloseTo(Math.cosh(i));
		});

		it("Non-constant scalar", function() {
			const x = Scalar.variable("x");
			expect(math.cosh(x)).toBeInstanceOf(Scalar.Expression);
		});
	});

	describe("tanh", function() {
		it("Accessor", function() {
			expect(math["tanh"]).toBe(math.tanh);
		});

		it("Number", function() {
			for(let i = -20; i <= 20; i += 0.1)
				expect(math.tanh(i)).toBeCloseTo(Math.tanh(i));
		});

		it("Constant scalar", function() {
			for(let i = -20; i <= 20; i += 0.1)
				expect(math.tanh(Scalar.constant(i)).value).toBeCloseTo(Math.tanh(i));
		});

		it("Non-constant scalar", function() {
			const x = Scalar.variable("x");
			expect(math.tanh(x)).toBeInstanceOf(Scalar.Expression);
		});
	});

	describe("asinh", function() {
		it("Accessor", function() {
			expect(math["asinh"]).toBe(math.asinh);
		});

		it("Number", function() {
			for(let i = -100; i <= 100; i += 0.1)
				expect(math.asinh(i)).toBeCloseTo(Math.asinh(i));
		});

		it("Constant scalar", function() {
			for(let i = -100; i <= 100; i += 0.1)
				expect(math.asinh(Scalar.constant(i)).value).toBeCloseTo(Math.asinh(i));
		});

		it("Non-constant scalar", function() {
			const x = Scalar.variable("x");
			expect(math.asinh(x)).toBeInstanceOf(Scalar.Expression);
		});
	});

	describe("acosh", function() {
		it("Accessor", function() {
			expect(math["acosh"]).toBe(math.acosh);
		});

		it("Number", function() {
			for(let i = 1; i <= 100; i += 0.1)
				expect(math.acosh(i)).toBeCloseTo(Math.acosh(i));
		});

		it("Constant scalar", function() {
			for(let i = 1; i <= 100; i += 0.1)
				expect(math.acosh(Scalar.constant(i)).value).toBeCloseTo(Math.acosh(i));
		});

		it("Non-constant scalar", function() {
			const x = Scalar.variable("x");
			expect(math.acosh(x)).toBeInstanceOf(Scalar.Expression);
		});
	});

	describe("atanh", function() {
		it("Accessor", function() {
			expect(math["atanh"]).toBe(math.atanh);
		});

		it("Number", function() {
			for(let i = -1; i <= 1; i += 0.1)
				expect(math.atanh(i)).toBeCloseTo(Math.atanh(i));
		});

		it("Constant scalar", function() {
			for(let i = -1; i <= 1; i += 0.1)
				expect(math.atanh(Scalar.constant(i)).value).toBeCloseTo(Math.atanh(i));
		});

		it("Non-constant scalar", function() {
			const x = Scalar.variable("x");
			expect(math.atanh(x)).toBeInstanceOf(Scalar.Expression);
		});
	});

	describe("log", function() {
		it("Accessor", function() {
			expect(math["log"]).toBe(math.log);
		});

		it("Number", function() {
			for(let i = 10; i > 0; i -= 0.1)
				expect(math.log(i)).toBeCloseTo(Math.log10(i));
		});

		it("Constant scalar", function() {
			for(let i = 10; i > 0; i -= 0.1)
				expect(math.log(Scalar.constant(i)).value).toBeCloseTo(Math.log10(i));
		});

		it("Non-constant scalar", function() {
			const x = Scalar.variable("x");
			expect(math.log(x)).toBeInstanceOf(Scalar.Expression);
		});
	});

	describe("ln", function() {
		it("Accessor", function() {
			expect(math["ln"]).toBe(math.ln);
		});

		it("Number", function() {
			for(let i = 20; i > 0; i -= 0.1)
				expect(math.ln(i)).toBeCloseTo(Math.log(i));
		});

		it("Constant scalar", function() {
			for(let i = 20; i > 0; i -= 0.1)
				expect(math.ln(Scalar.constant(i)).value).toBeCloseTo(Math.log(i));
		});

		it("Non-constant scalar", function() {
			const x = Scalar.variable("x");
			expect(math.ln(x)).toBeInstanceOf(Scalar.Expression);
		});
	});

	describe("exp", function() {
		it("Accessor", function() {
			expect(math["exp"]).toBe(math.exp);
		});

		it("Number", function() {
			for(let i = -10; i <= 10; i += 0.1)
				expect(math.exp(i)).toBeCloseTo(Math.exp(i));
		});

		it("Constant scalar", function() {
			for(let i = -10; i <= 10; i += 0.1)
				expect(math.exp(Scalar.constant(i)).value).toBeCloseTo(Math.exp(i));
		});

		it("Non-constant scalar", function() {
			const x = Scalar.variable("x");
			expect(math.exp(x)).toBeInstanceOf(Scalar.Expression);
		});
	});

	describe("sqrt", function() {
		it("Accessor", function() {
			expect(math["sqrt"]).toBe(math.sqrt);
		});

		it("Number", function() {
			for(let i = 0; i <= 25; i += 0.1)
				expect(math.sqrt(i)).toBeCloseTo(Math.sqrt(i));
		});

		it("Constant scalar", function() {
			for(let i = 0; i <= 25; i += 0.1)
				expect(math.sqrt(Scalar.constant(i)).value).toBeCloseTo(Math.sqrt(i));
		});

		it("Non-constant scalar", function() {
			const x = Scalar.variable("x");
			expect(math.sqrt(x)).toBeInstanceOf(Scalar.Expression);
		});
	});

	describe("abs", function() {
		it("Accessor", function() {
			expect(math["abs"]).toBe(math.abs);
		});

		it("Number", function() {
			for(let i = -20; i <= 0; i += 0.1)
				expect(math.abs(i)).toBe(-i);
			for(let i = 0; i <= 20; i += 0.1)
				expect(math.abs(i)).toBe(i)
		});

		it("Constant scalar", function() {
			for(let i = -20; i <= 0; i += 0.1)
				expect(math.abs(Scalar.constant(i)).value).toBe(-i);
			for(let i = 0; i <= 20; i += 0.1)
				expect(math.abs(Scalar.constant(i)).value).toBe(i);
		});

		it("Non-constant scalar", function() {
			const x = Scalar.variable("x");
			expect(math.abs(x)).toBeInstanceOf(Scalar.Expression);
		});
	});

	describe("ceil", function() {
		it("Accessor", function() {
			expect(math["ceil"]).toBe(math.ceil);
		});

		it("Number", function() {
			for(let i = -1.99; i <= -1; i += 0.01)
				expect(math.ceil(i)).toBe(-1);
			for(let i = 1.99; i >= 1; i -= 0.01)
				expect(math.ceil(i)).toBe(2);
		});

		it("Constant scalar", function() {
			for(let i = -1.99; i <= -1; i += 0.01)
				expect(math.ceil(Scalar.constant(i)).value).toBe(-1);
			for(let i = 1.99; i >= 1; i -= 0.01)
				expect(math.ceil(Scalar.constant(i)).value).toBe(2);
		});

		it("Non-constant scalar", function() {
			const x = Scalar.variable("x");
			expect(math.ceil(x)).toBeInstanceOf(Scalar.Expression);
		});
	});

	describe("floor", function() {
		it("Accessor", function() {
			expect(math["floor"]).toBe(math.floor);
		});

		it("Number", function() {
			for(let i = -1.99; i <= -1; i += 0.01)
				expect(math.floor(i)).toBe(-2)
			for(let i = 1.99; i >= 1; i -= 0.01)
				expect(math.floor(i)).toBe(1);
		});

		it("Constant scalar", function() {
			for(let i = -1.99; i <= -1; i += 0.01)
				expect(math.floor(Scalar.constant(i)).value).toBe(-2);
			for(let i = 1.99; i >= 1; i -= 0.01)
				expect(math.floor(Scalar.constant(i)).value).toBe(1);
		});

		it("Non-constant scalar", function() {
			const x = Scalar.variable("x");
			expect(math.floor(x)).toBeInstanceOf(Scalar.Expression);
		});
	});
});