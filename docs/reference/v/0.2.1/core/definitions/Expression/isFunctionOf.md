## Function isFunctionOf

isFunctionOf(v: [Variable](reference/v/0.2.1/core/definitions/Variable)): boolean;

Checks whether `this` expression object depends on the given [Variable](reference/v/0.2.1/core/definitions/Variable).
It just returns if the [arg_list](reference/v/0.2.1/core/definitions/Expression/arg_list) has
a copy of the given [Variable](reference/v/0.2.1/core/definitions/Variable) object.

### Parameters

* **v**: [Variable](reference/v/0.2.1/core/definitions/Variable)

 The [Variable](reference/v/0.2.1/core/definitions/Variable) to check against.