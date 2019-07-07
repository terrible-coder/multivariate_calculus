## Function constant

export function constant(value: number): [Scalar.Constant](reference/v/0.2.1/quantities/Scalar.Constant);

Creates a new `Scalar.Constant` object if it has not been created before.
Otherwise just returns the previously created object.

### Parameters
* **value**: `number`<br>
 The constant numerical value `this` stores.

### Returns
 [Scalar.Constant](reference/v/0.2.1/quantities/Scalar.Constant): The `Scalar.Constant` object corresponding to `value`.

--------------

export function constant(value: number, name: string): [Scalar.Constant](reference/v/0.2.1/quantities/Scalar.Constant);

Defines a named `Scalar.Constant` object if it has not been created before.
Otherwise just returns the previously created object.

### Parameters
* **value**: `number`<br>
 The constant numerical value `this` stores.
* **name**: `string`<br>
 The name given to this constant value representing symbol.

### Returns
 [Scalar.Constant](reference/v/0.2.1/quantities/Scalar.Constant): The `Scalar.Constant` object corresponding to `value` identified with `name`.

### Throws
 If a [Scalar.Constant](reference/v/0.2.1/quantities/Scalar.Constant) with the same `name`
 but a different `value` has been defined earlier.

--------------

export function constant(name: string): [Scalar.Constant](reference/v/0.2.1/quantities/Scalar.Constant);

Returns a previously declared named `Scalar.Constant` object.


### Parameter
* **name**: `string`<br>
 The name of the desired [Scalar.Constant](reference/v/0.2.1/quantities/Scalar.Constant) object.

### Returns
 [Scalar.Constant](reference/v/0.2.1/quantities/Scalar.Constant): The object which has been declared
 with the given `name` before.

### Throws
 If no object with the given `name` has been declared previously.