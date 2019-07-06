Class Scalar
======

<span class="flag flag-abstract">abstract</span> class Scalar<br>
implements [Token](reference/v/0.2.1/core/definitions/Token), [Evaluable](reference/v/0.2.1/core/definitions/Evaluable)

This class abstracts a scalar quantity. A scalar is a type of physical
quantity which remains invariant under coordinate transform. What this means
is that the value of a scalar does not depend on the coordinate system and the
coordinate axes in a given situation.

### Nested classes
<div class="grid-container">
<div class="grid-item"> Constant </div>
<div class="grid-item"> Variable </div>
<div class="grid-item"> Expression </div>
</div>

### Properties
<div class="grid-container">
<div class="grid-item"> type </div>
<div class="grid-item"> quantity </div>
</div>

### Methods
<div class="grid-container">
<div class="grid-item"> add </div>
<div class="grid-item"> sub </div>
<div class="grid-item"> mul </div>
<div class="grid-item"> div </div>
<div class="grid-item"> pow </div>
<div class="grid-item"> constant </div>
<div class="grid-item"> variable </div>
</div>