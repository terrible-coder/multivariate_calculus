## Function mul

public abstract mul(that: [Scalar](reference/v/0.2.1/quantities/Scalar)): [Scalar](reference/v/0.2.1/quantities/Scalar);

Multiplies two `Scalar`s together. If `this` and `that` are both constants
then numerically multiplies the two and returns a new `Scalar.Constant` object
otherwise creates an `Expression` out of them and returns the same.

### Parameters
* **that**: [Scalar](reference/v/0.2.1/quantities/Scalar)<br>
 The scalar to multiply `this` with.

### Returns
 [Scalar](reference/v/0.2.1/quantities/Scalar):
  The result of algebraic multiplication.