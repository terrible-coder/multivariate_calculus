function isValidMatrix(matrix2x2:number[][]) {
	const row = matrix2x2.length;
	const col = matrix2x2[0].length;
	for(let i = 0; i < row; i++) {
		if(matrix2x2[i].length !== col) return false;
		if(!matrix2x2[i].every(x => typeof x === "number")) return false;
		matrix2x2[i] = matrix2x2[i].map(x => Object.is(x, -0)? 0: x);
	}
	return true;
}


/**
 * @classdesc Works with any n x m dimensional array.
 */
export class Matrix {
	readonly elements: number[][];
	readonly row:number;
	readonly col:number;

	/**
	 * @constructs Creates a new 2 dimensional Matrix object.
	 * @param matrix2D A general 2 dimensional array which represents the data in the matrix object to be created
	 */
	public constructor(matrix2D:number[][]);

	/**
	 * @constructs Creates a new 2 dimensional Matrix object with given rows and columns
	 * @param row Number of rows the matrix should have.
	 * @param col Number of columns the matrix should have.
	 * @param defaultFill Optional | The default value with which to fill all elements in the matrix.
	 */
	public constructor(row:number, col:number, defaultFill?:number);

	public constructor(a:number|number[][], b?:number, c?:number) {
		if(typeof a === "number" && typeof b === "number") {
			this.row = a;
			this.col = b;
			this.elements = new Array(a).fill(0).map(() => new Array(b).fill(c?c:0));
		} else if(a instanceof Array) {
			if(!isValidMatrix(a)) throw "Illegal values in matrix.";
			this.elements = a.map(r=>r.slice());
			this.row = this.elements.length;
			this.col = this.elements[0].length;
		} else throw "Illegal initialisation of matrix.";
	}

	/**
	 * @return An exact copy of this matrix object.
	 */
	public copy() {
		return new Matrix(this.elements);
	}

	public data(i:number, j:number): number;
	public data(i: number): number[];
	public data(i:number, j?:number) {
		return j !== undefined? this.elements[i][j]: this.elements[i];
	}

	/**
	 * Adds two matrices algebraically.
	 * @param that Matrix to add to this matrix.
	 * @return The matrix sum of the two matrices.
	 * @throws If the orders of the matrices do not match.
	 */
	public add(that: Matrix) {
		return Matrix.add(this, that);
	}

	/**
	 * Subtracts one matrix from another algebraically.
	 * @param that Matrix to subtract from this matrix.
	 * @return The matrix difference of the two matrices.
	 * @throws If the orders of the matrices do not match.
	 */
	public sub(that: Matrix) {
		return Matrix.sub(this, that);
	}

	/**
	 * Multiplies two matrices. The number of columns of `this` matrix must be
	 * equal to the number of rows of `that` matrix. The resulting matrix has
	 * the same number of rows as `this` matrix and the same number of columns as `that` matrix.
	 * @param that Matrix with which to multiply.
	 * @return The matrix product of the two matrices.
	 */
	public mul(that: Matrix) {
		return Matrix.mul(this, that);
	}

	/**
	 * Scales this matrix by a given scale factor. Scaling implies
	 * multiplying each element of this matrix by some scale factor `k`
	 * @param k The scale factor.
	 */
	public scale(k: number) {
		return new Matrix(new Array(this.row).fill(0).map((_, i) => new Array(this.col).fill(0).map((_, j) => this.elements[i][j]*k)));
	}

	/**
	 * Creates a new matrix of rank one less than `this` matrix's rank.
	 * Creates the new matrix by eliminating the elements in row `i` and column `j`.
	 * @param i Row index of element.
	 * @param j Column element of element.
	 * @ignore
	 */
	private minor_matrix(i: number, j: number) {
		const cf = new Matrix(this.row - 1, this.col - 1);
		for(let y = 0, Y = 0; y < this.row; y++)
			for(let x = 0, X = 0; x < this.col; x++) {
				if(!(x === j || y === i))
					cf.elements[Y][X++] = this.elements[y][x];
				if(X >= cf.col) {
					X = 0;
					Y++;
				}
			}
		return cf;
	}

