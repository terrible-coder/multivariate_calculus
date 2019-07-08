## Function sub

<declaration>

public abstract sub(that: [Scalar](reference/v/0.2.1/quantities/Scalar)): [Scalar](reference/v/0.2.1/quantities/Scalar);

</declaration>

Subtracts `this` from `that`. If `this` and `that` are both constants
then numerically subtracts one from the other and returns a new `Scalar.Constant` object
otherwise creates an `Expression` out of them and returns the same.

### Parameters
* **that**: [Scalar](reference/v/0.2.1/quantities/Scalar)<br>
 The scalar to subtract from `this`.

### Returns
 [Scalar](reference/v/0.2.1/quantities/Scalar):
  The result of algebraic difference.