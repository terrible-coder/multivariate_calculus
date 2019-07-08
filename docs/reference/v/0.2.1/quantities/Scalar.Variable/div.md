## Function div

<declaration>

public div(that: [Scalar](reference/v/0.2.1/quantities/Scalar)): [Scalar.Expression](reference/v/0.2.1/quantities/Scalar.Expression)

</declaration>

Divides `this` variable scalar by another scalar. The [type](reference/v/0.2.1/core/definitions/Evaluable/type)
of `that` does not matter, whatever it may be the result of dividing
a variable scalar by `that` is always going to be a scalar expression.

### Parameters
* **that**: [Scalar](reference/v/0.2.1/quantities/Scalar)<br>
 The [Scalar](reference/v/0.2.1/quantities/Scalar) object to divide `this` by.

### Returns
[Scalar.Expression](reference/v/0.2.1/quantities/Scalar.Expression):
A [Scalar.Expression](reference/v/0.2.1/quantities/Scalar.Expression) object
representing the scalar expression formed by dividing `this` by `that`.