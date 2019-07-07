## Function pow

public abstract pow(that: [Scalar](reference/v/0.2.1/quantities/Scalar)): [Scalar](reference/v/0.2.1/quantities/Scalar);

Raises `this` scalar to the power of `that`. If `this` and `that` are both constants
then numerically evaluates the exponentiation and returns a new `Scalar.Constant` object
otherwise creates an `Expression` out of them and returns the same.

### Parameters
* **that**: [Scalar](reference/v/0.2.1/quantities/Scalar)<br>
 The scalar power to which `this` must be raised.

### Returns
 [Scalar](reference/v/0.2.1/quantities/Scalar):
 The result of algebraic exponentiation.