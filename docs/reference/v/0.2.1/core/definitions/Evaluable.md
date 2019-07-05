Interface Evaluable
======

interface Evaluable<br>
extends [Token](reference/v/0.2.1/core/definitions/Token)

A tagging interface which all classes representing some mathematical object must
implement.

### Field summary

Field | Type | Description
-------|-----|-----
type | `string` | The type of Token represented by implementing class.<br>Permitted values: `"constant"`, `"variable"`, `"expression"`.
quantity | `string` | The kind of physical quantity represented by the implementing class.