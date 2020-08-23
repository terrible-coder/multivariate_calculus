import { Token, Evaluable, Constant as _Constant, Variable as _Variable, Expression as _Expression, Operator, isConstant, isVariable, Numerical } from "./core/definitions";
import { BinaryOperator, isBinaryOperator } from "./core/operators/binary";
import { UnaryOperator, isUnaryOperator } from "./core/operators/unary";
import { ExpressionBuilder } from "./core/expression";
import { Scalar } from "./scalar";
import { InvalidIndex } from "./core/errors";
import { MathContext } from "./core/math/context";
import { mathenv } from "./core/env";
import { BigNum } from "./core/math/bignum";

/**
 * The double underscore.
 * 
 * Represents any unknown value. When passed in along with other known values
 * this gets interpreted as an unknown or a {@link Variable}.
 * @see {@link Vector.variable} for a use case example.
 */
export const __ = undefined;

/**
 * Base class to work with vector quantities.
 * @abstract
 */
export abstract class Vector extends Numerical implements Token, Evaluable {
	readonly abstract type: "constant" | "variable" | "expression";
	readonly abstract X: (i: number) => Scalar;
	readonly quantity = "vector";

	/**
	 * Adds two {@link Vector}s together. If `this` and `that` are both constants
	 * then vectorially adds the two and returns a new {@link Vector.Constant} object
	 * otherwise creates an {@link Expression} out of them and returns the same.
	 * @param that The scalar to add `this` with.
	 * @return The result of algebraic addition.
	 */
	public abstract add(that: Vector): Vector;

	/**
	 * Subtracts `that` from `this`. If `this` and `that` are both constants
	 * then vectorially subtracts one from the other and returns a new
	 * {@link Vector.Constant} object otherwise creates an {@link Expression} out of them
	 * and returns the same.
	 * @param that The scalar to subtract from `this`.
	 * @return The result of algebraic subtraction.
	 */
	public abstract sub(that: Vector): Vector;

	/**
	 * Evaluates the scalar product of `this` and `that`. If both are constants
	 * then numerically computes the product and returns a {@link Scalar.Constant} object
	 * otherwise creates an {@link Expression} out of them and returns the same.
	 * @param that The scalar to subtract from `this`.
	 * @return The inner product of `this` and `that`.
	 */
	public abstract dot(that: Vector): Scalar;

	/**
	 * Evaluates the vector product of `this` and `that`. If both are constants
	 * then numerically computes the product and returns a {@link Vector.Constant} object
	 * otherwise creates an {@link Expression} out of them and returns the same.
	 * @param that The scalar to subtract from `this`.
	 * @return The vector product of `this` and `that`.
	 */
	// public abstract cross(that: Vector): Vector;

	/**
	 * Scales, or multiplies the "size" (magnitude) of, `this` vector by given
	 * amount. If `this` and `k` are both constants then numerically calculates
	 * the scaled vector otherwise creates an {@link Expression} out of them and
	 * returns the same.
	 * @param k The scale factor.
	 * @return The scaled vector.
	 */
	public abstract scale(k: Scalar): Vector;

	/**
	 * Computes the magnitude of a constant vector numerically.
	 * @param A The {@link Vector} whose magnitude is to be calculated.
	 * @return The {@link Scalar} magnitude of the given {@link Vector}.
	 */
	public static mag(A: Vector.Constant): Scalar.Constant;
	/**
	* Computes the magnitude of a given vector. If `A` vector is a constant
	* vector then numerically calculates the magnitude otherwise creates a
	* scalar {@link Expression} and returns the same.
	* @param A The {@link Vector} whose magnitude is to be calculated.
	* @return The {@link Scalar} magnitude of the given {@link Vector}.
	*/
	public static mag(A: Vector): Scalar.Expression;
	public static mag(A: Vector) {
		if(A instanceof Vector.Constant) {
			let m = BigNum.real(0);
			for(let i = 1; i <= A.value.length; i++)
				m = m.add(A.X(i).value.mul(A.X(i).value));
			return Scalar.constant(m.pow(BigNum.real("0.5")));
		}
		return new Scalar.Expression(UnaryOperator.MAG, A);
	}

