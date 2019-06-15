import { Token, Evaluable, Constant as _Constant, Variable as _Variable, Expression as _Expression, Operator, isConstant, isVariable } from "./core/definitions";
import { BinaryOperator, isBinaryOperator } from "./core/operators/binary";
import { UnaryOperator, isUnaryOperator } from "./core/operators/unary";
import { ExpressionBuilder } from "./core/expression";
import { Scalar } from "./scalar";

/**
 * Base class to work with vector quantities.
 */
export abstract class Vector implements Token, Evaluable {
	readonly abstract type: "constant" | "variable" | "expression";
	readonly quantity = "vector";

	/**
	 * Adds two `Vector`s together. If `this` and `that` are both constants
	 * then vectorially adds the two and returns a new `Vector.Constant` object
	 * otherwise creates an `Expression` out of them and returns the same.
	 * @param that {Vector} The scalar to add `this` with.
	 * @return {Vector} The result of algebraic addition.
	 */
	public abstract add(that: Vector): Vector;

	/**
	 * Subtracts `that` from `this`. If `this` and `that` are both constants
	 * then vectorially subtracts one from the other and returns a new
	 * `Vector.Constant` object otherwise creates an `Expression` out of them
	 * and returns the same.
	 * @param that {Scalar} The scalar to subtract from `this`.
	 * @return {Scalar} The result of algebraic subtraction.
	 */
	public abstract sub(that: Vector): Vector;

	/**
	 * Evaluates the scalar product of `this` and `that`. If both are constants
	 * then numerically computes the product and returns a `Scalar.Constant` object
	 * otherwise creates an `Expression` out of them and returns the same.
	 * @param that {Vector} The scalar to subtract from `this`.
	 * @return {Scalar}
	 */
	public abstract dot(that: Vector): Scalar;

	/**
	 * Scales, or multiplies the "size" (magnitude) of, `this` vector by given
	 * amount. If `this` and `k` are both constants then numerically calculates
	 * the scaled vector otherwise creates an `Expression` out of them and
	 * returns the same.
	 * @param k {Scalar} The scale factor.
	 * @return {Vector} The scaled vector.
	 */
	public abstract scale(k: Scalar): Vector;

	/**
	 * Computes the magnitude of a given vector. If `A` vector is a constant
	 * vector then numerically calculates the magnitude otherwise creates a
	 * scalar `Expression` and returns the same.
	 * @param A {Vector}
	 */
	public static mag(A: Vector.Constant): Scalar.Constant;
	public static mag(A: Vector): Scalar.Expression;
	public static mag(A: Vector) {
		if(A instanceof Vector.Constant) {
			let m = 0;
			for(let i = 1; i <= A.value.length; i++)
				m += Math.pow(A.X(i), 2);
			return Scalar.constant(Math.sqrt(m));
		}
		return new Scalar.Expression(BinaryOperator.MAG, <Evaluable><unknown>Vector, A);
	}

	/**
	 * For any given vector `A`, evaluates the unit vector along `A`. If `A` is
	 * a constant then directly calculates the unit vector and returns the same
	 * otherwise creates and returns a scalar `Expression`.
	 * @param A {Vector}
	 */
	public static unit(A: Vector.Constant): Vector.Constant;
	public static unit(A: Vector): Vector.Expression;
	public static unit(A: Vector) {
		if(A instanceof Vector.Constant)
			return A.scale(Scalar.constant(1).div(Vector.mag(A)));
		return new Vector.Expression(BinaryOperator.SCALE, A, Scalar.constant(1).div(Vector.mag(A)));
	}
}

export namespace Vector {
	export class Constant extends Vector implements _Constant {
		readonly type = "constant";

		constructor(readonly value: number[]) {
			super();
		}

		public get X() {
			const value = this.value;
			return function(i: number) {
				if(i <= 0)
					throw "Indexing starts from `1`";
				return value[i - 1] || 0;
			}
		}

		public add(that: Vector.Constant): Vector.Constant;
		public add(that: Vector.Variable | Vector.Expression): Vector.Expression;
		public add(that: Vector) {
			if(that instanceof Vector.Constant) {
				const m = Math.max(this.value.length, that.value.length);
				const vec: number[] = [];
				for(let i = 1; i <= m; i++)
					vec.push(this.X(i) + that.X(i));
				return new Vector.Constant(vec);
			}
			return new Vector.Expression(BinaryOperator.ADD, this, that);
		}

		public sub(that: Vector.Constant): Vector.Constant;
		public sub(that: Vector.Variable | Vector.Expression): Vector.Expression;
		public sub(that: Vector) {
			if(that instanceof Vector.Constant) {
				const m = Math.max(this.value.length, that.value.length);
				const vec: number[] = [];
				for(let i = 1; i <= m; i++)
					vec.push(this.X(i) - that.X(i));
				return new Vector.Constant(vec);
			}
			return new Vector.Expression(BinaryOperator.SUB, this, that);
		}

