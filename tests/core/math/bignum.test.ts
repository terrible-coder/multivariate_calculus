import { BigNum } from "../../../src/core/math/bignum";
import { IndeterminateForm, DivisionByZero } from "../../../src/core/errors";
import { RoundingMode, MathContext } from "../../../src/core/math/context";

describe("Integer numbers", function() {
	const a = new BigNum("144");
	const b = new BigNum("-12");
	describe("Creates new numbers", function() {
		const st = "100.0";
		it("from number", function() {
			const num = 100;
			const bnum = new BigNum(num);
			expect(bnum.toString()).toBe(st);
		});
		
		describe("from string", function() {
			it("Decimal form", function() {
				const num = "100";
				const bnum = new BigNum(num);
				expect(bnum.toString()).toBe(st);
			});

			it("Scientific form", function() {
				const num = "1e2";
				const bnum = new BigNum(num);
				expect(bnum.toString()).toBe(st);
			});
		});

		it("from integer and fractional parts", function() {
			const bnum = new BigNum("100", "0");
			expect(bnum.toString()).toBe(st);
		});
	});

	it("Checks for equality", function() {
		const A = new BigNum("20");
		const B = new BigNum("20.1");
		expect(A.equals(B)).toBe(false);
		expect(A.equals(B, {
			precision: 0,
			rounding: RoundingMode.HALF_UP
		})).toBe(true);
	});

	it("Adds numbers", function() {
		expect(a.add(b)).toEqual(new BigNum("132"));
	});

	it("Subtracts numbers", function() {
		expect(a.sub(b)).toEqual(new BigNum("156"));
	});

	it("Multiplies numbers", function() {
		expect(a.mul(b)).toEqual(new BigNum("-1728"));
	});

	it("Divides numbers", function() {
		expect(a.div(b)).toEqual(new BigNum("-12"));
	});

	it("Raises to integer powers", function() {
		expect(BigNum.intpow(b, 2)).toEqual(a);
		const temp = Math.pow(-12, 2);
		console.log(temp);
		expect(BigNum.intpow(b, 3)).toEqual(new BigNum("-1728"));
	});

	it("Computes absolute value", function() {
		expect(BigNum.abs(a)).toEqual(a);
		expect(BigNum.abs(b)).toEqual(new BigNum("12"));
	});
});

describe("Decimal numbers", function() {
	const a = new BigNum("0.144");
	const b = new BigNum("1.2");
	describe("Creates new numbers", function() {
		const st = "40.01";
		it("from number", function() {
			const num = 40.01;
			const bnum = new BigNum(num);
			expect(bnum.toString()).toBe(st);
		});

		describe("from string", function() {
			it("Decimal form", function() {
				const num = "40.01";
				const bnum = new BigNum(num);
				expect(bnum.toString()).toBe(st);
			});

			it("Scientific form", function() {
				const num1 = "4.001e1", num2 = "4001e-2";
				const bnum1 = new BigNum(num1), bnum2 = new BigNum(num2);
				expect(bnum1.toString()).toBe(st);
				expect(bnum2.toString()).toBe(st);
			});
		});

		it("from integer and fractional parts", function() {
			const bnum = new BigNum("40", "01");
			expect(bnum.toString()).toBe(st);
		});
	});

	it("Adds numbers", function() {
		expect(a.add(b)).toEqual(new BigNum("1.344"));
	});

	it("Subtracts numbers", function() {
		expect(a.sub(b)).toEqual(new BigNum("-1.056"));
	});

	it("Multiplies numbers", function() {
		expect(a.mul(b)).toEqual(new BigNum("0.1728"));
	});

	it("Divides numbers", function() {
		expect(a.div(b)).toEqual(new BigNum("0.12"));
	});

	it("Raises to integer powers", function() {
		expect(BigNum.intpow(b, 2)).toEqual(new BigNum("1.44"));
		expect(BigNum.intpow(b, 3)).toEqual(new BigNum("1.728"));
	});
});

describe("Mixed values", function() {
	it("Addition", function() {
		const a = new BigNum("120");
		const b = new BigNum("0.123");
		expect(a.add(b)).toEqual(new BigNum("120.123"));
	});

	it("Division", function() {
		const a = new BigNum("10000");
		const b = new BigNum("1");
		expect(b.div(a)).toEqual(new BigNum("0.0001"));
		const a1 = new BigNum("0.0001");
		const b1 = new BigNum("1");
		expect(a1.div(b1, {
			precision: 2,
			rounding: RoundingMode.HALF_UP
		})).toEqual(new BigNum("0"));
	});
});

