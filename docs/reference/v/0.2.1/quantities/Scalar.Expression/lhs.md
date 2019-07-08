## Property lhs

readonly lhs: Evaluable;

The left hand side operand for [`this.op`](reference/v/0.2.1/quantities/Scalar.Expression/op).
This value should be available only when [`this.op`](reference/v/0.2.1/quantities/Scalar.Expression/op)
is a [BinaryOperator](reference/v/0.2.1/core/operators/BinaryOperator).

### Throws
 If [`this.op`](reference/v/0.2.1/quantities/Scalar.Expression/op) is a
 [UnaryOperator](reference/v/0.2.1/core/operators/UnaryOperator).