	/**
	 * For a given constant vector `A`, numerically evaluates the unit vector along `A`.
	 * @param A The {@link Vector.Constant} along which the unit vector is to be calculated.
	 * @return The unit vector along the given {@link Vector} `A`.
	 */
	public static unit(A: Vector.Constant): Vector.Constant;
	/**
	 * For a given variable vector `A`, creates an {@link Expression} for the unit vector along `A`.
	 * @param A The {@link Vector.Constant} along which the unit vector is to be calculated.
	 * @return The unit vector along the given {@link Vector} `A`.
	 */
	public static unit(A: Vector): Vector.Expression;
	public static unit(A: Vector) {
		if(A instanceof Vector.Constant)
			return A.scale(Scalar.constant(1).div(Vector.mag(A)));
		const m = Vector.mag(A);
		return new Vector.Expression(UnaryOperator.UNIT, A, (i: number) => A.X(i).div(m));
	}
}

export namespace Vector {
	/**
	 * A mapping from named vector constants to {@link Vector.Constant} objects.
	 * @ignore
	 */
	const NAMED_CONSTANTS = new Map<string, Vector.Constant>();
	/**
	 * A mapping from name of vector variables to {@link Vector.Variable} objects.
	 * @ignore
	 */
	const VARIABLES = new Map<string, Vector.Variable>();

	/**
	 * @extends {@link Vector}
	 */
	export class Constant extends Vector implements _Constant {
		readonly type = "constant";
		readonly classRef = Vector.Constant;

		/**
		 * The number of dimensions `this` vector exists in.
		 * @ignore
		 */
		// private dimension: number;
		readonly value: Scalar.Constant[] = [];
		/**
		 * The name by which `this` is identified. This is optional and defaults
		 * to the empty string `""`.
		 */
		readonly name: string;

		/**
		 * Creates a {@link Vector.Constant} object from a list of {@link Scalar.Constant}
		 * objects. One may optionally pass in a string by which `this` object
		 * may be identified by.
		 * 
		 * Using the constructor directly for creating vector objects is
		 * not recommended.
		 * 
		 * @see {@link Vector.constant}
		 * @param value The fixed value `this` should represent.
		 * @param name The name by which `this` is identified.
		 */
		constructor(value: Scalar.Constant[], name?: string);
		/**
		 * Creates a {@link Vector.Constant} object from a list of numbers.
		 * One may optionally pass in a string by which `this` object
		 * may be identified by.
		 * 
		 * Using the constructor directly for creating vector objects is
		 * not recommended.
		 * 
		 * @see {@link Vector.constant}
		 * @param value The fixed value `this` should represent.
		 * @param name The name by which `this` is identified.
		 */
		constructor(value: BigNum[], name?: string);
		constructor(value: Scalar.Constant[] | BigNum[], name = "") {
			super();
			this.name = name;
			for(const x of value)
				if(x instanceof Scalar.Constant)
					this.value.push(x);
				else this.value.push(new Scalar.Constant(x));
			// this.dimension = this.value.length;
		}

		/**
		 * Returns the components of `this` vector. The index values start
		 * from `1` instead of the commonly used starting index `0`.
		 * @param i The index of the desired component.
		 * @return The {@link Scalar} element at given index.
		 */
		public get X() {
			const value = this.value;
			return function(i: number) {
				if(i <= 0)
					throw new InvalidIndex(i, 0);
				return (i <= value.length)?value[i - 1]: Scalar.constant(0);
			};
		}

		/**
		 * Checks for equality of two vector constants. The equality check
		 * for floating point numbers becomes problematic in the decimal system.
		 * The binary representation is finite and therefore even if two values
		 * are in fact equal they may not return true by using the `==` or `===`
		 * equality. To tackle this problem we use a tolerance value, if the
		 * difference of the two numerical values is less than that tolerance
		 * value then we can assume the values to be practically equal. Smaller
		 * tolerance values will result in more accurate checks.
		 * This function allows a default tolerance of `1e-14` for floating point numbers.
		 * @param that The value to check equality with.
		 */
		public equals(that: Vector.Constant): boolean;
		/**
		 * Checks for equality of two vector constants. The equality check
		 * for floating point numbers becomes problematic in the decimal system.
		 * The binary representation is finite and therefore even if two values
		 * are in fact equal they may not return true by using the `==` or `===`
		 * equality. To tackle this problem we use a tolerance value, if the
		 * difference of the two numerical values is less than that tolerance
		 * value then we can assume the values to be practically equal. Smaller
		 * tolerance values will result in more accurate checks.
		 * @param that The value to check equality with.
		 * @param tolerance The tolerance permitted for floating point numbers.
		 */
		public equals(that: Vector.Constant, context: MathContext): boolean;
		public equals(that: Vector.Constant, context=mathenv.mode) {
			const m = Math.max(this.value.length, that.value.length);
			for(let i = 1; i <= m; i++)
				if(!this.X(i).value.equals(that.X(i).value, context))
					return false;
			return true;
		}

