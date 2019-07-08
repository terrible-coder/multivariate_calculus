## Function at

at(values: Map<[Variable](reference/v/0.2.1/core/definitions/Variable), [Constant](reference/v/0.2.1/core/definitions/Constant)>): [Scalar.Constant](reference/v/0.2.1/quantities/Scalar.Constant) | [Scalar.Variable](reference/v/0.2.1/quantities/Scalar.Variable) | [Scalar.Expression](reference/v/0.2.1/quantities/Scalar.Expression);

Evaluates `this` [Scalar.Expression](reference/v/0.2.1/quantities/Scalar.Expression) at the given values of the [Variable](reference/v/0.2.1/core/definitions/Variable) quantities.

### Parameters

* **values**: Map<[Variable](reference/v/0.2.1/core/definitions/Variable), [Constant](reference/v/0.2.1/core/definitions/Constant)>

 A map from the [Variables](reference/v/0.2.1/core/definitions/Variable) `this` depends on
 to the [Constants](reference/v/0.2.1/core/definitions/Constant) with which they are to be replaced.
 In case [values](reference/v/0.2.1/core/definitions/Expression/at/#values) contains a
 [Variable](reference/v/0.2.1/core/definitions/Variable) which `this` does not depend on
 then it is just left alone.

### Returns
- [Scalar.Constant](reference/v/0.2.1/quantities/Scalar.Constant): if after substituing the constants for the given variables the result is a [Scalar.Constant](reference/v/0.2.1/quantities/Scalar.Constant).
- [Scalar.Variable](reference/v/0.2.1/quantities/Scalar.Variable): if after substituing the constants for the given variables the result is a [Scalar.Variable](reference/v/0.2.1/quantities/Scalar.Variable).
- [Scalar.Expression](reference/v/0.2.1/quantities/Scalar.Expression): if after substituing the constants for the given variables the result is a [Scalar.Expression](reference/v/0.2.1/quantities/Scalar.Expression).