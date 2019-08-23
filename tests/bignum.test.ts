import { BigNum } from "../src/core/math/bignum";
import { IndeterminateForm, DivisionByZero } from "../src/core/errors";

describe("Integer numbers", function() {
	const a = new BigNum("144");
	const b = new BigNum("-12");
	it("Creates new numbers", function() {
		const num = "100";
		const bnum = new BigNum(num);
		expect(bnum.toString()).toBe("100.0");
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
	});
});

describe("Throws appropriate errors", function() {
	const zero = new BigNum("0");
	it("Division by zero", function() {
		expect(() => new BigNum("1").div(zero)).toThrowError(new DivisionByZero("Cannot divide by zero."));
		expect(() => zero.div(zero)).toThrowError(new IndeterminateForm("Cannot determine 0/0."));
	});
});