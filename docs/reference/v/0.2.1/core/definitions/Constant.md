Interface Constant
======

interface Constant<br>
extends [Evaluable](reference/v/0.2.1/core/definitions/Evaluable)

A constant is such a quantity whose value is known and remains fixed always.

### Field Summary

Field | Type | Description
------|------|------
type | `string` | The value of this is fixed, `"constant"`.
value | `any` | The value represented by this object.
name | `string` | The optional name given to this constant.

### Method Summary

Method | Return type | Description
------|--------|--------
equals | `boolean` | Checks for the equality of two constant quantities.