describe("Throws appropriate errors", function() {
	const zero = new BigNum("0");
	it("Division by zero", function() {
		expect(() => new BigNum("1").div(zero)).toThrowError(new DivisionByZero("Cannot divide by zero."));
		expect(() => zero.div(zero)).toThrowError(new IndeterminateForm("Cannot determine 0/0."));
	});

	it("Illegal number format", function() {
		expect(() => new BigNum("1.1.1")).toThrowError(TypeError);
	});
});

/*
 * These tests have been based on the rounding algorithms defined by JAVA.
 * To see all the rounding possibilities and read more about them go to
 * https://docs.oracle.com/javase/8/docs/api/java/math/RoundingMode.html
 */
describe("Rounds", function() {
	const a = ["5.5", "2.5", "1.6", "1.1", "1.0", "-1.0", "-1.1", "-1.6", "-2.5", "-5.5"];
	it("Up", function() {
		const b = ["6", "3", "2", "2", "1", "-1", "-2", "-2", "-3", "-6"];
		const context = {
			precision: 0,
			rounding: RoundingMode.UP
		};
		for(let i = 0; i < 10; i++) {
			const x = BigNum.round(new BigNum(a[i]), context);
			expect(x).toEqual(new BigNum(b[i]));
		}
	});

	it("Down", function() {
		const b = ["5", "2", "1", "1", "1", "-1", "-1", "-1", "-2", "-5"];
		const context = {
			precision: 0,
			rounding: RoundingMode.DOWN
		};
		for(let i = 0; i < 10; i++) {
			const x = BigNum.round(new BigNum(a[i]), context);
			expect(x).toEqual(new BigNum(b[i]));
		}
	});

	it("Ceiling", function() {
		const b = ["6", "3", "2", "2", "1", "-1", "-1", "-1", "-2", "-5"];
		const context = {
			precision: 0,
			rounding: RoundingMode.CEIL
		};
		for(let i = 0; i < 10; i++) {
			const x = BigNum.round(new BigNum(a[i]), context);
			expect(x).toEqual(new BigNum(b[i]));
		}
	});

	it("Floor", function() {
		const b = ["5", "2", "1", "1", "1", "-1", "-2", "-2", "-3", "-6"];
		const context = {
			precision: 0,
			rounding: RoundingMode.FLOOR
		};
		for(let i = 0; i < 10; i++) {
			const x = BigNum.round(new BigNum(a[i]), context);
			expect(x).toEqual(new BigNum(b[i]));
		}
	});

	it("Half up", function() {
		const b = ["6", "3", "2", "1", "1", "-1", "-1", "-2", "-3", "-6"];
		const context = {
			precision: 0,
			rounding: RoundingMode.HALF_UP
		};
		for(let i = 0; i < 10; i++) {
			const x = BigNum.round(new BigNum(a[i]), context);
			expect(x).toEqual(new BigNum(b[i]));
		}
	});

	it("Half down", function() {
		const b = ["5", "2", "2", "1", "1", "-1", "-1", "-2", "-2", "-5"];
		const context = {
			precision: 0,
			rounding: RoundingMode.HALF_DOWN
		};
		for(let i = 0; i < 10; i++) {
			const x = BigNum.round(new BigNum(a[i]), context);
			expect(x).toEqual(new BigNum(b[i]));
		}
	});

	it("Half even", function() {
		const b = ["6", "2", "2", "1", "1", "-1", "-1", "-2", "-2", "-6"];
		const context = {
			precision: 0,
			rounding: RoundingMode.HALF_EVEN
		};
		for(let i = 0; i < 10; i++) {
			const x = BigNum.round(new BigNum(a[i]), context);
			expect(x).toEqual(new BigNum(b[i]));
		}
	});

	it("Unnecesary", function() {
		const context: MathContext = {
			precision: 0,
			rounding: RoundingMode.UNNECESSARY
		};
		for(let i = 0; i < 10; i++) {
			const x = new BigNum(a[i]);
			if(a[i] == "1.0")
				expect(BigNum.round(x, context)).toEqual(new BigNum("1"));
			else if(a[i] == "-1.0")
				expect(BigNum.round(x, context)).toEqual(new BigNum("-1"));
			else
				expect(() => BigNum.round(x, context)).toThrow();
		}
	});
});

