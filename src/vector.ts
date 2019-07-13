import { Token, Evaluable, Constant as _Constant, Variable as _Variable, Expression as _Expression, Operator, isConstant, isVariable } from "./core/definitions";
import { BinaryOperator, isBinaryOperator } from "./core/operators/binary";
import { UnaryOperator, isUnaryOperator } from "./core/operators/unary";
import { ExpressionBuilder } from "./core/expression";
import { Scalar } from "./scalar";

/**
 * Base class to work with vector quantities.
 * @abstract
 */
export abstract class Vector implements Token, Evaluable {
	readonly abstract type: "constant" | "variable" | "expression";
	readonly quantity = "vector";

	/**
	 * Adds two [[Vector]]s together. If `this` and `that` are both constants
	 * then vectorially adds the two and returns a new [[Vector.Constant]] object
	 * otherwise creates an [[Expression]] out of them and returns the same.
	 * @param that The scalar to add `this` with.
	 * @return The result of algebraic addition.
	 */
	public abstract add(that: Vector): Vector;

	/**
	 * Subtracts `that` from `this`. If `this` and `that` are both constants
	 * then vectorially subtracts one from the other and returns a new
	 * [[Vector.Constant]] object otherwise creates an [[Expression]] out of them
	 * and returns the same.
	 * @param that The scalar to subtract from `this`.
	 * @return The result of algebraic subtraction.
	 */
	public abstract sub(that: Vector): Vector;

	/**
	 * Evaluates the scalar product of `this` and `that`. If both are constants
	 * then numerically computes the product and returns a [[Scalar.Constant]] object
	 * otherwise creates an [[Expression]] out of them and returns the same.
	 * @param that The scalar to subtract from `this`.
	 * @return The inner product of `this` and `that`.
	 */
	public abstract dot(that: Vector): Scalar;

	/**
	 * Evaluates the vector product of `this` and `that`. If both are constants
	 * then numerically computes the product and returns a [[Vector.Constant]] object
	 * otherwise creates an [[Expression]] out of them and returns the same.
	 * @param that The scalar to subtract from `this`.
	 * @return The vector product of `this` and `that`.
	 */
	public abstract cross(that: Vector): Vector;

	/**
	 * Scales, or multiplies the "size" (magnitude) of, `this` vector by given
	 * amount. If `this` and `k` are both constants then numerically calculates
	 * the scaled vector otherwise creates an [[Expression]] out of them and
	 * returns the same.
	 * @param k The scale factor.
	 * @return The scaled vector.
	 */
	public abstract scale(k: Scalar): Vector;

	/**
	 * Computes the magnitude of a constant vector numberically.
	 * @param A The [[Vector]] whose magnitude is to be calculated.
	 * @return The [[Scalar]] magnitude of the given [[Vector]].
	 */
	public static mag(A: Vector.Constant): Scalar.Constant;
	/**
	* Computes the magnitude of a given vector. If `A` vector is a constant
	* vector then numerically calculates the magnitude otherwise creates a
	* scalar [[Expression]] and returns the same.
	* @param A The [[Vector]] whose magnitude is to be calculated.
	* @return The [[Scalar]] magnitude of the given [[Vector]].
	*/
	public static mag(A: Vector): Scalar.Expression;
	public static mag(A: Vector) {
		if(A instanceof Vector.Constant) {
			let m = 0;
			for(let i = 1; i <= A.value.length; i++)
				m += Math.pow(A.X(i).value, 2);
			return Scalar.constant(Math.sqrt(m));
		}
		return new Scalar.Expression(BinaryOperator.MAG, <Evaluable><unknown>Vector, A);
	}

	/**
	 * For a given constant vector `A`, numberically evaluates the unit vector along `A`.
	 * @param A The [[Vector.Constant]] along which the unit vector is to be calculated.
	 * @return The unit vector along the given [[Vector]] `A`.
	 */
	public static unit(A: Vector.Constant): Vector.Constant;
	/**
	 * For a given variable vector `A`, creates an [[Expression]] for the unit vector along `A`.
	 * @param A The [[Vector.Constant]] along which the unit vector is to be calculated.
	 * @return The unit vector along the given [[Vector]] `A`.
	 */
	public static unit(A: Vector): Vector.Expression;
	public static unit(A: Vector) {
		if(A instanceof Vector.Constant)
			return A.scale(Scalar.constant(1).div(Vector.mag(A)));
		return new Vector.Expression(BinaryOperator.UNIT, <Evaluable><unknown>Vector, A);
	}
}

