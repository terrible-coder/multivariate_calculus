import { Vector, __ } from "../src/vector";
import { isExpression } from "../src/core/definitions";
import { Scalar } from "../src/scalar";
import { BigNum } from "../src/core/math/bignum";

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

	test("Naming system", function() {
		expect(Vector.constant("A")).toBe(a);
		expect(a).not.toBe(A);
		expect(A.equals(a)).toBe(true);
		expect(() => Vector.constant([1, 2], "A")).toThrow();
	});

	it("Gets components", function() {
		let i: number;
		for(i = 1; i <= arr.length; i++)
			expect(A.X(i)).toEqual(Scalar.constant(arr[i - 1]));
		for(; i < 10; i++)
			expect(A.X(i).value).toEqual(BigNum.real(0));
	});

	it("Checks equality", function() {
		expect(A.equals(Vector.constant(arr))).toBe(true);
	});

	it("Checks non-duplicacy", function() {
		expect(Vector.constant(arr)).toEqual(A);
		expect(Vector.constant([1, 1, 1])).toEqual(B);
	});

	it("Negates", function() {
		const A_neg = A.neg;
		expect(A_neg).toEqual(Vector.constant([-1, -1, -2]));
		expect(A.add(A_neg)).toEqual(Vector.constant([0]));
	});

	it("Adds", function() {
		expect(A.add(B)).toBeInstanceOf(Vector);
		expect(A.add(B)).toEqual(Vector.constant([2, 2, 3]));
	});

	it("generalises dot", function() {
		expect(() => A.dot(random)).not.toThrow();
		expect(A.dot(random)).toBeInstanceOf(Scalar.Constant);
	});

	describe("Calculates cross product", function() {
		test("anti-symmetric values", function() {
			const e1 = 1 + Math.floor(5 * Math.random());
			const e2 = 6 + Math.floor(5 * Math.random());
			const e12 = Vector.e(e1).cross(Vector.e(e2));
			const e21 = Vector.e(e2).cross(Vector.e(e1));
			const sum = e12.add(e21);
			const res = Vector.constant([0]);
			console.log(sum.value.length, res.value.length);
			expect(sum).toEqual(res);
		});

		it("calculates correct cross", function() {
			const i = Vector.constant([1, 0]);
			const j = Vector.constant([0, 1]);
			expect(i.cross(j)).toEqual(Vector.constant([0, 0, 1]));
		});
	});

	it("Calculates magnitude", function() {
		const mag = Scalar.constant(random.dot(random).value.pow(BigNum.real("0.5")));
		expect(Vector.mag(random)).toEqual(mag);
		expect(Vector.mag(B).value).toEqual(BigNum.real(3).pow(BigNum.real(0.5)));
	});

	it("Scales", function() {
		const scaled = A.scale(Scalar.constant(2));
		expect(Vector.mag(scaled)).toEqual(Vector.mag(A).mul(Scalar.constant(2)));
	});

	it("Unit vector", function() {
		const one = Scalar.constant(1);
		expect(Vector.mag(Vector.unit(B))).toEqual(one);
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
		expect(c_).toEqual(Scalar.constant(4));
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
		]))).toEqual(Scalar.constant(5).pow(Scalar.constant(0.5)));
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

	it("Negates", function() {
		const expr = B.add(B.neg);
		const zero = expr.at(new Map([
			[B, A]
		]));
		expect(zero).toEqual(Vector.constant([0]));
	});
});