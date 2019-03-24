export interface matrix {
	readonly elements:number[][];
	
	copy():matrix;
	add(that:matrix):matrix;
	sub(that:matrix):matrix;
	mul(that:matrix):matrix;
}

function isValidMatrix(matrix2x2:number[][]) {
	let row = matrix2x2.length;
	let col = matrix2x2[0].length;
	for(let i = 0; i < row; i++) {
		if(matrix2x2[i].length !== col) return false;
		if(!matrix2x2[i].every(x => typeof x === "number")) return false;
		matrix2x2[i] = matrix2x2[i].map(x => Object.is(x, -0)? 0: x);
	}
	return true;
}

export class Matrix implements matrix {
	readonly elements: number[][];
	readonly row:number;
	readonly col:number;

	public constructor(matrix2x2:number[][]);
	public constructor(row:number, col:number, defaultFill?:number);

	public constructor(a:number|number[][], b?:number, c?:number) {
		if(typeof a === "number" && typeof b === "number") {
			this.row = a;
			this.col = b;
			this.elements = new Array(a).fill(0).map(_=>new Array(b).fill(c?c:0));
		} else if(a instanceof Array) {
			if(!isValidMatrix(a)) throw "Illegal values in matrix.";
			this.elements = a.map(r=>r.slice());
			this.row = this.elements.length;
			this.col = this.elements[0].length;
		} else throw "Illegal initialisation of matrix.";
	}

	public copy() {
		return new Matrix(this.elements);
	}

	public add(that: Matrix) {
		if(this.row !== that.row || this.col !== that.col) throw "Addition defined only for matrices of same order.";
		return new Matrix(new Array(this.row).fill(0).map((_, i) => new Array(that.col).fill(0).map((_, j)=> this.elements[i][j]+that.elements[i][j])));
	}

	public sub(that: Matrix) {
		if(this.row !== that.row || this.col !== that.col) throw "Subtration defined only for matrices of same order.";
		return new Matrix(new Array(this.row).fill(0).map((_, i) => new Array(that.col).fill(0).map((_, j)=> this.elements[i][j]+that.elements[i][j])));
	}

	public mul(that: Matrix) {
		if(this.col !== that.row) throw "Multiplication not defined.";
		const r = this.row;
		const c = that.col;
		const p = this.col;
		const C = new Array(r).fill(0).map((_, i)=> new Array(c).fill(0).map((_, j) => {
			let sum = 0;
			for(let k = 0; k < p; k++)
				sum += this.elements[i][k] * that.elements[k][j];
			return sum;
		}));
		return new Matrix(C);
	}

	public scale(k: number) {
		return new Matrix(new Array(this.row).fill(0).map((_, i) => new Array(this.col).fill(0).map((_, j) => this.elements[i][j]*k)));
	}

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

	public minor(i: number, j: number) {return Matrix.det(this.minor_matrix(i, j));}

	public cofactor(i: number, j: number) {return Math.pow(-1, i+j) * this.minor(i, j);}

	public inv() {
		const det = Matrix.det(this);
		if(det === 0) throw "Inverse not defined for singular matrix.";
		return Matrix.adjoint(this).scale(1 / det);
	}

	public static unit(dim:number) {
		return new Matrix(new Array(dim).fill(0).map((_, i)=>new Array(dim).fill(0).map((_, j)=>(i===j)?1:0)));
	}

	public static comatrix(A: Matrix) {
		return new Matrix(A.elements.map((row, i) => row.map((_, j) => A.cofactor(i, j))));
	}

	public static adjoint(A: Matrix) {return Matrix.transpose(Matrix.comatrix(A));}

	public static transpose(A: Matrix) {
		const T = new Matrix(A.col, A.row);
		for(let i = 0; i < T.row; i++)
			for(let j = 0; j < T.col; j++)
				T.elements[i][j] = A.elements[j][i];
		return T;
	}

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
}
