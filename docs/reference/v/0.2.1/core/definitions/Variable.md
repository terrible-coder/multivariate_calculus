Interface Variable
======

interface Variable<br>
extends [Evaluable](reference/v/0.2.1/core/definitions/Evaluable)

A variable is a symbolic representation of some quantity whose value we do not
know yet. Something whose value is not fixed and could take different values
depending upon the situation.
This interface must be implemented by all classes representing varying/unknown
values.

### Field Summary

Field | Type | Description
------|------|------
type | `string` | The value of this is fixed, `"variable"`.
name | `string` | The name of the variable.