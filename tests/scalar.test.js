const scalar = require("../build/scalar").Scalar;

const a = scalar.constant(5);
const b = scalar.constant(10);
const a_ = scalar.constant(Math.sqrt(5));

describe("Checks algebra", function() {
	it("Adds", function() {
		expect(a.add(b)).toEqual(scalar.constant(15));
	});
	it("Subtracts", function() {
		expect(a.sub(b)).toEqual(scalar.constant(-5));
	});
	it("Multiplies", function() {
		expect(a.mul(b)).toEqual(scalar.constant(50));
	});
	it("Divides", function() {
		expect(a.div(b)).toEqual(scalar.constant(0.5));
	});
	it("Checks equality", function() {
		expect(a.equals(a_.mul(a_))).toBe(true);
	});
});

describe("Checks errors", function() {
	it("Division by 0", function() {
		expect(_=>a.div(scalar.constant(0))).toThrow();
	});
});