		/**
		 * Adds two {@link Vector.Constant} objects numerically.
		 * @param that The {@link Vector.Constant} to add to `this`.
		 * @return The vector sum of `this` and `that`.
		 */
		public add(that: Vector.Constant): Vector.Constant;
		/**
		 * Creates and returns a {@link Vector.Expression} for the addition of
		 * two {@link Vector} objects. The {@link type} of `this` does not matter because
		 * adding a variable vector to another vector always results in an expression.
		 * @param that The {@link Vector} to add to `this`.
		 * @return Expression for sum of `this` and `that`.
		 */
		public add(that: Vector.Variable | Vector.Expression): Vector.Expression;
		public add(that: Vector) {
			if(that instanceof Vector.Constant) {
				const m = Math.max(this.value.length, that.value.length);
				const vec: Scalar.Constant[] = [];
				for(let i = 1; i <= m; i++)
					vec.push(this.X(i).add(that.X(i)));
				return new Vector.Constant(vec);
			}
			return new Vector.Expression(BinaryOperator.ADD, this, that, (i: number) => {
				if(i <= 0)
					throw new InvalidIndex(i, 0);
				return (<Scalar>this.X(i)).add(that.X(i));
			});
		}

		/**
		 * Subtracts one {@link Vector.Constant} object from another numerically.
		 * @param that The {@link Vector.Constant} to subtract from `this`.
		 * @return The vector difference of `this` from `that`.
		 */
		public sub(that: Vector.Constant): Vector.Constant;
		/**
		 * Creates and returns a {@link Vector.Expression} for the subtraction of
		 * two {@link Vector} objects. The {@link type} of `this` does not matter because
		 * subtracting a variable vector from another vector always results in an expression.
		 * @param that The {@link Vector} to add to `this`.
		 * @return Expression for subtracting `that` from `this`.
		 */
		public sub(that: Vector.Variable | Vector.Expression): Vector.Expression;
		public sub(that: Vector) {
			if(that instanceof Vector.Constant) {
				const m = Math.max(this.value.length, that.value.length);
				const vec: BigNum[] = [];
				for(let i = 1; i <= m; i++)
					vec.push(this.X(i).value.sub(that.X(i).value));
				return new Vector.Constant(vec);
			}
			return new Vector.Expression(BinaryOperator.SUB, this, that, (i: number) => {
				if(i <= 0)
					throw new InvalidIndex(i, 0);
				return (<Scalar>this.X(i)).sub(that.X(i));
			});
		}

		/**
		 * Calculates the scalar product of two {@link Vector.Constant} objects
		 * numerically.
		 * @param that The {@link Vector.Constant} to compute scalar product with `this`.
		 * @return The inner product of `this` and `that`.
		 */
		public dot(that: Vector.Constant): Scalar.Constant;
		/**
		 * Creates and returns a {@link Vector.Expression} for the dot product of
		 * two {@link Vector} objects. The {@link type} of `this` does not matter because
		 * dot multiplying a variable vector with another vector always results
		 * in an expression.
		 * @param that The {@link Vector} to add to `this`.
		 * @return Expression for inner product of `this` and `that`.
		 */
		public dot(that: Vector.Variable | Vector.Expression): Scalar.Expression;
		public dot(that: Vector) {
			if(that instanceof Vector.Constant) {
				let parallel = BigNum.real(0);
				const m = Math.max(this.value.length, that.value.length);
				for(let i = 1; i <= m; i++)
					parallel = parallel.add(this.X(i).value.mul(that.X(i).value));
				return new Scalar.Constant(parallel);
			}
			return new Scalar.Expression(BinaryOperator.DOT, this, that);
		}

