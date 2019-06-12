const { Vector } = require("../build/vector");
const { isExpression } = require("../build/core/definitions");
const { Scalar } = require("../build/scalar");

describe("Vector constants", function() {
	const A = new Vector.Constant([1, 1, 2]);
	const B = new Vector.Constant([1, 1, 1]);
	const random = new Vector.Constant([
		100*Math.random(),
		100*Math.random(),
		100*Math.random(),
		100*Math.random(),
		100*Math.random()
	]);

	it("Adds", function() {
		expect(A.add(B)).toBeInstanceOf(Vector);
		expect(A.add(B)).toEqual(new Vector.Constant([2, 2, 3]));
	});

	it("generalises dot", function() {
		expect(_=> A.dot(random)).not.toThrow();
	});

	it("Calculates magnitude", function() {
		expect(Vector.mag(random).value).toBeCloseTo(Math.sqrt(random.dot(random).value));
		expect(Vector.mag(B).value).toBe(Math.sqrt(3));
	});

	it("Unit vector", function() {
		expect(Vector.mag(Vector.unit(random)).value).toBeCloseTo(1);
		expect(Vector.mag(Vector.unit(B)).value).toBeCloseTo(1);
	});
});

describe("Vector variable", function() {
	const A = new Vector.Constant([1, 1, 2]);
	const B = new Vector.Variable("B");
	const C = A.dot(B);

	it("Creates vector variables", function() {
		expect(B).toBeInstanceOf(Vector);
	});

	it("Creates vector expressions", function() {
		expect(isExpression(C)).toBe(true);
	});

	it("Resolves expressions", function() {
		const c_ = C.at(new Map([
			[B, new Vector.Constant([1, 1, 1, 1, 1])]
		]));
		expect(c_).toBeInstanceOf(Scalar);
		expect(c_).toBe(Scalar.constant(4));
	});

	it("Evaluates magnitude", function() {
		const M = Vector.mag(B);
		expect(M).toBeInstanceOf(Scalar);
		expect(isExpression(M)).toBe(true);
		expect(M.at(new Map([
			[B, new Vector.Constant([1, 1, 1, 1, 1])]
		]))).toBe(Scalar.constant(Math.sqrt(5)));
	});
});