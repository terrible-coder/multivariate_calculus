const Vector = require("../build/vector").Vector;

describe("Vector", function() {
	const A = new Vector([1, 1, 2]);
	const B = new Vector([1, 1, 1]);
	const random = new Vector([100*Math.random(), 100*Math.random(), 100*Math.random(), 100*Math.random(), 100*Math.random()]);
	it("Calculates magnitude", function() {
		expect(Vector.mag(random)).toBeCloseTo(Math.sqrt(random.dot(random)));
		expect(Vector.magSq(A)).toBe(6);
		expect(Vector.mag(B)).toBe(Math.sqrt(3));
	});
	it("Unit vector", function() {
		expect(Vector.mag(Vector.unit(random))).toBeCloseTo(1);
		expect(Vector.mag(Vector.unit(B))).toBeCloseTo(1);
	});
	it("Converts to matrix", function() {
		expect(random.toMatrix()).toBeDefined();
		expect(random.toMatrix()).toBeInstanceOf(require("../build/matrix").Matrix);
	});
	it("generalises dot", function() {
		expect(_=>A.dot(random)).not.toThrow();
	});
});