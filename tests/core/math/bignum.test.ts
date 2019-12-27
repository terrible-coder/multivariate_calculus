import { BigNum, RoundingMode, MathContext, bignum } from "../../../src/core/math/bignum";
import { IndeterminateForm, DivisionByZero } from "../../../src/core/errors";

describe("Integer numbers", function() {
	const a = bignum("144");
	const b = bignum("-12");
	describe("Creates new numbers", function() {
		const st = "100.0";
		it("from number", function() {
			const num = 100;
			const bnum = bignum(num);
			expect(bnum.toString()).toBe(st);
		});
		
		describe("from string", function() {
			it("Decimal form", function() {
				const num = "100";
				const bnum = bignum(num);
				expect(bnum.toString()).toBe(st);
			});

			it("Scientific form", function() {
				const num = "1e2";
				const bnum = bignum(num);
				expect(bnum.toString()).toBe(st);
			});
		});

		it("from integer and fractional parts", function() {
			const bnum = bignum("100", "0");
			expect(bnum.toString()).toBe(st);
		});
	});

	it("Checks for equality", function() {
		const A = bignum("20");
		const B = bignum("20.1");
		expect(A.equals(B)).toBe(false);
		expect(A.equals(B, {
			precision: 0,
			rounding: RoundingMode.HALF_UP
		})).toBe(true);
	});

	it("Adds numbers", function() {
		expect(a.add(b)).toEqual(bignum("132"));
	});

	it("Subtracts numbers", function() {
		expect(a.sub(b)).toEqual(bignum("156"));
	});

	it("Multiplies numbers", function() {
		expect(a.mul(b)).toEqual(bignum("-1728"));
	});

	it("Divides numbers", function() {
		expect(a.div(b)).toEqual(bignum("-12"));
	});

	it("Raises to integer powers", function() {
		expect(BigNum.intpow(b, 2)).toEqual(a);
		const temp = Math.pow(-12, 2);
		console.log(temp);
		expect(BigNum.intpow(b, 3)).toEqual(bignum("-1728"));
	});

	it("Computes absolute value", function() {
		expect(BigNum.abs(a)).toEqual(a);
		expect(BigNum.abs(b)).toEqual(bignum("12"));
	});
});

describe("Decimal numbers", function() {
	const a = bignum("0.144");
	const b = bignum("1.2");
	describe("Creates new numbers", function() {
		const st = "40.01";
		it("from number", function() {
			const num = 40.01;
			const bnum = bignum(num);
			expect(bnum.toString()).toBe(st);
		});

		describe("from string", function() {
			it("Decimal form", function() {
				const num = "40.01";
				const bnum = bignum(num);
				expect(bnum.toString()).toBe(st);
			});

			it("Scientific form", function() {
				const num1 = "4.001e1", num2 = "4001e-2";
				const bnum1 = bignum(num1), bnum2 = bignum(num2);
				expect(bnum1.toString()).toBe(st);
				expect(bnum2.toString()).toBe(st);
			});
		});

		it("from integer and fractional parts", function() {
			const bnum = bignum("40", "01");
			expect(bnum.toString()).toBe(st);
		});
	});

	it("Adds numbers", function() {
		expect(a.add(b)).toEqual(bignum("1.344"));
	});

	it("Subtracts numbers", function() {
		expect(a.sub(b)).toEqual(bignum("-1.056"));
	});

	it("Multiplies numbers", function() {
		expect(a.mul(b)).toEqual(bignum("0.1728"));
	});

	it("Divides numbers", function() {
		expect(a.div(b)).toEqual(bignum("0.12"));
	});

	it("Raises to integer powers", function() {
		expect(BigNum.intpow(b, 2)).toEqual(bignum("1.44"));
		expect(BigNum.intpow(b, 3)).toEqual(bignum("1.728"));
	});
});

describe("Mixed values", function() {
	it("Addition", function() {
		const a = bignum("120");
		const b = bignum("0.123");
		expect(a.add(b)).toEqual(bignum("120.123"));
	});

	it("Division", function() {
		const a = bignum("10000");
		const b = bignum("1");
		expect(b.div(a)).toEqual(bignum("0.0001"));
		const a1 = bignum("0.0001");
		const b1 = bignum("1");
		expect(a1.div(b1, {
			precision: 2,
			rounding: RoundingMode.HALF_UP
		})).toEqual(bignum("0"));
	});
});

