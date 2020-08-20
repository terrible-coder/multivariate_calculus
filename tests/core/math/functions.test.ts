import * as func from "../../../src/core/math/functions";
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
	});

	describe("sin", function() {
		it("Accessor", function() {
			expect(func["sin"]).toBe(func.sin);
		});

		it("Number", function() {
			for(let i = -Math.PI; i <= Math.PI; i += 0.1)
				expect(func.sin(i)).toBeCloseTo(Math.sin(i));
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
	});

	describe("tan", function() {
		it("Accessor", function() {
			expect(func["tan"]).toBe(func.tan);
		});

		it("Number", function() {
			for(let i = 0; i < Math.PI / 2; i += 0.1)
				expect(func.tan(i)).toBeCloseTo(Math.tan(i));
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
	});

	describe("acos", function() {
		it("Accessor", function() {
			expect(func["acos"]).toBe(func.acos);
		});

		it("Number", function() {
			for(let i = -1; i <= 1; i += 0.1)
				expect(func.acos(i)).toBeCloseTo(Math.acos(i));
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
	});

	describe("sinh", function() {
		it("Accessor", function() {
			expect(func["sinh"]).toBe(func.sinh);
		});

		it("Number", function() {
			for(let i = -20; i <= 20; i += 0.1)
				expect(func.sinh(i)).toBeCloseTo(Math.sinh(i));
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
	});

	describe("tanh", function() {
		it("Accessor", function() {
			expect(func["tanh"]).toBe(func.tanh);
		});

		it("Number", function() {
			for(let i = -20; i <= 20; i += 0.1)
				expect(func.tanh(i)).toBeCloseTo(Math.tanh(i));
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
	});

	describe("acosh", function() {
		it("Accessor", function() {
			expect(func["acosh"]).toBe(func.acosh);
		});

		it("Number", function() {
			for(let i = 1; i <= 100; i += 0.1)
				expect(func.acosh(i)).toBeCloseTo(Math.acosh(i));
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
	});

	describe("log", function() {
		it("Accessor", function() {
			expect(func["log"]).toBe(func.log);
		});

		it("Number", function() {
			for(let i = 10; i > 0; i -= 0.1)
				expect(func.log(i)).toBeCloseTo(Math.log10(i));
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
	});

	describe("exp", function() {
		it("Accessor", function() {
			expect(func["exp"]).toBe(func.exp);
		});

		it("Number", function() {
			for(let i = -10; i <= 10; i += 0.1)
				expect(func.exp(i)).toBeCloseTo(Math.exp(i));
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
	});
});

describe("Print", function() {
	console.log = jest.fn();
	const mockFn = <jest.Mock>console.log;
	const noString = class {
		constructor() {}
	};

	describe("For single parameter", function() {
		it("Objects with toString", function() {
			const obj = Component.ONE;
			func.print(obj);
			expect(mockFn.mock.calls[0][0]).toBe("1.0");
		});
	
		it("Objects without toString", function() {
			const obj = new noString();
			func.print(obj);
			expect(mockFn.mock.calls[1][0]).toBe(obj);
		});
	});

	describe("For double parameters", function() {
		it("both with toString", function() {
			const obj1 = Component.ONE, obj2 = Component.TWO;
			func.print(obj1, obj2);
			expect(mockFn.mock.calls[2]).toEqual(["1.0", "2.0"]);
		});

		it("both without toString", function() {
			const obj1 = new noString(), obj2 = new noString();
			func.print(obj1, obj2);
			expect(mockFn.mock.calls[3]).toEqual([obj1, obj2]);
		});

		it("mixed values", function() {
			const obj1 = Component.SIX, obj2 = new noString();
			func.print(obj1, obj2);
			expect(mockFn.mock.calls[4]).toEqual(["6.0", obj2]);
		});
	});
});