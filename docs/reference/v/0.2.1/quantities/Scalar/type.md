## Property type

readonly type: "operator" | "expression" | "variable" | "constant";

Stores the type of [Token](reference/v/0.2.1/core/definitions/Token)
`this` represents. It is limited to only a few permitted values:

* `"expression"`: Indicates that `this` is a [Scalar.Expression](reference/v/0.2.1/quantities/Scalar.Expression)
* `"variable"`: Indicates that `this` is a [Scalar.Variable](reference/v/0.2.1/quantities/Scalar.Variable)
* `"constant"`: Indicates that `this` is a [Scalar.Constant](reference/v/0.2.1/quantities/Scalar.Constant)