		/**
		 * Calculates the vector product of two {@link Vector.Constant} objects numerically.
		 * @param that The {@link Vector.Constant} to compute cross product with `this`.
		 * @return The vector product of `this` and `that`.
		 */
		// public cross(that: Vector.Constant): Vector.Constant;
		/**
		 * Creates and returns a {@link Vector.Expression} for the cross product of
		 * two {@link Vector} objects. The {@link type} of `this` does not matter because
		 * cross multiplying a variable vector to another vector always results
		 * in an expression.
		 * @param that The {@link Vector} to add to `this`.
		 * @return Expression for vector product of `this` and `that`.
		 */
		// public cross(that: Vector.Variable | Vector.Expression): Vector.Expression;
		public cross(that: Vector) {
			throw new Error("Not implemented");
			// if(this.dimension > 3)
			// 	throw new Error("Cross product defined only in 3 dimensions.");
			// if(that instanceof Vector.Constant) {
			// 	if(that.dimension > 3)
			// 		throw new Error("Cross product defined only in 3 dimensions.");
			// 	const a1 = this.X(1).value, a2 = this.X(2).value, a3 = this.X(3).value;
			// 	const b1 = that.X(1).value, b2 = that.X(2).value, b3 = that.X(3).value;
			// 	return Vector.constant([
			// 		a2 * b3 - a3 * b2,
			// 		a3 * b1 - a1 * b3,
			// 		a1 * b2 - a2 * b1
			// 	]);
			// }
			// return new Vector.Expression(BinaryOperator.CROSS, this, that, (i: number) => {
			// 	if(i <= 0)
			// 		throw new InvalidIndex(i, 0);
			// 	if(this.value.length > 3)
			// 		throw new Error("Cross product defined only in 3 dimensions.");
			// 	const a1 = <Scalar>this.X(1), a2 = <Scalar>this.X(2), a3 = <Scalar>this.X(3);
			// 	const b1 = <Scalar>that.X(1), b2 = <Scalar>that.X(2), b3 = <Scalar>that.X(3);
			// 	return (i === 1)? a2.mul(b3).sub(a3.mul(b2)):
			// 			(i === 2)? a3.mul(b1).sub(a1.mul(b3)):
			// 			a1.mul(b2).sub(a2.mul(b1));
			// });
		}

		/**
		 * Scales `this` {@link Vector.Constant} object numerically.
		 * @param k The scale factor.
		 * @return The scaled vector.
		 */
		public scale(k: Scalar.Constant): Vector.Constant;
		/**
		 * Creates and returns a {@link Vector.Expression} for the scaling of
		 * `this` {@link Vector} object. The {@link type} of `this` does not matter because
		 * scaling a variable vector always results in an expression.
		 * @param k The scale factor.
		 * @return Expression for scaling `this`.
		 */
		public scale(k: Scalar.Variable | Scalar.Expression): Vector.Expression;
		public scale(k: Scalar) {
			if(k instanceof Scalar.Constant)
				return new Vector.Constant(this.value.map(x => k.mul(x).value));
			return new Vector.Expression(BinaryOperator.SCALE, this, k, (i: number) => {
				if(i <= 0)
					throw new InvalidIndex(i, 0);
				return (<Scalar>this.X(i)).mul(k);
			});
		}
	}

	/**
	 * @extends {@link Vector}
	 */
	export class Variable extends Vector implements _Variable {
		readonly type = "variable";
		readonly classRef = Vector.Variable;
		readonly name: string;
		readonly value: (Scalar.Variable | Scalar.Constant)[] = [];

		/**
		 * Creates a {@link Vector.Variable} object.
		 * 
		 * Using the constructor directly for creating vector objects is
		 * not recommended.
		 * 
		 * @see {@link Vector.variable}
		 * @param name The name with which the {@link Vector.Variable} is going to be identified.
		 */
		constructor(name: string);
		/**
		 * Creates a {@link Vector.Variable} object from an array. The array may
		 * contain known {@link Scalar.Constants} and, for the components yet unknown,
		 * {@link Scalar.Variable}. This allows for creation of vectors whose few
		 * components are known before hand and the rest are not.
		 * 
		 * Using the constructor directly for creating vector objects is
		 * not recommended.
		 * 
		 * @see {@link Vector.variable}
		 * @param name The name with which the {@link Vector.Variable} is going to be identified.
		 * @param value The array containing the values with which to initialise the vector variable object.
		 */
		constructor(name: string, value: (Scalar.Variable | Scalar.Constant)[]);
		constructor(a: string, b?: (Scalar.Variable | Scalar.Constant)[]) {
			super();
			this.name = a;
			if(b !== undefined)
				this.value = b;
		}

