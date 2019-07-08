## Function add

<declaration>

public abstract add(that: Scalar): Scalar;

</declaration>

Adds two `Scalar`s together. If `this` and `that` are both constants
then numerically adds the two and returns a new `Scalar.Constant` object
otherwise creates an `Expression` out of them and returns the same.

### Parameters
* **that**: [Scalar](reference/v/0.2.1/quantities/Scalar)<br>
 The scalar to add `this` with.

### Returns
 [Scalar](reference/v/0.2.1/quantities/Scalar):
  The result of algebraic addition.