describe("Throws appropriate errors", function() {
	const zero = bignum("0");
	it("Division by zero", function() {
		expect(() => bignum("1").div(zero)).toThrowError(new DivisionByZero("Cannot divide by zero."));
		expect(() => zero.div(zero)).toThrowError(new IndeterminateForm("Cannot determine 0/0."));
	});

	it("Illegal number format", function() {
		expect(() => bignum("1.1.1")).toThrowError(TypeError);
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
			const x = BigNum.round(bignum(a[i]), context);
			expect(x).toEqual(bignum(b[i]));
		}
	});

	it("Down", function() {
		const b = ["5", "2", "1", "1", "1", "-1", "-1", "-1", "-2", "-5"];
		const context = {
			precision: 0,
			rounding: RoundingMode.DOWN
		};
		for(let i = 0; i < 10; i++) {
			const x = BigNum.round(bignum(a[i]), context);
			expect(x).toEqual(bignum(b[i]));
		}
	});

	it("Ceiling", function() {
		const b = ["6", "3", "2", "2", "1", "-1", "-1", "-1", "-2", "-5"];
		const context = {
			precision: 0,
			rounding: RoundingMode.CEIL
		};
		for(let i = 0; i < 10; i++) {
			const x = BigNum.round(bignum(a[i]), context);
			expect(x).toEqual(bignum(b[i]));
		}
	});

	it("Floor", function() {
		const b = ["5", "2", "1", "1", "1", "-1", "-2", "-2", "-3", "-6"];
		const context = {
			precision: 0,
			rounding: RoundingMode.FLOOR
		};
		for(let i = 0; i < 10; i++) {
			const x = BigNum.round(bignum(a[i]), context);
			expect(x).toEqual(bignum(b[i]));
		}
	});

	it("Half up", function() {
		const b = ["6", "3", "2", "1", "1", "-1", "-1", "-2", "-3", "-6"];
		const context = {
			precision: 0,
			rounding: RoundingMode.HALF_UP
		};
		for(let i = 0; i < 10; i++) {
			const x = BigNum.round(bignum(a[i]), context);
			expect(x).toEqual(bignum(b[i]));
		}
	});

	it("Half down", function() {
		const b = ["5", "2", "2", "1", "1", "-1", "-1", "-2", "-2", "-5"];
		const context = {
			precision: 0,
			rounding: RoundingMode.HALF_DOWN
		};
		for(let i = 0; i < 10; i++) {
			const x = BigNum.round(bignum(a[i]), context);
			expect(x).toEqual(bignum(b[i]));
		}
	});

	it("Half even", function() {
		const b = ["6", "2", "2", "1", "1", "-1", "-1", "-2", "-2", "-6"];
		const context = {
			precision: 0,
			rounding: RoundingMode.HALF_EVEN
		};
		for(let i = 0; i < 10; i++) {
			const x = BigNum.round(bignum(a[i]), context);
			expect(x).toEqual(bignum(b[i]));
		}
	});

	it("Unnecesary", function() {
		const context: MathContext = {
			precision: 0,
			rounding: RoundingMode.UNNECESSARY
		};
		for(let i = 0; i < 10; i++) {
			const x = bignum(a[i]);
			if(a[i] == "1.0")
				expect(BigNum.round(x, context)).toEqual(bignum("1"));
			else if(a[i] == "-1.0")
				expect(BigNum.round(x, context)).toEqual(bignum("-1"));
			else
				expect(() => BigNum.round(x, context)).toThrow();
		}
	});
});

describe("Comparison", function() {
	it("Compares integers", function() {
		const a = bignum("1");
		const b = bignum("2");
		expect(a.compareTo(b)).toBe(-1);
		expect(b.compareTo(a)).toBe(1);
	});

	it("Compares fractions", function() {
		const a = bignum("0.25");
		const b = bignum("0.26");
		expect(a.compareTo(b)).toBe(-1);
		expect(b.compareTo(a)).toBe(1);
	});

	it("Compares mixed fractions", function() {
		const a = bignum("1.23");
		const b = bignum("1.234");
		expect(a.compareTo(b)).toBe(-1);
		expect(b.compareTo(a)).toBe(1);
	});

	it("Checks equality", function() {
		const a = bignum("4.75");
		const b = bignum("4.75");
		expect(a.compareTo(b)).toBe(0);
		expect(b.compareTo(a)).toBe(0);
	});

	it("Compares numerically equivalent values", function() {
		const a = bignum("3.22");
		const b = bignum("0.322");
		expect(a.compareTo(b)).not.toBe(0);
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
		const inv = bignum("0.1");
		const ten = bignum("10");
		expect(BigNum.log(inv)).toEqual(BigNum.ONE.neg);
		expect(BigNum.log(ten)).toEqual(BigNum.ONE);
		expect(BigNum.log(bignum("100"))).toEqual(BigNum.TWO);
	});
});