		/**
		 * Returns the components of `this` vector. The index values start
		 * from `1` instead of the commonly used starting index `0`.
		 * @param i The index of the desired component.
		 * @return The {@link Scalar} element at given index.
		 */
		public get X() {
			return (i: number) => {
				if(i <= 0)
					throw new InvalidIndex(i, 0);
				if(this.value.length === 0)
					return Scalar.variable(this.name + "_" + i);
				return (i <= this.value.length)? this.value[i - 1]: Scalar.constant(0);
			};
		}

		/**
		 * Creates and returns a {@link Vector.Expression} for the addition of
		 * two {@link Vector} objects. The {@link type} of `that` does not matter because
		 * adding a variable vector to another vector always results in an expression.
		 * @param that The {@link Vector} to add to `this`.
		 * @return Expression for sum of `this` and `that`.
		 */
		public add(that: Vector) {
			return new Vector.Expression(BinaryOperator.ADD, this, that, (i: number) => {
				if(i <= 0)
					throw new InvalidIndex(i, 0);
				return (<Scalar>this.X(i)).add(that.X(i));
			});
		}

		/**
		 * Creates and returns a {@link Vector.Expression} for the subtraction of
		 * two {@link Vector} objects. The {@link type} of `that` does not matter because
		 * subtracting a variable vector from another vector always results in an expression.
		 * @param that The {@link Vector} to add to `this`.
		 * @return Expression for subtracting `that` from `this`.
		 */
		public sub(that: Vector) {
			return new Vector.Expression(BinaryOperator.SUB, this, that, (i: number) => {
				if(i <= 0)
					throw new InvalidIndex(i, 0);
				return (<Scalar>this.X(i)).sub(that.X(i));
			});
		}

		/**
		 * Creates and returns a {@link Vector.Expression} for the dot product of
		 * two {@link Vector} objects. The {@link type} of `that` does not matter because
		 * dot multiplying a variable vector with another vector always results
		 * in an expression.
		 * @param that The {@link Vector} to add to `this`.
		 * @return Expression for inner product of `this` and `that`.
		 */
		public dot(that: Vector) {
			return new Scalar.Expression(BinaryOperator.DOT, this, that);
		}

		/**
		 * Creates and returns a {@link Vector.Expression} for the cross product of
		 * two {@link Vector} objects. The {@link type} of `that` does not matter because
		 * cross multiplying a variable vector to another vector always results
		 * in an expression.
		 * @param that The {@link Vector} to add to `this`.
		 * @return Expression for vector product of `this` and `that`.
		 */
		public cross(that: Vector) {
			return new Vector.Expression(BinaryOperator.CROSS, this, that, (i: number) => {
				if(i <= 0)
					throw new Error("Indexing starts from `1`.");
				if(this.value.length > 3)
					throw new Error("Cross product defined only in 3 dimensions.");
				const a1 = <Scalar>this.X(1), a2 = <Scalar>this.X(2), a3 = <Scalar>this.X(3);
				const b1 = <Scalar>that.X(1), b2 = <Scalar>that.X(2), b3 = <Scalar>that.X(3);
				return (i === 1)? a2.mul(b3).sub(a3.mul(b2)):
					(i === 2)? a3.mul(b1).sub(a1.mul(b3)):
						a1.mul(b2).sub(a2.mul(b1));
			});
		}

		/**
		 * Creates and returns a {@link Vector.Expression} for the scaling of
		 * `this` {@link Vector} object. The {@link type} of `that` does not matter because
		 * scaling a variable vector always results in an expression.
		 * @param k The scale factor.
		 * @return Expression for scaling `this`.
		 */
		public scale(k: Scalar) {
			return new Vector.Expression(BinaryOperator.SCALE, this, k, (i: number) => {
				if(i <= 0)
					throw new InvalidIndex(i, 0);
				return (<Scalar>this.X(i)).mul(k);
			});
		}
	}