describe("Comparison", function() {
	it("Compares integers", function() {
		const a = new BigNum("1");
		const b = new BigNum("2");
		expect(a.compareTo(b)).toBe(-1);
		expect(b.compareTo(a)).toBe(1);
	});

	it("Compares fractions", function() {
		const a = new BigNum("0.25");
		const b = new BigNum("0.26");
		expect(a.compareTo(b)).toBe(-1);
		expect(b.compareTo(a)).toBe(1);
	});

	it("Compares mixed fractions", function() {
		const a = new BigNum("1.23");
		const b = new BigNum("1.234");
		expect(a.compareTo(b)).toBe(-1);
		expect(b.compareTo(a)).toBe(1);
	});

	it("Checks equality", function() {
		const a = new BigNum("4.75");
		const b = new BigNum("4.75");
		expect(a.compareTo(b)).toBe(0);
		expect(b.compareTo(a)).toBe(0);
	});

	it("Compares numerically equivalent values", function() {
		const a = new BigNum("3.22");
		const b = new BigNum("0.322");
		expect(a.compareTo(b)).not.toBe(0);
	});
});

describe("Modulus", function() {
	it("Integers", function() {
		for(let i = 1; i <= 100; i++) {
			const x = new BigNum(i);
			expect(x.mod(BigNum.SEVEN)).toEqual(new BigNum(i%7));
		}
	});

	it("Decimals", function() {
		let x = BigNum.FIVE.pow(new BigNum("0.5"));
		const y = x.sub(BigNum.TWO);
		for(let i = 0; i < 10; i++) {
			expect(x.mod(BigNum.TWO)).toEqual(y);
			x = x.add(BigNum.TWO);
		}
	});
});

describe("Trigonometry", function() {
	const context = MathContext.HIGH_PRECISION;
	describe("sine", function() {
		it("Multiples of pi", function() {
			for(let n = BigNum.ZERO; n.lessEquals(BigNum.NINE); n = n.add(BigNum.ONE)) {
				const x = n.mul(BigNum.PI, context);
				expect(BigNum.sin(x)).toEqual(BigNum.ZERO);
			}
		});

		it("Odd multiples of pi/2", function() {
			const piby2 = BigNum.PI.div(BigNum.TWO);
			let even = true;
			for(let n = BigNum.ZERO; n.lessEquals(BigNum.NINE); n = n.add(BigNum.ONE)) {
				const f = BigNum.TWO.mul(n).add(BigNum.ONE);
				const x = f.mul(piby2);
				if(even)
					expect(BigNum.sin(x)).toEqual(BigNum.ONE);
				else
					expect(BigNum.sin(x)).toEqual(BigNum.ONE.neg);
				even = !even;
			}
		});
	});

	describe("cosine", function() {
		it("Multiples of pi", function() {
			let even = true;
			for(let n = BigNum.ZERO; n.lessEquals(BigNum.NINE); n = n.add(BigNum.ONE)) {
				const x = n.mul(BigNum.PI);
				if(even)
					expect(BigNum.cos(x)).toEqual(BigNum.ONE);
				else
					expect(BigNum.cos(x)).toEqual(BigNum.ONE.neg);
				even = !even;
			}
		});

		it("Odd multiples of pi/2", function() {
			const piby2 = BigNum.PI.div(BigNum.TWO, context);
			for(let n = BigNum.ZERO; n.lessEquals(BigNum.NINE); n = n.add(BigNum.ONE)) {
				const f = BigNum.TWO.mul(n).add(BigNum.ONE);
				const x = f.mul(piby2, context);
				expect(BigNum.cos(x)).toEqual(BigNum.ZERO);
			}
		});
	});

	describe("arcsin", function() {
		const piby2 = BigNum.PI.div(BigNum.TWO);
		it("zero", function() {
			expect(BigNum.asin(BigNum.ZERO)).toEqual(BigNum.ZERO);
		});

		it("positive one", function() {
			expect(BigNum.asin(BigNum.ONE)).toEqual(piby2);
		});

		it("negative one", function() {
			expect(BigNum.asin(BigNum.ONE.neg)).toEqual(piby2.neg);
		});
	});

	describe("arccos", function() {
		const piby2 = BigNum.PI.div(BigNum.TWO);
		it("zero", function() {
			expect(BigNum.acos(BigNum.ZERO)).toEqual(piby2);
		});

		it("positive one", function() {
			expect(BigNum.acos(BigNum.ONE)).toEqual(BigNum.ZERO);
		});

		it("negative one", function() {
			expect(BigNum.acos(BigNum.ONE.neg)).toEqual(BigNum.round(BigNum.PI, BigNum.MODE));
		});
	});

	describe("arctan", function() {
		it("zero", function() {
			expect(BigNum.atan(BigNum.ZERO)).toEqual(BigNum.ZERO);
		});

		it("1/root3", function() {
			const root3 = BigNum.THREE.pow(new BigNum("-0.5"));
			expect(BigNum.atan(root3)).toEqual(BigNum.PI.div(BigNum.SIX));
		});

		it("root3", function() {
			const root3 = BigNum.THREE.pow(new BigNum("0.5"));
			expect(BigNum.atan(root3)).toEqual(BigNum.PI.div(BigNum.THREE));
		});
	});
});

