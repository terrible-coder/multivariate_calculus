## Property type

readonly type: "expression" | "variable" | "constant";

Stores the type of [Evaluable](reference/v/0.2.1/core/definitions/Evaluable)
`this` represents. It is limited to only a few permitted values:

* `"expression"`: Indicates that `this` is an [Expression](reference/v/0.2.1/core/definitions/Expression)
* `"variable"`: Indicates that `this` is a [Variable](reference/v/0.2.1/core/definitions/Variable)
* `"constant"`: Indicates that `this` is a [Constant](reference/v/0.2.1/core/definitions/Constant)