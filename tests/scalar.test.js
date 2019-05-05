const Scalar = require("../build/scalar").Scalar;

const a = new Scalar(5);
const b = new Scalar(10);

describe("Checks algebra", function() {
	it("Adds", function() {
		expect(a.add(b)).toEqual(new Scalar(15));
	});
	it("Subtracts", function() {
		expect(a.sub(b)).toEqual(new Scalar(-5));
	});
	it("Multiplies", function() {
		expect(a.mul(b)).toEqual(new Scalar(50));
	});
	it("Divides", function() {
		expect(a.div(b)).toEqual(new Scalar(0.5));
	});
	it("Scales", function() {
		const initial = new (require("../build/vector").Vector)([1, 2, 1]);
		const scaled = new (require("../build/vector").Vector)([5, 10, 5]);
		expect(a.mul(initial)).toEqual(scaled);
	});
});

describe("Checks errors", function() {
	it("Division by 0", function() {
		expect(_=>a.div(new Scalar(0))).toThrow();
	});
});