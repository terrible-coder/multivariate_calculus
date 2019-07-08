## Function pow

<declaration>

public pow(that: [Scalar](reference/v/0.2.1/quantities/Scalar)): [Scalar.Expression](reference/v/0.2.1/quantities/Scalar.Expression)

</declaration>

Raises `this` scalar expression to the exponent of another scalar. The [type](reference/v/0.2.1/core/definitions/Evaluable/type)
of `that` does not matter, whatever it may be the result of exponentiating
a scalar expression by another scalar is always going to be a scalar expression.

### Parameters
* **that**: [Scalar](reference/v/0.2.1/quantities/Scalar)<br>
 The [Scalar](reference/v/0.2.1/quantities/Scalar) object to the power of which `this` must be raised.

### Returns
[Scalar.Expression](reference/v/0.2.1/quantities/Scalar.Expression):
A [Scalar.Expression](reference/v/0.2.1/quantities/Scalar.Expression) object
representing the scalar expression formed by exponentiating `this` with `that`.