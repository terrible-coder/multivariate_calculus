const { Vector, __ } = require("../build/vector");
const { isExpression } = require("../build/core/definitions");
const { Scalar } = require("../build/scalar");
const { sqrt } = require("../build/core/math/functions");

it("checks unknown value alias", function() {
	expect(__).toBe(undefined);
});

describe("Vector constants", function() {
	const arr = [1, 1, 2];
	const A = Vector.constant([1, 1, 2]);
	const B = Vector.constant([1, 1, 1]);
	const a = Vector.constant([1, 1, 2], "A");
	const random = Vector.constant([
		100*Math.random(),
		100*Math.random(),
		100*Math.random(),
		100*Math.random(),
		100*Math.random()
	]);

	it("Creates vectors from scalar lists", function() {
		const array = [
			Scalar.constant(1),
			Scalar.constant(1),
			Scalar.constant(2)
		];
		expect(() => new Vector.Constant(array)).not.toThrow();
		expect(() => Vector.constant(array)).not.toThrow();
		const v = new Vector.Constant(array);
		expect(v).toBeInstanceOf(Vector.Constant);
		expect(v).toEqual(A);
	});

	it("Checks naming system", function() {
		expect(Vector.constant("A")).toBe(a);
		expect(a).not.toBe(A);
		expect(A.equals(a)).toBe(true);
		expect(() => Vector.constant([1, 2], "A")).toThrow();
	});

	it("Gets components", function() {
		let i;
		for(i = 1; i <= arr.length; i++)
			expect(A.X(i)).toBe(Scalar.constant(arr[i - 1]));
		for(; i < 10; i++)
			expect(A.X(i).value).toBe(0);
	});

	it("Checks equality", function() {
		expect(A.equals(Vector.constant(arr))).toBe(true);
	});

	it("Checks non-duplicacy", function() {
		expect(Vector.constant(arr)).toBe(A);
		expect(Vector.constant([1, 1, 1])).toBe(B);
	});

	it("Adds", function() {
		expect(A.add(B)).toBeInstanceOf(Vector);
		expect(A.add(B)).toEqual(Vector.constant([2, 2, 3]));
	});

	it("generalises dot", function() {
		expect(_=> A.dot(random)).not.toThrow();
	});

	it("Calculates cross product", function() {
		const i = Vector.constant([1, 0]);
		const j = Vector.constant([0, 1]);
		expect(i.cross(j)).toEqual(Vector.constant([0, 0, 1]));
	});

	it("Calculates magnitude", function() {
		const mag = sqrt(random.dot(random));
		expect(Vector.mag(random).equals(mag)).toBe(true);
		expect(Vector.mag(B).value).toBe(Math.sqrt(3));
	});

	it("Scales", function() {
		const scaled = A.scale(Scalar.constant(2));
		expect(Vector.mag(scaled)).toBe(Vector.mag(A).mul(Scalar.constant(2)));
	});

	it("Unit vector", function() {
		const one = Scalar.constant(1);
		expect(Vector.mag(Vector.unit(random)).equals(one)).toBe(true);
		expect(Vector.mag(Vector.unit(B)).equals(one)).toBe(true);
	});
});

describe("Vector variable", function() {
	const A = Vector.constant([1, 1, 2]);
	const B = Vector.variable("B");
	const C = A.dot(B);

	it("Creates vector variables", function() {
		expect(B).toBeInstanceOf(Vector);
		expect(() => {
			const G = Vector.variable("G", [1, __, 0, 4]);
			expect(G.X(2)).toBeInstanceOf(Scalar.Variable);
		}).not.toThrow();
	});

	it("Creates vector expressions", function() {
		expect(isExpression(C)).toBe(true);
	});

	it("Checks non-duplicacy", function() {
		expect(Vector.variable("B")).toBe(B);
	});

	it("Resolves expressions", function() {
		const c_ = C.at(new Map([
			[B, Vector.constant([1, 1, 1, 1, 1])]
		]));
		expect(c_).toBeInstanceOf(Scalar);
		expect(c_).toBe(Scalar.constant(4));
	});

	it("Calculates cross product", function() {
		const i = Vector.variable("i");
		const j = Vector.constant([0, 1]);
		const c = i.cross(j);
		for(let I = 1; I <= 3; I++)
			expect(c.X(I)).toBeInstanceOf(Scalar.Expression);
		expect(c).toBeInstanceOf(Vector.Expression);
		expect(c.at(new Map([
			[i, Vector.constant([1, 0])]
		]))).toEqual(Vector.constant([0, 0, 1]));
	});

	it("Evaluates magnitude", function() {
		const M = Vector.mag(B);
		expect(M).toBeInstanceOf(Scalar);
		expect(isExpression(M)).toBe(true);
		expect(M.at(new Map([
			[B, Vector.constant([1, 1, 1, 1, 1])]
		]))).toBe(Scalar.constant(Math.sqrt(5)));
	});

	it("Evaluates unit vector", function() {
		const u = Vector.unit(B);
		expect(u).toBeInstanceOf(Vector.Expression);
		expect(u.at(new Map([
			[B, Vector.constant([2, 0])]
		]))).toEqual(Vector.constant([1, 0]));
	});

	it("Checks multiplication by scalar", function() {
		const x = Scalar.constant(2);
		const y = Scalar.variable("x");
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