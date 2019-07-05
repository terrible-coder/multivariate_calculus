Interface Expression
======

interface Expression<br>
extends [Evaluable](reference/v/0.2.1/core/definitions/Evaluable)

An expression represents a concept whose value depends on one or more
unknowns (variables). That "value" can be evaluated given the value(s) of the
unknown(s). More abstractly, an expression is some combination of constants and
variables to represent a quantity whose value depends on the values of the variables
it depends on.

As defined earlier, an expression is some combination of variables and constants.
The thing which connects those bits together are operators. The `Expression`
interface uses a tree structure to store the different operations which
must be carried out on the operands. The postfix form of this tree would be
identical to the postfix notation of the mathematical expression this object
represents.

### Field Summary

Field | Type | Description
------|------|------
type | `string` | The value of this is fixed, `"expression"`.
arg_list | `Set<Variable>` | A set of `Variable` quantities this `Expression` depends on.
op | `Operator` | The root operator for the postfix tree.
operands | `Evaluable[]` | Array of `Evaluable` quantity/quantities `this.op` operates on.
lhs | `Evaluable` | The left hand side operand for `this.op`.
rhs | `Evaluable` | The right hand side operand for `this.op`.
arg | `Evaluable` | The argument for `this.op`.

### Method Summary

Method | Return type | Description
------|------|------
isFunctionOf | `boolean` | Checks whether `this` expression object depends on the given `Variable`.
at | `Evaluable` | Evaluates `this` expression at the given values of the `Variable` quantities.