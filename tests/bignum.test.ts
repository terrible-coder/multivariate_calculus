import { BigNum, RoundingMode, MathContext } from "../src/core/math/bignum";
import { IndeterminateForm, DivisionByZero } from "../src/core/errors";

describe("Integer numbers", function() {
	const a = new BigNum("144");
	const b = new BigNum("-12");
	it("Creates new numbers", function() {
		const num = "100";
		const bnum = new BigNum(num);
		expect(bnum.toString()).toBe("100.0");
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
		const start = Date.now();
		expect(BigNum.intpow(b, 2)).toEqual(a);
		const time = Date.now() - start;
		const start1 = Date.now();
		const temp = Math.pow(-12, 2);
		console.log(temp);
		const time1 = Date.now() - start1;
		expect(BigNum.intpow(b, 3)).toEqual(new BigNum("-1728"));
		console.log(time, "ms");
		console.log(time1, "ms");
	});

	it("Computes absolute value", function() {
		expect(BigNum.abs(a)).toEqual(a);
		expect(BigNum.abs(b)).toEqual(new BigNum("12"));
	});
});

describe("Decimal numbers", function() {
	const a = new BigNum("0.144");
	const b = new BigNum("1.2");
	it("Creates new numbers", function() {
		const num = "4.001";
		const bnum = new BigNum(num);
		expect(bnum.toString()).toBe(num);
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

describe("Trigonometry", function() {
	describe("sine", function() {
		// it("Multiples of pi", function() {
		// 	for(let n = BigNum.ZERO; !n.equals(BigNum.NINE); n = n.add(BigNum.ONE)) {
		// 		expect(BigNum.sin(n.mul(BigNum.PI))).toEqual(BigNum.ZERO);
		// 	}
		// });

		it("Odd multiples of pi/2", function() {
			const piby2 = BigNum.PI.div(BigNum.TWO);
			let even = true;
			for(let n = BigNum.ZERO; !n.equals(BigNum.NINE); n = n.add(BigNum.ONE)) {
				const f = BigNum.TWO.mul(n).add(BigNum.ONE);
				if(even)
					expect(BigNum.sin(f.mul(piby2))).toEqual(BigNum.ONE);
				else
					expect(BigNum.sin(f.mul(piby2))).toEqual(new BigNum("-1"));
				even = !even;
			}
		});
	});

	describe("cosine", function() {
		it("Multiples of pi", function() {
			let even = true;
			for(let n = BigNum.ZERO; !n.equals(BigNum.NINE); n = n.add(BigNum.ONE)) {
				if(even)
					expect(BigNum.cos(n.mul(BigNum.PI))).toEqual(BigNum.ONE);
				else
					expect(BigNum.cos(n.mul(BigNum.PI))).toEqual(new BigNum("-1"));
				even = !even;
			}
		});

		// it("Odd multiples of pi/2", function() {
		// 	const piby2 = BigNum.PI.div(BigNum.TWO);
		// 	for(let n = BigNum.ZERO; !n.equals(BigNum.NINE); n = n.add(BigNum.ONE)) {
		// 		const f = BigNum.TWO.mul(n).add(BigNum.ONE);
		// 		expect(BigNum.cos(f.mul(piby2))).toEqual(BigNum.ZERO);
		// 	}
		// });
	});
});

describe("Exponent", function() {
	it("exp", function() {
		expect(BigNum.exp(BigNum.ZERO)).toEqual(BigNum.ONE);
		expect(BigNum.exp(BigNum.ONE)).toEqual(BigNum.round(BigNum.E, BigNum.MODE));
	});
});
