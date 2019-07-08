## Property arg

<declaration>

<flag class="readonly">readonly</flag> lhs: Evaluable;

</declaration>

The argument for [`this.op`](reference/v/0.2.1/quantities/Scalar.Expression/op).
This value should be available only when [`this.op`](reference/v/0.2.1/quantities/Scalar.Expression/op)
is a [UnaryOperator](reference/v/0.2.1/core/operators/UnaryOperator).

### Throws
 If [`this.op`](reference/v/0.2.1/quantities/Scalar.Expression/op) is a
 [BinaryOperator](reference/v/0.2.1/core/operators/BinaryOperator).