	/**
	 * @extends {@link Vector}
	 */
	export class Expression extends Vector implements _Expression {
		readonly type = "expression";
		readonly classRef = Vector.Expression;
		readonly arg_list: Set<_Variable>;
		readonly rest: any[];
		readonly operands: Evaluable[] = [];
		/**
		 * Returns the components of `this` vector. The index values start
		 * from `1` instead of the commonly used starting index `0`.
		 * @param i The index of the desired component.
		 * @return The {@link Scalar} element at given index.
		 */
		readonly X: (i: number) => Scalar;

		/**
		 * Creates a vector expression for a binary operator with left and right
		 * hand side arguments.
		 * @param op The root binary operator.
		 * @param lhs The left hand side argument for the root operator.
		 * @param rhs The right hand side argument for the root operator.
		 * @param X The accessor function which defines what the `i`th element should be.
		 */
		constructor(op: BinaryOperator, lhs: Evaluable, rhs: Evaluable, X: (i: number) => Scalar, ...args: any[]);
		/**
		 * Creates a vector expression for a binary operator with left and right
		 * hand side arguments.
		 * @param op The root unary operator.
		 * @param arg The argument for the root operator.
		 * @param X The accessor function which defines what the `i`th element should be.
		 */
		constructor(op: UnaryOperator, arg: Evaluable, X: (i: number) => Scalar, ...args: any[]);
		constructor(readonly op: Operator, ...args: any[]) {
			super();
			let a, b = undefined;
			if(isBinaryOperator(op)) {
				[a, b] = args.slice(0, 2);
				this.operands.push(a, b);
				this.X = args[2];
				this.rest = args.slice(3);
			} else if(isUnaryOperator(op)) {
				a = args[0];
				this.operands.push(a);
				this.X = args[1];
				this.rest = args.slice(2);
			} else throw new Error("Illegal argument.");
			this.arg_list = ExpressionBuilder.createArgList(a, b);
		}

		/**
		 * The left hand side operand for `this.op`.
		 * @throws If `this.op` is a `UnaryOperator`.
		 */
		public get lhs() {
			if(isBinaryOperator(this.op))
				return this.operands[0];
			throw new Error("Unary operators have no left hand argument.");
		}

		/**
		 * The right hand side operand for `this.op`.
		 * @throws If `this.op` is a `UnaryOperator`.
		 */
		public get rhs() {
			if(isBinaryOperator(this.op))
				return this.operands[1];
			throw new Error("Unary operators have no right hand argument.");
		}

		/**
		 * The argument for `this.op`.
		 * @throws If `this.op` is a `BinaryOperator`.
		 */
		public get arg() {
			if(isUnaryOperator(this.op))
				return this.operands[0];
			throw new Error("Binary operators have two arguments.");
		}

		/**
		 * Creates and returns a {@link Vector.Expression} for the addition of
		 * two {@link Vector} objects. The {@link type} of `that` does not matter because
		 * adding an unknown vector/vector expression to another vector always
		 * results in an expression.
		 * @param that The {@link Vector} to add to `this`.
		 * @return Expression for sum of `this` and `that`.
		 */
		public add(that: Vector) {
			return new Vector.Expression(BinaryOperator.ADD, this, that, (i: number) => {
				if(i <= 0)
					throw new InvalidIndex(i, 0);
				return this.X(i).add(that.X(i));
			});
		}

		/**
		 * Creates and returns a {@link Vector.Expression} for the subtraction of
		 * two {@link Vector} objects. The {@link type} of `that` does not matter because
		 * subtracting an unknown vector/vector expression from another vector
		 * always results in an expression.
		 * @param that The {@link Vector} to add to `this`.
		 * @return Expression for subtracting `that` from `this`.
		 */
		public sub(that: Vector) {
			return new Vector.Expression(BinaryOperator.SUB, this, that, (i: number) => {
				if(i <= 0)
					throw new InvalidIndex(i, 0);
				return this.X(i).sub(that.X(i));
			});
		}

		/**
		 * Creates and returns a {@link Vector.Expression} for the dot product of
		 * two {@link Vector} objects. The {@link type} of `that` does not matter because
		 * dot multiplying an unknown vector/vector expression with another vector
		 * always results
		 * in an expression.
		 * @param that The {@link Vector} to add to `this`.
		 * @return Expression for inner product of `this` and `that`.
		 */
		public dot(that: Vector) {
			return new Scalar.Expression(BinaryOperator.DOT, this, that);
		}

