import { BigNum } from "../src/core/math/bignum";

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