export namespace Vector {
	/**
	 * A mapping from stringified vector constants to [[Vector.Constant]] objects.
	 * @ignore
	 */
	const CONSTANTS = new Map<string, Vector.Constant>();
	/**
	 * A mapping from named vector constants to [[Vector.Constant]] objects.
	 * @ignore
	 */
	const NAMED_CONSTANTS = new Map<string, Vector.Constant>();
	/**
	 * A mapping from name of vector variables to [[Vector.Variable]] objects.
	 * @ignore
	 */
	const VARIABLES = new Map<string, Vector.Variable>();

	/**
	 * @extends [[Vector]]
	 */
	export class Constant extends Vector implements _Constant {
		readonly type = "constant";
		/**
		 * The number of dimensions `this` vector exists in.
		 * @ignore
		 */
		private dimesion: number;
		readonly value: Scalar.Constant[] = [];
		/**
		 * The name by which `this` is identified. This is optional and defaults
		 * to the empty string `""`.
		 */
		readonly name: string;

		/**
		 * Creates a [[Vector.Constant]] object from a list of [[Scalar.Constant]]
		 * objects. One may optionally pass in a string by which `this` object
		 * may be identified by.
		 * 
		 * Using the contructor directly for creating vector objects is
		 * not recommended.
		 * 
		 * @see [[Vector.constant]]
		 * @param value The fixed value `this` should represent.
		 * @param name The name by which `this` is identified.
		 */
		constructor(value: Scalar.Constant[], name?: string);
		/**
		 * Creates a [[Vector.Constant]] object from a list of numbers.
		 * One may optionally pass in a string by which `this` object
		 * may be identified by.
		 * 
		 * Using the contructor directly for creating vector objects is
		 * not recommended.
		 * 
		 * @see [[Vector.constant]]
		 * @param value The fixed value `this` should represent.
		 * @param name The name by which `this` is identified.
		 */
		constructor(value: number[], name?: string);
		constructor(value: Scalar.Constant[] | number[], name = "") {
			super();
			this.name = name;
			//value.forEach((x: any) => this.value.push(x instanceof Scalar.Constant? x: Scalar.constant(x)));
			for(let x of value)
				if(x instanceof Scalar.Constant)
					this.value.push(x);
				else this.value.push(Scalar.constant(x));
			this.dimesion = this.value.length;
		}