		public dot(that: Vector.Constant): Scalar.Constant;
		public dot(that: Vector.Variable | Vector.Expression): Scalar.Expression;
		public dot(that: Vector) {
			if(that instanceof Vector.Constant) {
				let parallel = 0;
				const m = Math.max(this.value.length, that.value.length);
				for(let i = 1; i <= m; i++)
					parallel += this.X(i) * that.X(i);
				return Scalar.constant(parallel);
			}
			return new Scalar.Expression(BinaryOperator.DOT, this, that);
		}

		public scale(k: Scalar.Constant): Vector.Constant;
		public scale(k: Scalar.Variable | Scalar.Expression): Vector.Expression;
		public scale(k: Scalar) {
			if(k instanceof Scalar.Constant)
				return new Vector.Constant(this.value.map(x => k.value * x));
			return new Vector.Expression(BinaryOperator.SCALE, this, k);
		}
	}

	export class Variable extends Vector implements _Variable {
		readonly type = "variable";

		constructor(readonly name: string) {
			super();
		}

		public add(that: Vector) {
			return new Vector.Expression(BinaryOperator.ADD, this, that);
		}

		public sub(that: Vector) {
			return new Vector.Expression(BinaryOperator.SUB, this, that);
		}

		public dot(that: Vector) {
			return new Scalar.Expression(BinaryOperator.DOT, this, that);
		}

		public scale(k: Scalar) {
			return new Vector.Expression(BinaryOperator.SCALE, this, k);
		}
	}

	export class Expression extends Vector implements _Expression {
		readonly type = "expression";
		readonly arg_list: Set<_Variable>;
		readonly operands: Evaluable[] = [];

		constructor(op: BinaryOperator, lhs: Evaluable, rhs: Evaluable);
		constructor(op: UnaryOperator, arg: Evaluable);
		constructor(readonly op: Operator, a: Evaluable, b?: Evaluable) {
			super();
			this.arg_list = ExpressionBuilder.createArgList(a, b);
			this.operands.push(a);
			if(b !== undefined)
				this.operands.push(b);
		}

		/**
		 * The left hand side operand for `this.op`.
		 * @throws If `this.op` is a `UnaryOperator`.
		 */
		public get lhs() {
			if(isBinaryOperator(this.op))
				return this.operands[0];
			throw "Unary operators have no left hand argument.";
		}

		/**
		 * The right hand side operand for `this.op`.
		 * @throws If `this.op` is a `UnaryOperator`.
		 */
		public get rhs() {
			if(isBinaryOperator(this.op))
				return this.operands[1];
			throw "Unary operators have no right hand argument.";
		}

		/**
		 * The argument for `this.op`.
		 * @throws If `this.op` is a `BinaryOperator`.
		 */
		public get arg() {
			if(isUnaryOperator(this.op))
				return this.operands[0];
			throw "Binary operators have two arguments.";
		}

		public add(that: Vector) {
			return new Vector.Expression(BinaryOperator.ADD, this, that);
		}

		public sub(that: Vector) {
			return new Vector.Expression(BinaryOperator.SUB, this, that);
		}

		public dot(that: Vector) {
			return new Scalar.Expression(BinaryOperator.DOT, this, that);
		}

		public scale(k: Scalar) {
			return new Vector.Expression(BinaryOperator.SCALE, this, k);
		}

		public isFunctionOf(v: _Variable) {
			return this.arg_list.has(v);
		}

		public at(values: Map<_Variable, _Constant>) {
			const res = ExpressionBuilder.evaluateAt(this, values);
			if(isConstant(res))
				return <Vector.Constant>res;
			if(isVariable(res))
				return <Vector.Variable>res;
			return <Vector.Expression>res;
		}
	}
}

/*
import { Matrix } from "./matrix";

export class Vector extends Matrix {
	constructor(list: number[]) {
		super([list.slice()]);
	}

	public get dimension() {
		return this.col;
	}

	public copy() {
		return new Vector(this.elements[0]);
	}

	public get X() {
		return (i: number) => i>this.dimension? 0: this.elements[0][i-1];
	}

	general(dim:number) {
		if(dim < this.dimension)
		throw "Cannot reduce number of dimensions.";
		if(dim === this.dimension)
		return this.copy();
		return new Vector(this.elements[0].slice().concat(new Array(dim - this.dimension).fill(0)));
	}

	public add(that: Vector): Vector {
		const dim = Math.max(this.dimension, that.dimension);
		return new Vector(Matrix.add(this.general(dim), that.general(dim)).data(0));
	}

	public sub(that: Vector): Vector {
		const dim = Math.max(this.dimension, that.dimension);
		return new Vector(Matrix.sub(this.general(dim), that.general(dim)).data(0));
	}

	public scale(k: number) {
		return new Vector(this.elements[0].map(x => k*x));
	}

	public dot(that: Vector) {
		const dim = Math.max(this.dimension, that.dimension);
		const A = this.general(dim);
		const B = that.general(dim);
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
		const B = Matrix.transpose(that.general(3));
		const v = A.mul(B);
		return new Vector(Matrix.transpose(v).data(0));
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
*/