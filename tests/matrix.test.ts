import { Matrix } from "../src/matrix";

describe("Matrix", function() {
	const I = new Matrix([
		[1, 0, 0],
		[0, 1, 0],
		[0, 0, 1]
	]);
	const A = new Matrix(2, 3, 0);
	const B = new Matrix([
		[1, 2, 3],
		[4, 5, 6]
	]);
	const C = new Matrix([
		[1, 2, 3],
		[4, 5, 6],
		[7, 8, 9]
	]);

	describe("Algebra", function() {
		it("Addition", function() {
			expect(A.add(B)).toEqual(B);
			expect(Matrix.add(A, B)).toEqual(B);
		});
		it("Subtraction", function() {
			expect(B.sub(A)).toEqual(B);
			expect(A.sub(B)).toEqual(B.scale(-1));
		});
		it("Multiply", function() {
			expect(I.mul(C)).toEqual(C);
			const x = Matrix.transpose(new Matrix([[1, 0, 0]]));
			expect(I.mul(x)).toEqual(x);
		});
		it("Scaling", function() {
			expect(I.scale(5)).toEqual(new Matrix([
				[5, 0, 0],
				[0, 5, 0],
				[0, 0, 5]
			]));
		});
		it("Determinant", function() {
			expect(Matrix.det(C)).toBe(0);
			expect(Matrix.det(I)).toBe(1);
		});
		it("Transpose", function() {
			expect(Matrix.transpose(I)).toEqual(I);
			expect(Matrix.transpose(B)).toEqual(new Matrix([
				[1, 4],
				[2, 5],
				[3, 6]
			]));
		});
		it("Inverse", function() {
			expect(I.inv()).toEqual(I);
		});
		it("Creates copies", function() {
			const c = B.copy();
			c.elements[0][0] = -1;
			expect(c).not.toBe(B);
		});
		it("Gets indexed data", function() {
			C.elements.forEach((row, i) => row.forEach((value, j) => expect(value).toBe(C.data(i, j))));
		});
	});
	describe("Errors", function() {
		it("Initialisation", function() {
			expect(() => new Matrix([2, 2, [3, 8]] as any)).toThrow();
			expect(() => new Matrix([[1, 2, 3], "hello", [7, 8, 9]] as any)).toThrow();
		});
		it("Addition", function() {
			expect(() => A.add(I)).toThrow();
		});
		it("Subtraction", function() {
			expect(() => I.sub(A)).toThrow();
		});
		it("Multiplication", function() {
			expect(() => A.mul(B)).toThrow();
		});
		it("Inverse", function() {
			expect(() => B.inv()).toThrow();
			expect(() => C.inv()).toThrow();
		});
	});
});
