## Function sub

public sub(that: [Scalar.Constant](reference/v/0.2.1/quantities/Scalar.Constant)): [Scalar.Constant](reference/v/0.2.1/quantities/Scalar.Constant);

Subtracts one constant scalar from another constant scalars.

### Parameters
* **that**: [Scalar.Constant](reference/v/0.2.1/quantities/Scalar.Constant)<br>
 The [Scalar.Constant](reference/v/0.2.1/quantities/Scalar.Constant) object to subtract from `this`.

### Returns
[Scalar.Constant](reference/v/0.2.1/quantities/Scalar.Constant):
A constant [Scalar](reference/v/0.2.1/quantities/Scalar) object whose [value](reference/v/0.2.1/core/definitions/Constant/value) is
equal to the algebraic difference of the values of `this` and `that`.

-------------------

public sub(that: [Scalar.Variable](reference/v/0.2.1/quantities/Scalar.Variable) | [Scalar.Expression](reference/v/0.2.1/quantities/Scalar.Expression)): [Scalar.Expression](reference/v/0.2.1/quantities/Scalar.Expression);

Adds a constant scalar to an unknown scalar. The unknown [Scalar](reference/v/0.2.1/quantities/Scalar) may be a
[Scalar.Variable](reference/v/0.2.1/quantities/Scalar.Variable) object or a [Scalar.Expression](reference/v/0.2.1/quantities/Scalar.Expression) object.

### Parameters
* **that**: [Scalar.Variable](reference/v/0.2.1/quantities/Scalar.Variable) | [Scalar.Expression](reference/v/0.2.1/quantities/Scalar.Expression)<br>
 The unknown [Scalar](reference/v/0.2.1/quantities/Scalar) quantity to subtract from `this`.

### Returns
[Scalar.Expression](reference/v/0.2.1/quantities/Scalar.Expression): The scalar [Expression](reference/v/0.2.1/core/definitions/Expression) which results from subtracting the variable/unknown scalar from `this`.