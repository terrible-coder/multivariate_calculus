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

### Properties

<div class="grid-container">
<div class="grid-item"> type </div>
<div class="grid-item"> arg_list </div>
<div class="grid-item"> op </div>
<div class="grid-item"> operands </div>
<div class="grid-item"> lhs </div>
<div class="grid-item"> rhs </div>
<div class="grid-item"> arg </div>
</div>

### Methods

<div class="grid-container">
<div class="grid-item"> isFunctionOf </div>
<div class="grid-item"> at </div>
</div>