		/**
		 * Creates and returns a {@link Vector.Expression} for the cross product of
		 * two {@link Vector} objects. The {@link type} of `that` does not matter because
		 * cross multiplying an unknown vector/vector expression to another vector
		 * always results
		 * in an expression.
		 * @param that The {@link Vector} to add to `this`.
		 * @return Expression for vector product of `this` and `that`.
		 */
		public cross(that: Vector) {
			return new Vector.Expression(BinaryOperator.CROSS, this, that, (i: number) => {
				if(i <= 0)
					throw new Error("Indexing starts from `1`.");
				// if(this.value.length > 3)
				// 	throw new Error("Cross product defined only in 3 dimensions.");
				const a1 = <Scalar>this.X(1), a2 = <Scalar>this.X(2), a3 = <Scalar>this.X(3);
				const b1 = <Scalar>that.X(1), b2 = <Scalar>that.X(2), b3 = <Scalar>that.X(3);
				return (i === 1)? a2.mul(b3).sub(a3.mul(b2)):
					(i === 2)? a3.mul(b1).sub(a1.mul(b3)):
						a1.mul(b2).sub(a2.mul(b1));
			});
		}

		/**
		 * Creates and returns a {@link Vector.Expression} for the scaling of
		 * `this` {@link Vector} object. The {@link type} of `that` does not matter because
		 * scaling an unknown vector/vector expression always results in an expression.
		 * @param k The scale factor.
		 * @return Expression for scaling `this`.
		 */
		public scale(k: Scalar) {
			return new Vector.Expression(BinaryOperator.SCALE, this, k, (i: number) => {
				if(i <= 0)
					throw new InvalidIndex(i, 0);
				return this.X(i).mul(k);
			});
		}

		/**
		 * Checks whether `this` {@link Vector.Expression} depends on a given
		 * {@link Variable}.
		 * @param v The {@link Variable} to check against.
		 */
		public isFunctionOf(v: _Variable) {
			return this.arg_list.has(v);
		}

		/**
		 * Evaluates this {@link Vector.Expression} at the given values for the
		 * {@link Variable} objects `this` depends on. In case `this` is not a
		 * function of any of the variables in the mapping then `this` is returned
		 * as is. 
		 * @param values A map from the {@link Variable} quantities to {@link Constant} quantities.
		 * @return The result after evaluating `this` at the given values.
		 */
		public at(values: Map<_Variable, _Constant>) {
			const res = ExpressionBuilder.evaluateAt(this, values);
			if(isConstant(res))
				return <Vector.Constant>res;
			if(isVariable(res))
				return <Vector.Variable>res;
			return <Vector.Expression>res;
		}
	}

