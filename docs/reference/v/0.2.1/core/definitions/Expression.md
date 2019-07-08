Interface Expression
======

<declaration>

interface Expression<br>
extends [Evaluable](reference/v/0.2.1/core/definitions/Evaluable)

</declaration>

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

### Properties

<div class="grid-container">
<div class="grid-item"><a href="/#/reference/v/0.2.1/core/definitions/Expression/type">type</a></div>
<div class="grid-item"><a href="/#/reference/v/0.2.1/core/definitions/Expression/arg_list">arg_list</a></div>
<div class="grid-item"><a href="/#/reference/v/0.2.1/core/definitions/Expression/op">op</a></div>
<div class="grid-item"><a href="/#/reference/v/0.2.1/core/definitions/Expression/operands">operands</a></div>
<div class="grid-item"><a href="/#/reference/v/0.2.1/core/definitions/Expression/lhs">lhs</a></div>
<div class="grid-item"><a href="/#/reference/v/0.2.1/core/definitions/Expression/rhs">rhs</a></div>
<div class="grid-item"><a href="/#/reference/v/0.2.1/core/definitions/Expression/arg">arg</a></div>
</div>

### Methods

<div class="grid-container">
<div class="grid-item"><a href="/#/reference/v/0.2.1/core/definitions/Expression/isFunctionOf">isFunctionOf</a></div>
<div class="grid-item"><a href="/#/reference/v/0.2.1/core/definitions/Expression/at">at</a></div>
</div>