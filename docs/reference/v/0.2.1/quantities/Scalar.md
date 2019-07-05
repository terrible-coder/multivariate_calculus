Class Scalar
======

abstract class Scalar<br>
implements [Token](reference/v/0.2.1/core/definitions/Token), [Evaluable](reference/v/0.2.1/core/definitions/Evaluable)

This class abstracts a scalar quantity. A scalar is a type of physical
quantity which remains invariant under coordinate transform. What this means
is that the value of a scalar does not depend on the coordinate system and the
coordinate axes in a given situation.

### Nested class summary

Class | Description
------|------
static Constant | Represents a constant scalar quantity with a fixed value.
static Variable | Represents a variable scalar quantity with no fixed value.
static Expression | Represents an expression whose ultimate value is of type `Scalar`.

### Field summary

Field | Type | Description
------|------|------
type | `string` | The type of evaluable quantity this is.<br>Permitted values: `"constant"`, `"variable"`, `"expression"`.
quantity | `string` | This field has a fixed value: `"scalar"`.

### Method summary

Method | Return type | Description
------|------|------
abstract add | `Scalar` | Adds two `Scalar` quantities together.
abstract sub | `Scalar` | Subtracts that `Scalar` from this.
abstract mul | `Scalar` | Multiples two `Scalar` quantities together.
abstract div | `Scalar` | Divides this `Scalar` by that.
abstract pow | `Scalar` | Raises this `Scalar` to the power of that.
static constant | `Scalar.Constant` | Creates a `Scalar.Constant` object.
static variable | `Scalar.Constant` | Creates a `Scalar.Variable` object.