describe("Hyperbolic trigonometric", function() {
	it("sinh", function() {
		let x = BigNum.ZERO;
		const alsosinh = (x: BigNum) => {
			const ctx = MathContext.HIGH_PRECISION;
			const a = BigNum.exp(x, ctx), b = BigNum.exp(x.neg, ctx);
			const c = a.sub(b, ctx);
			const res = c.div(BigNum.TWO, ctx);
			return BigNum.round(res, BigNum.MODE);
		}
		for(let i = 0; i < 100; i++) {
			expect(BigNum.sinh(x)).toEqual(alsosinh(x));
			x = x.add(new BigNum("0.01"));
		}
	});

	it("cosh", function() {
		let x = BigNum.ZERO;
		const alsocosh = (x: BigNum) => {
			const ctx = MathContext.HIGH_PRECISION;
			const a = BigNum.exp(x, ctx), b = BigNum.exp(x.neg, ctx);
			const c = a.add(b, ctx);
			const res = c.div(BigNum.TWO, ctx);
			return BigNum.round(res, BigNum.MODE);
		}
		for(let i = 0; i < 100; i++) {
			expect(BigNum.cosh(x)).toEqual(alsocosh(x));
			x = x.add(new BigNum("0.01"));
		}
	});

	it("tanh", function() {
		let x = BigNum.ZERO;
		const alsotanh = (x: BigNum) => {
			const ctx = MathContext.HIGH_PRECISION;
			const a = BigNum.exp(x, ctx), b = BigNum.exp(x.neg, ctx);
			const res = a.sub(b, ctx).div(a.add(b, ctx), ctx);
			return BigNum.round(res, BigNum.MODE);
		}
		for(let i = 0; i < 100; i++) {
			expect(BigNum.tanh(x)).toEqual(alsotanh(x));
			x = x.add(new BigNum("0.01"));
		}
	});

	it("asinh", function() {
		let x = BigNum.ZERO;
		const alsoashinh = (x: BigNum) => {
			const ctx = MathContext.HIGH_PRECISION;
			const a = x.mul(x, ctx).add(BigNum.ONE).pow(new BigNum("0.5"), ctx);
			const b = x.add(a, ctx);
			return BigNum.ln(b);
		}
		for(let i = 0; i < 100; i++) {
			console.log("For i =", i);
			expect(BigNum.asinh(x)).toEqual(alsoashinh(x));
			x = x.add(new BigNum("0.01"));
		}
	});

	it("arctanh", function() {
		let x = BigNum.ZERO;
		const alsoatanh = (x: BigNum) => {
			const ctx = MathContext.HIGH_PRECISION;
			const a = BigNum.ONE.add(x, ctx);
			const b = BigNum.ONE.sub(x, ctx);
			const c = BigNum.ln(a.div(b, ctx), ctx);
			return c.div(BigNum.TWO);
		}
		for(let i = 0; i < 10; i++) {
			expect(BigNum.atanh(x)).toEqual(alsoatanh(x));
			x = x.add(new BigNum("0.01"));
		}
	});
});

describe("Exponent", function() {
	it("exp", function() {
		expect(BigNum.exp(BigNum.ZERO)).toEqual(BigNum.ONE);
		expect(BigNum.exp(BigNum.ONE)).toEqual(BigNum.round(BigNum.E, BigNum.MODE));
		expect(BigNum.exp(BigNum.TWO)).toEqual(BigNum.E.mul(BigNum.E));
	});

	it("power", function() {
		expect(BigNum.TWO.pow(BigNum.TWO)).toEqual(BigNum.FOUR);
	});
});


describe("Logarithm", function() {
	it("ln", function() {
		const e_inv = BigNum.ONE.div(BigNum.E, MathContext.HIGH_PRECISION);
		expect(BigNum.ln(e_inv)).toEqual(BigNum.ONE.neg);
		expect(BigNum.ln(BigNum.E)).toEqual(BigNum.ONE);
		expect(BigNum.ln(BigNum.exp(BigNum.TWO))).toEqual(BigNum.TWO);
	});

	it("log", function() {
		const inv = new BigNum("0.1");
		const ten = new BigNum("10");
		expect(BigNum.log(inv)).toEqual(BigNum.ONE.neg);
		expect(BigNum.log(ten)).toEqual(BigNum.ONE);
		expect(BigNum.log(new BigNum("100"))).toEqual(BigNum.TWO);
	});
});