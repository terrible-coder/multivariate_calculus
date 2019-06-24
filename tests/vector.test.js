const { Vector } = require("../build/vector");
const { isExpression } = require("../build/core/definitions");
const { Scalar } = require("../build/scalar");

describe("Vector constants", function() {
	const arr = [1, 1, 2];
	const A = new Vector.Constant([1, 1, 2]);
	const B = new Vector.Constant([1, 1, 1]);
	const random = new Vector.Constant([
		100*Math.random(),
		100*Math.random(),
		100*Math.random(),
		100*Math.random(),
		100*Math.random()
	]);

	it("Gets components", function() {
		let i;
		for(i = 1; i <= arr.length; i++)
			expect(A.X(i)).toBe(arr[i - 1]);
		for(; i < 10; i++)
			expect(A.X(i)).toBe(0);
	});

	it("Checks equality", function() {
		expect(A.equals(new Vector.Constant(arr))).toBe(true);
	});

	it("Adds", function() {
		expect(A.add(B)).toBeInstanceOf(Vector);
		expect(A.add(B)).toEqual(new Vector.Constant([2, 2, 3]));
	});

	it("generalises dot", function() {
		expect(_=> A.dot(random)).not.toThrow();
	});

	it("Calculates cross product", function() {
		const i = new Vector.Constant([1, 0]);
		const j = new Vector.Constant([0, 1]);
		expect(i.cross(j)).toEqual(new Vector.Constant([0, 0, 1]));
	});

	it("Calculates magnitude", function() {
		expect(Vector.mag(random).value).toBeCloseTo(Math.sqrt(random.dot(random).value));
		expect(Vector.mag(B).value).toBe(Math.sqrt(3));
	});

	it("Scales", function() {
		const scaled = A.scale(Scalar.constant(2));
		expect(Vector.mag(scaled)).toBe(Vector.mag(A).mul(Scalar.constant(2)));
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

	it("Calculates cross product", function() {
		const i = new Vector.Variable();
		const j = new Vector.Constant([0, 1]);
		const c = i.cross(j);
		expect(c).toBeInstanceOf(Vector.Expression);
		expect(c.at(new Map([
			[i, new Vector.Constant([1, 0])]
		]))).toEqual(new Vector.Constant([0, 0, 1]));
	});

	it("Evaluates magnitude", function() {
		const M = Vector.mag(B);
		expect(M).toBeInstanceOf(Scalar);
		expect(isExpression(M)).toBe(true);
		expect(M.at(new Map([
			[B, new Vector.Constant([1, 1, 1, 1, 1])]
		]))).toBe(Scalar.constant(Math.sqrt(5)));
	});

	it("Checks multiplication by scalar", function() {
		const x = Scalar.constant(2);
		const y = Scalar.variable("x");
		const a = new Vector.Variable("A");
		const expr1 = y.mul(A);
		const expr2 = B.scale(x);
		expect(expr1).toBeInstanceOf(Vector.Expression);
		expect(expr2).toBeInstanceOf(Vector.Expression);
		expect(expr1.at(new Map([
			[y, x]
		]))).toEqual(expr2.at(new Map([
			[B, A]
		])));
	});
});