	/**
	 * Creates a new {@link Vector.Constant} object from a list of numbers
	 * if it has not been created before.
	 * Otherwise just returns the previously created object.
	 * 
	 * This is the recommended way of creating {@link Vector.Constant} objects instead of
	 * using the constructor.
	 * @param value The fixed value the {@link Vector.Constant} is supposed to represent.
	 */
	export function constant(value: number[]): Vector.Constant;
	/**
	 * Defines a named {@link Vector.Constant} object from a list of numbers
	 * if it has not been created before.
	 * Otherwise just returns the previously created object.
	 * 
	 * This is the recommended way of creating named {@link Vector.Constant} objects instead of
	 * using the constructor.
	 * @param value The fixed value the {@link Vector.Constant} is supposed to represent.
	 * @param name The string with which `this` object is identified.
	 * @throws Throws an error if a {@link Vector.Constant} with the same name has been defined previously.
	 */
	export function constant(value: number[], name: string): Vector.Constant;
	/**
	 * Creates a new {@link Vector.Constant} object from a list of {@link Scalar.Constant} objects
	 * if it has not been created before.
	 * Otherwise just returns the previously created object.
	 * 
	 * This is the recommended way of creating {@link Vector.Constant} objects instead of
	 * using the constructor.
	 * @param value The fixed value the {@link Vector.Constant} is supposed to represent.
	 */
	export function constant(value: Scalar.Constant[]): Vector.Constant;
	/**
	 * Defines a named {@link Vector.Constant} object from a list of {@link Scalar.Constant} objects
	 * if it has not been created before.
	 * Otherwise just returns the previously created object.
	 * 
	 * This is the recommended way of creating named {@link Vector.Constant} objects instead of
	 * using the constructor.
	 * @param value The fixed value the {@link Vector.Constant} is supposed to represent.
	 * @param name The string with which `this` object is identified.
	 * 
	 * @throws Throws an error if a {@link Vector.Constant} with the same name has been defined previously.
	 */
	export function constant(value: Scalar.Constant[], name: string): Vector.Constant;
	/**
	 * Returns a previously declared named {@link Vector.Constant} object.
	 * @param name The name of the named {@link Vector.Constant} object to be retrieved.
	 */
	export function constant(name: string): Vector.Constant;
	export function constant(a: number[] | Scalar.Constant[] | string, b?: string) {
		let c;
		if(Array.isArray(a)) {
			let values: BigNum[] = [];
			if(typeof a[0] === "number")
				// for(let i = 0; i < a.length; i++)
				values = (<Array<number>>a).map(n => BigNum.real(n));
			else if(a[0] instanceof Scalar.Constant)
				// for(let i = 0; i < a.length; i++)
				values = (<Array<Scalar.Constant>>a).map(n => n.value);
			let i = values.length - 1;
			for(; i >= 0; i--)
				if(!values[i].equals(BigNum.real(0)))
					break;
			values = values.slice(0, i+1);
			if(b === undefined) {
				c = new Vector.Constant(values);
			} else {
				c = NAMED_CONSTANTS.get(b);
				if(c !== undefined)
					throw new Error("Attempt to redefine a constant: A constant with the same name already exists.");
				c = new Vector.Constant(values, b);
				NAMED_CONSTANTS.set(b, c);
			}
		} else {
			c = NAMED_CONSTANTS.get(a);
			if(c === undefined)
				throw new Error("No such constant defined.");
		}
		return c;
	}

	/**
	 * Creates a new {@link Vector.Variable} object if it has not been created before.
	 * Otherwise just returns the previously created object.
	 * 
	 * This is the recommended way of creating {@link Vector.Variable} objects instead of
	 * using the constructor.
	 * @param name The string with which `this` object will be identified.
	 */
	export function variable(name: string): Vector.Variable;
	/**
	 * Creates a {@link Vector.Variable} object from an array. The array may
	 * contain known scalar constants and, for the components yet unknown,
	 * [\_\_](../globals.html#__). Passing ``__`` as an element of the `value` array automatically
	 * gets interpreted as having a variable at that index. This allows for 
	 * creation of vectors whose few components are known before hand and
	 * the rest are not. For example,
	 * ```javascript
	 * const A = Vector.variable("A", [1, __, 4, __, 2]);
	 * console.log(A);
	 * ```
	 * This line of code will create a vector whose 2nd and 4th components are
	 * {@link Scalar.Variable} objects and the remaining will be {@link Scalar.Constant}
	 * objects.
	 * 
	 * This is the recommended way of creating {@link Vector.Variable} objects instead of
	 * using the constructor.
	 * @param name The name with which the {@link Vector.Variable} is going to be identified.
	 * @param value The array containing the values with which to initialise the vector variable object.
	 */
	export function variable(name: string, value: (Scalar.Constant | undefined | number)[]): Vector.Variable;
	export function variable(name: string, value?: (Scalar.Constant | undefined | number)[]) {
		let v = VARIABLES.get(name);
		if(v === undefined) {
			if(value === undefined)
				v = new Vector.Variable(name);
			else {
				const arr: (Scalar.Constant | Scalar.Variable)[] = [];
				if(value !== undefined) {
					let i = value.length - 1;
					for(; i >= 0; i--)
						if(value[i] !== Scalar.constant(0) || value[i] !== 0)
							break;
					for(let j = 0; j <= i; j++) {
						const x = value[j];
						if(x === undefined)
							arr.push(Scalar.variable(name + "_" + (j+1)));
						else if(x instanceof Scalar.Constant)
							arr.push(x);
						else
							arr.push(Scalar.constant(x));
					}
				}
				v = new Vector.Variable(name, arr);
			}
			VARIABLES.set(name, v);
		}
		return v;
	}
}
