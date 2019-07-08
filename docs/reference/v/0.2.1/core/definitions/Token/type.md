## Property type

<declaration>

<flag class="readonly">readonly</flag> type: "operator" | "expression" | "variable" | "constant";

</declaration>

Stores the type of [Token](reference/v/0.2.1/core/definitions/Token)
`this` represents. It is limited to only a few permitted values:

* `"operator"`: Indicates that `this` is an `Operator`
* `"expression"`: Indicates that `this` is an [Expression](reference/v/0.2.1/core/definitions/Expression)
* `"variable"`: Indicates that `this` is a [Variable](reference/v/0.2.1/core/definitions/Variable)
* `"constant"`: Indicates that `this` is a [Constant](reference/v/0.2.1/core/definitions/Constant)