		/**
		 * Returns the components of `this` vector. The index values start
		 * from `1` instead of the commonly used starting index `0`.
		 * @param i The index of the desired component.
		 * @return The [[Scalar]] element at given index.
		 */
		public get X() {
			const value = this.value;
			return function(i: number) {
				if(i <= 0)
					throw "Indexing starts from `1`";
				return (i <= value.length)?value[i - 1]: Scalar.constant(0);
			}
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
		public equals(that: Vector.Constant, tolerance: number): boolean;
		public equals(that: Vector.Constant, tolerance = 1e-14) {
			const m = Math.max(this.value.length, that.value.length);
			for(let i = 1; i <= m; i++)
				if(Math.abs(this.X(i).value - that.X(i).value) >= tolerance)
					return false;
			return true;
		}

		/**
		 * Adds two [[Vector.Constant]] objects numerically.
		 * @param that The [[Vector.Constant]] to add to `this`.
		 * @return The vector sum of `this` and `that`.
		 */
		public add(that: Vector.Constant): Vector.Constant;
		/**
		 * Creates and returns a [[Vector.Expression]] for the addition of
		 * two [[Vector]] objects. The [[type]] of `this` does not matter because
		 * adding a variable vector to another vector always results in an expresion.
		 * @param that The [[Vector]] to add to `this`.
		 * @return Expression for sum of `this` and `that`.
		 */
		public add(that: Vector.Variable | Vector.Expression): Vector.Expression;
		public add(that: Vector) {
			if(that instanceof Vector.Constant) {
				const m = Math.max(this.value.length, that.value.length);
				const vec: number[] = [];
				for(let i = 1; i <= m; i++)
					vec.push(this.X(i).value + that.X(i).value);
				return Vector.constant(vec);
			}
			return new Vector.Expression(BinaryOperator.ADD, this, that);
		}

		/**
		 * Subtracts one [[Vector.Constant]] object from another numerically.
		 * @param that The [[Vector.Constant]] to subtract from `this`.
		 * @return The vector difference of `this` from `that`.
		 */
		public sub(that: Vector.Constant): Vector.Constant;
		/**
		 * Creates and returns a [[Vector.Expression]] for the subtraction of
		 * two [[Vector]] objects. The [[type]] of `this` does not matter because
		 * subtracting a variable vector from another vector always results in an expresion.
		 * @param that The [[Vector]] to add to `this`.
		 * @return Expression for subtracting `that` from `this`.
		 */
		public sub(that: Vector.Variable | Vector.Expression): Vector.Expression;
		public sub(that: Vector) {
			if(that instanceof Vector.Constant) {
				const m = Math.max(this.value.length, that.value.length);
				const vec: number[] = [];
				for(let i = 1; i <= m; i++)
					vec.push(this.X(i).value - that.X(i).value);
				return Vector.constant(vec);
			}
			return new Vector.Expression(BinaryOperator.SUB, this, that);
		}

		/**
		 * Calculates the scalar product of two [[Vector.Constant]] objects
		 * numerically.
		 * @param that The [[Vector.Constant]] to compute scalar product with `this`.
		 * @return The inner product of `this` and `that`.
		 */
		public dot(that: Vector.Constant): Scalar.Constant;
		/**
		 * Creates and returns a [[Vector.Expression]] for the dot product of
		 * two [[Vector]] objects. The [[type]] of `this` does not matter because
		 * dot multiplying a variable vector with another vector always results
		 * in an expresion.
		 * @param that The [[Vector]] to add to `this`.
		 * @return Expression for inner product of `this` and `that`.
		 */
		public dot(that: Vector.Variable | Vector.Expression): Scalar.Expression;
		public dot(that: Vector) {
			if(that instanceof Vector.Constant) {
				let parallel = 0;
				const m = Math.max(this.value.length, that.value.length);
				for(let i = 1; i <= m; i++)
					parallel += this.X(i).value * that.X(i).value;
				return Scalar.constant(parallel);
			}
			return new Scalar.Expression(BinaryOperator.DOT, this, that);
		}

		/**
		 * Calculates the vector product of two [[Vector.Constant]] objects numerically.
		 * @param that The [[Vector.Constant]] to compute cross product with `this`.
		 * @return The vector product of `this` and `that`.
		 */
		public cross(that: Vector.Constant): Vector.Constant;
		/**
		 * Creates and returns a [[Vector.Expression]] for the cross product of
		 * two [[Vector]] objects. The [[type]] of `this` does not matter because
		 * cross multiplying a variable vector to another vector always results
		 * in an expresion.
		 * @param that The [[Vector]] to add to `this`.
		 * @return Expression for vector product of `this` and `that`.
		 */
		public cross(that: Vector.Variable | Vector.Expression): Vector.Expression;
		public cross(that: Vector) {
			if(this.dimesion > 3)
				throw "Cross product defined only in 3 dimensions.";
			if(that instanceof Vector.Constant) {
				if(that.dimesion > 3)
					throw "Cross product defined only in 3 dimensions.";
				const a1 = this.X(1).value, a2 = this.X(2).value, a3 = this.X(3).value;
				const b1 = that.X(1).value, b2 = that.X(2).value, b3 = that.X(3).value;
				return Vector.constant([
					a2 * b3 - a3 * b2,
					a3 * b1 - a1 * b3,
					a1 * b2 - a2 * b1
				]);
			}
			return new Vector.Expression(BinaryOperator.CROSS, this, that);
		}

		/**
		 * Scales `this` [[Vector.Constant]] object numerically.
		 * @param k The scale factor.
		 * @return The scaled vector.
		 */
		public scale(k: Scalar.Constant): Vector.Constant;
		/**
		 * Creates and returns a [[Vector.Expression]] for the scaling of
		 * `this` [[Vector]] object. The [[type]] of `this` does not matter because
		 * scaling a variable vector always results in an expresion.
		 * @param k The scale factor.
		 * @return Expression for scaling `this`.
		 */
		public scale(k: Scalar.Variable | Scalar.Expression): Vector.Expression;
		public scale(k: Scalar) {
			if(k instanceof Scalar.Constant)
				return Vector.constant(this.value.map(x => k.mul(x).value));
			return new Vector.Expression(BinaryOperator.SCALE, this, k);
		}
	}

	/**
	 * @extends [[Vector]]
	 */
	export class Variable extends Vector implements _Variable {
		readonly type = "variable";

		/**
		 * Creates a [[Vector.Variable]] object.
		 * 
		 * Using the contructor directly for creating vector objects is
		 * not recommended.
		 * 
		 * @see [[Vector.variable]]
		 * @param name The name with which the [[Vector.Variable]] is going to be identified.
		 */
		constructor(readonly name: string) {
			super();
		}

