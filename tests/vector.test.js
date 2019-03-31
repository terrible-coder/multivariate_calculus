const Vector = require("../build/vector").Vector;

describe("Vector", function() {
	const A = new Vector([1, 1, 2]);
	const B = new Vector([1, 1, 1]);
	const random = new Vector([100*Math.random(), 100*Math.random(), 100*Math.random(), 100*Math.random(), 100*Math.random()]);
	console.log(A)
	it("Adds", function() {
		expect(A.add(B)).toBeInstanceOf(Vector);
		expect(A.add(B)).toEqual(new Vector([2, 2, 3]));
	});
	it("Calculates cross product", function() {
		const a = new Vector([1, 0, 0]);
		const b = new Vector([0, 1, 0]);
		expect(a.cross(b)).toEqual(new Vector([0, 0, 1]));
	});
	it("Calculates magnitude", function() {
		expect(Vector.mag(random)).toBeCloseTo(Math.sqrt(random.dot(random)));
		expect(Vector.magSq(A)).toBe(6);
		expect(Vector.mag(B)).toBe(Math.sqrt(3));
	});
	it("Unit vector", function() {
		expect(Vector.mag(Vector.unit(random))).toBeCloseTo(1);
		expect(Vector.mag(Vector.unit(B))).toBeCloseTo(1);
	});
	it("generalises dot", function() {
		expect(_=>A.dot(random)).not.toThrow();
	});
});