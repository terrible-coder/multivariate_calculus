Interface Token
======
interface Token

A tagging interface which all classes representing some mathematical object
whose value can be evaluated, at run time or when user suppiles the value, must
implement.

### Field summary

Field | Type | Description
-------|-----|-----
type | `string` | The type of Token this represents.<br>Permitted values: `"operator"`, `"constant"`, `"variable"`, `"expression"`.