		/**
		 * Creates and returns a [[Vector.Expression]] for the addition of
		 * two [[Vector]] objects. The [[type]] of `that` does not matter because
		 * adding a variable vector to another vector always results in an expresion.
		 * @param that The [[Vector]] to add to `this`.
		 * @return Expression for sum of `this` and `that`.
		 */
		public add(that: Vector) {
			return new Vector.Expression(BinaryOperator.ADD, this, that);
		}

		/**
		 * Creates and returns a [[Vector.Expression]] for the subtraction of
		 * two [[Vector]] objects. The [[type]] of `that` does not matter because
		 * subtracting a variable vector from another vector always results in an expresion.
		 * @param that The [[Vector]] to add to `this`.
		 * @return Expression for subtracting `that` from `this`.
		 */
		public sub(that: Vector) {
			return new Vector.Expression(BinaryOperator.SUB, this, that);
		}

		/**
		 * Creates and returns a [[Vector.Expression]] for the dot product of
		 * two [[Vector]] objects. The [[type]] of `that` does not matter because
		 * dot multiplying a variable vector with another vector always results
		 * in an expresion.
		 * @param that The [[Vector]] to add to `this`.
		 * @return Expression for inner product of `this` and `that`.
		 */
		public dot(that: Vector) {
			return new Scalar.Expression(BinaryOperator.DOT, this, that);
		}

		/**
		 * Creates and returns a [[Vector.Expression]] for the cross product of
		 * two [[Vector]] objects. The [[type]] of `that` does not matter because
		 * cross multiplying a variable vector to another vector always results
		 * in an expresion.
		 * @param that The [[Vector]] to add to `this`.
		 * @return Expression for vector product of `this` and `that`.
		 */
		public cross(that: Vector) {
			return new Vector.Expression(BinaryOperator.CROSS, this, that);
		}

		/**
		 * Creates and returns a [[Vector.Expression]] for the scaling of
		 * `this` [[Vector]] object. The [[type]] of `that` does not matter because
		 * scaling a variable vector always results in an expresion.
		 * @param k The scale factor.
		 * @return Expression for scaling `this`.
		 */
		public scale(k: Scalar) {
			return new Vector.Expression(BinaryOperator.SCALE, this, k);
		}
	}

	/**
	 * @extends [[Vector]]
	 */
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

		/**
		 * Creates and returns a [[Vector.Expression]] for the addition of
		 * two [[Vector]] objects. The [[type]] of `that` does not matter because
		 * adding an unknown vector/vector expression to another vector always
		 * results in an expresion.
		 * @param that The [[Vector]] to add to `this`.
		 * @return Expression for sum of `this` and `that`.
		 */
		public add(that: Vector) {
			return new Vector.Expression(BinaryOperator.ADD, this, that);
		}

		/**
		 * Creates and returns a [[Vector.Expression]] for the subtraction of
		 * two [[Vector]] objects. The [[type]] of `that` does not matter because
		 * subtracting an unknown vector/vector expression from another vector
		 * always results in an expresion.
		 * @param that The [[Vector]] to add to `this`.
		 * @return Expression for subtracting `that` from `this`.
		 */
		public sub(that: Vector) {
			return new Vector.Expression(BinaryOperator.SUB, this, that);
		}

		/**
		 * Creates and returns a [[Vector.Expression]] for the dot product of
		 * two [[Vector]] objects. The [[type]] of `that` does not matter because
		 * dot multiplying an unknown vector/vector expression with another vector
		 * always results
		 * in an expresion.
		 * @param that The [[Vector]] to add to `this`.
		 * @return Expression for inner product of `this` and `that`.
		 */
		public dot(that: Vector) {
			return new Scalar.Expression(BinaryOperator.DOT, this, that);
		}

		/**
		 * Creates and returns a [[Vector.Expression]] for the cross product of
		 * two [[Vector]] objects. The [[type]] of `that` does not matter because
		 * cross multiplying an unknown vector/vector expression to another vector
		 * always results
		 * in an expresion.
		 * @param that The [[Vector]] to add to `this`.
		 * @return Expression for vector product of `this` and `that`.
		 */
		public cross(that: Vector) {
			return new Vector.Expression(BinaryOperator.CROSS, this, that);
		}

		/**
		 * Creates and returns a [[Vector.Expression]] for the scaling of
		 * `this` [[Vector]] object. The [[type]] of `that` does not matter because
		 * scaling an unknown vector/vector expression always results in an expresion.
		 * @param k The scale factor.
		 * @return Expression for scaling `this`.
		 */
		public scale(k: Scalar) {
			return new Vector.Expression(BinaryOperator.SCALE, this, k);
		}