	/**
	 * Calculates the minor of an element in the matrix given by its row and column.
	 * @param i Row index of element.
	 * @param j Column index of element,
	 */
	public minor(i: number, j: number) {return Matrix.det(this.minor_matrix(i, j));}

	/**
	 * Calculates the cofactor of an element in the matrix given by its row and column.
	 * @param i Row index of element.
	 * @param j Column index of element,
	 */
	public cofactor(i: number, j: number) {return Math.pow(-1, i+j) * this.minor(i, j);}

	/**
	 * Calculates the inverse of the given matrix.
	 * @throws If `Matrix.det(this) == 0`
	 */
	public inv() {
		const det = Matrix.det(this);
		if(det === 0) throw "Inverse not defined for singular matrix.";
		return Matrix.adjoint(this).scale(1 / det);
	}

	/**
	 * Creates and returns a unit matrix with `dim` rows and columns.
	 * @param dim Dimension of the desired matrix
	 */
	public static unit(dim:number) {
		return new Matrix(new Array(dim).fill(0).map((_, i)=>new Array(dim).fill(0).map((_, j)=>(i===j)?1:0)));
	}

	/**
	 * Calculates the cofactors of each element in some matrix `A` and stores them
	 * in their corresponding indices in the form of another matrix.
	 * @param A 
	 */
	public static comatrix(A: Matrix) {
		return new Matrix(A.elements.map((row, i) => row.map((_, j) => A.cofactor(i, j))));
	}

	/**
	 * Calculates the adjoint of some matrix `A`.
	 * @param A 
	 */
	public static adjoint(A: Matrix) {return Matrix.transpose(Matrix.comatrix(A));}

	/**
	 * Computes the transpose of some matrix `A`.
	 * @param A 
	 */
	public static transpose(A: Matrix) {
		const T = new Matrix(A.col, A.row);
		for(let i = 0; i < T.row; i++)
			for(let j = 0; j < T.col; j++)
				T.elements[i][j] = A.elements[j][i];
		return T;
	}

	/**
	 * Computes the determinant value of some matrix `A`.
	 * @param A 
	 */
	public static det(A: Matrix) {
		if(A.row !== A.col)
			throw "Determinant defined only for square matrices.";
		const dim = A.row;
		if(dim === 1) return A.elements[0][0];
		let s = 0;
		for(let i = 0; i < dim; i++)
			s += A.elements[0][i] * A.cofactor(0, i);
		return s;
	}

	/**
	 * Performs matrix addition on given matrices `A` and `B`.
	 * @param A 
	 * @param B 
	 */
	public static add(A: Matrix, B: Matrix) {
		if(A.row !== B.row || A.col !== B.col) throw "Addition defined only for matrices of same order.";
		return new Matrix(new Array(A.row).fill(0).map((_, i) => new Array(B.col).fill(0).map((_, j)=> A.elements[i][j]+B.elements[i][j])));
	}

	/**
	 * Performs matrix subtraction on given matrices `A` and `B`.
	 * @param A 
	 * @param B 
	 */
	public static sub(A: Matrix, B: Matrix) {
		if(A.row !== B.row || A.col !== B.col) throw "Subtraction defined only for matrices of same order.";
		return new Matrix(new Array(A.row).fill(0).map((_, i) => new Array(B.col).fill(0).map((_, j)=> A.elements[i][j]-B.elements[i][j])));
	}

	/**
	 * Performs matrix multiplication on given matrices `A` and `B`.
	 * @param A 
	 * @param B 
	 * @throws If `A.col != B.row`
	 */
	public static mul(A: Matrix, B: Matrix) {
		if(A.col !== B.row) throw "Multiplication not defined.";
		const r = A.row;
		const c = B.col;
		const p = A.col;
		const C = new Array(r).fill(0).map((_, i)=> new Array(c).fill(0).map((_, j) => {
			let sum = 0;
			for(let k = 0; k < p; k++)
				sum += A.elements[i][k] * B.elements[k][j];
			return sum;
		}));
		return new Matrix(C);
	}
}
