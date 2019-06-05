const Scalar = require("../build/scalar").Scalar;

const a = new Scalar.Constant(5);
const b = new Scalar.Constant(10);

describe("Checks algebra", function() {
	it("Adds", function() {
		expect(a.add(b)).toEqual(new Scalar.Constant(15));
	});
	it("Subtracts", function() {
		expect(a.sub(b)).toEqual(new Scalar.Constant(-5));
	});
	it("Multiplies", function() {
		expect(a.mul(b)).toEqual(new Scalar.Constant(50));
	});
	it("Divides", function() {
		expect(a.div(b)).toEqual(new Scalar.Constant(0.5));
	});
});

describe("Checks errors", function() {
	it("Division by 0", function() {
		expect(_=>a.div(new Scalar.Constant(0))).toThrow();
	});
});