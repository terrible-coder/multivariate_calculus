import { Matrix } from "./matrix";

export class Vector extends Matrix {
	readonly dimension: number;
	
	constructor(list: number[]) {
		super([list.slice()]);
		this.dimension = list.length;
	}

	public copy() {
		return new Vector(this.elements[0]);
	}

	public get X() { 
		return (i: number) => i>this.dimension? 0: this.elements[0][i-1];
	}

	toMatrix(dim?: number) {
		if(dim === this.dimension || dim === undefined)
			return new Matrix(this.elements);
		if(dim < this.dimension)
			throw "Cannot reduce number of dimensions.";
		return new Matrix([this.elements[0].concat(new Array(dim-this.dimension).fill(0))]);
	}

	general(dim:number) {
		if(dim < this.dimension)
		throw "Cannot reduce number of dimensions.";
		if(dim === this.dimension)
		return this.copy();
		return new Vector(this.elements[0].slice().concat(new Array(dim-this.dimension).fill(0)));
	}

	public add(that: Vector) {
		const dim = Math.max(this.dimension, that.dimension);
		const A = this.toMatrix(dim);
		const B = that.toMatrix(dim);
		return new Vector(A.add(B).data(0));
	}

	public sub(that: Vector) {
		const dim = Math.max(this.dimension, that.dimension);
		const A = this.toMatrix(dim);
		const B = that.toMatrix(dim);
		return new Vector(A.sub(B).data(0));
	}

	// public mul(that: Vector): never {
	// 	throw new Error("Normal multiplication not defined for vectors.");
	// }

	public scale(k: number) {
		return new Vector(this.elements[0].map(x => k*x));
	}

	public dot(that: Vector) {
		const dim = Math.max(this.dimension, that.dimension);
		const A = this.general(dim) as Matrix;
		const B = that.general(dim) as Matrix;
		return A.mul(Matrix.transpose(B)).elements[0][0];
	}

	public cross(that: Vector) {
		if(this.dimension > 3 || that.dimension > 3)
			throw new Error("Cross product defined only till 3 dimensions.");
		const A = new Matrix([
			[0, -this.X(3), this.X(3)],
			[this.X(3), 0, -this.X(1)],
			[-this.X(2), this.X(1), 0]
		]);
		const B = new Matrix([
			[that.X(1)],
			[that.X(2)],
			[that.X(3)]
		]);
		return new Vector(Matrix.transpose(A.mul(B)).data(0));
	}

	public static magSq(v: Vector) {
		return v.elements[0].reduce((total, x) => total + x*x, 0);
	}

	public static mag(v: Vector) {
		return Math.sqrt(Vector.magSq(v));
	}

	public static angleBetween(v1: Vector, v2: Vector) {
		return Math.acos(v1.dot(v2)/(Vector.mag(v1)*Vector.mag(v2)));
	}

	public static dir(v: Vector) {
		return v.scale(1/Vector.mag(v));
	}

	public static directionCosines(v: Vector) {
		return Vector.dir(v).elements[0].slice();
	}
}