## Function sub

<declaration>

public sub(that: [Scalar](reference/v/0.2.1/quantities/Scalar)): [Scalar.Expression](reference/v/0.2.1/quantities/Scalar.Expression)

</declaration>

Subtracts a scalar from `this` scalar expression. The [type](reference/v/0.2.1/core/definitions/Evaluable/type)
of `that` does not matter, whatever it may be the result of subtracting `that` from
a scalar expression is always going to be a scalar expression.

### Parameters
* **that**: [Scalar](reference/v/0.2.1/quantities/Scalar)<br>
 The [Scalar](reference/v/0.2.1/quantities/Scalar) object to subtract from `this`.

### Returns
[Scalar.Expression](reference/v/0.2.1/quantities/Scalar.Expression):
A [Scalar.Expression](reference/v/0.2.1/quantities/Scalar.Expression) object
representing the scalar expression formed by subtracting `that` from `this`.