		/**
		 * Checks whether `this` [[Vector.Expression]] depends on a given
		 * [[Variable]].
		 * @param v The [[Variable]] to check against.
		 */
		public isFunctionOf(v: _Variable) {
			return this.arg_list.has(v);
		}

		/**
		 * Evaluates this [[Vector.Expression]] at the given values for the
		 * [[Variable]] objects `this` depends on. In case `this` is not a
		 * function of any of the variables in the mapping then `this` is returned
		 * as is. 
		 * @param values A map from the [[Variable]] quantities to [[Constant]] quantities.
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
	 * Creates a new [[Vector.Constant]] object from a list of numbers
	 * if it has not been created before.
	 * Otherwise just returns the previously created object.
	 * 
	 * This is the recommended way of creating [[Vector.Constant]] objects instead of
	 * using the constructor.
	 * @param value The fixed value the [[Vector.Constant]] is supposed to represent.
	 */
	export function constant(value: number[]): Vector.Constant;
	/**
	 * Defines a named [[Vector.Constant]] object from a list of numbers
	 * if it has not been created before.
	 * Otherwise just returns the previously created object.
	 * 
	 * This is the recommended way of creating named [[Vector.Constant]] objects instead of
	 * using the constructor.
	 * @param value The fixed value the [[Vector.Constant]] is supposed to represent.
	 * @param name The string with which `this` object is identified.
	 * @throws Throws an error if a [[Vector.Constant]] with the same name has been defined previously.
	 */
	export function constant(value: number[], name: string): Vector.Constant;
	/**
	 * Creates a new [[Vector.Constant]] object from a list of [[Scalar.Constant]] objects
	 * if it has not been created before.
	 * Otherwise just returns the previously created object.
	 * 
	 * This is the recommended way of creating [[Vector.Constant]] objects instead of
	 * using the constructor.
	 * @param value The fixed value the [[Vector.Constant]] is supposed to represent.
	 */
	export function constant(value: Scalar.Constant[]): Vector.Constant;
	/**
	 * Defines a named [[Vector.Constant]] object from a list of [[Scalar.Constant]] objects
	 * if it has not been created before.
	 * Otherwise just returns the previously created object.
	 * 
	 * This is the recommended way of creating named [[Vector.Constant]] objects instead of
	 * using the constructor.
	 * @param value The fixed value the [[Vector.Constant]] is supposed to represent.
	 * @param name The string with which `this` object is identified.
	 * 
	 * @throws Throws an error if a [[Vector.Constant]] with the same name has been defined previously.
	 */
	export function constant(value: Scalar.Constant[], name: string): Vector.Constant;
	/**
	 * Returns a previously declared named [[Vector.Constant]] object.
	 * @param name The name of the named [[Vector.Constant]] object to be retrieved.
	 */
	export function constant(name: string): Vector.Constant;
	export function constant(a: number[] | Scalar.Constant[] | string, b?: string) {
		let c;
		if(Array.isArray(a)) {
			const values: number[] = [];
			if(typeof a[0] === "number")
				for(let i = 0; i < a.length; i++)
					values.push(<number>a[i]);
			else if(a[0] instanceof Scalar.Constant)
				for(let i = 0; i < a.length; i++)
					values.push((<Scalar.Constant>a[i]).value);
			let i = values.length - 1;
			for(; i >= 0; i--)
				if(values[i] !== 0)
					break;
			const key = values.slice(0, i+1).join();
			if(b === undefined) {
				c = CONSTANTS.get(key);
				if(c === undefined) {
					c = new Vector.Constant(values);
					CONSTANTS.set(key, c);
				}
			} else {
				c = NAMED_CONSTANTS.get(b);
				if(c !== undefined)
					throw "Attempt to redefine a constant: A constant with the same name already exists.";
				c = new Vector.Constant(values, b);
				NAMED_CONSTANTS.set(b, c);
			}
		} else {
			c = NAMED_CONSTANTS.get(a);
			if(c === undefined)
				throw "No such constant defined.";
		}
		return c;
	}

	/**
	 * Creates a new [[Vector.Variable]] object if it has not been created before.
	 * Otherwise just returns the previously created object.
	 * 
	 * This is the recommended way of creating [[Vector.Variable]] objects instead of
	 * using the constructor.
	 * @param name The string with which `this` object will be identified.
	 */
	export function variable(name: string) {
		let v = VARIABLES.get(name);
		if(v === undefined) {
			v = new Vector.Variable(name);
			VARIABLES.set(name, v);
		}
		return v;
	}
}
