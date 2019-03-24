const Matrix = require("../build/matrix").Matrix;

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
		});
		it("Subtraction", function() {
			expect(A.sub(B)).toEqual(B);
		});
		it("Multiply", function() {
			expect(I.mul(C)).toEqual(C);
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
	});
	describe("Errors", function() {
		it("Addition", function() {
			expect(_=>A.add(I)).toThrow();
		});
		it("Subtration", function() {
			expect(_=>I.sub(A)).toThrow();
		});
		it("Multiplication", function() {
			expect(_=>A.mul(B)).toThrow();
		});
		it("Inverse", function() {
			expect(_=>B.inv()).toThrow();
			expect(_=>C.inv()).toThrow();
		});
	});
});
