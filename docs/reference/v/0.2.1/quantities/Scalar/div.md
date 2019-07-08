## Function div

<declaration>

public abstract div(that: [Scalar](reference/v/0.2.1/quantities/Scalar)): [Scalar](reference/v/0.2.1/quantities/Scalar);

</declaration>

Divides `this` by `that`. If `this` and `that` are both constants
then numerically divides the two and returns a new `Scalar.Constant` object
otherwise creates an `Expression` out of them and returns the same.

### Parameters
* **that**: [Scalar](reference/v/0.2.1/quantities/Scalar)<br>
 The scalar to divide `this` by.

### Returns
 [Scalar](reference/v/0.2.1/quantities/Scalar):
  The result of algebraic division.