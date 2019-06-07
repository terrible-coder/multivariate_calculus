const scalar = require("../build/scalar").scalar;

const a = scalar.constant(5);
const b = scalar.constant(10);

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
});

describe("Checks errors", function() {
	it("Division by 0", function() {
		expect(_=>a.div(scalar.constant(0))).toThrow();
	});
});