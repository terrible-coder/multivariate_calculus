## Property operands

<declaration>

readonly operands: Evaluable[];

</declaration>

Array of `Evaluable` quantity/quantities `this.op` operates on.
In case [`this.op`](reference/v/0.2.1/core/definitions/Expression/op) is a
[BinaryOperator](reference/v/0.2.1/core/operators/BinaryOperator), it has 2
elements. If [`this.op`](reference/v/0.2.1/core/definitions/Expression/op) is
a [UnaryOperator](reference/v/0.2.1/core/operators/UnaryOperator) then it only
stores the argument of the function.