multivariate_calculus
=====================

Handles calculus of several variables in multidimensional space.
It works with both TypeScript and JavaScript projects seamlessly.

## Installation

To install globally on your computer:

	npm install multivariate_calculus --global

If you instead want to use this package to build something of your own:

	npm install multivariate_calculus --save

## Usage

Once installed properly, you can say
in TypeScript:
```typescript
import { Matrix } from "multivariate_calculus"
const A = new Matrix(2, 3);   // [[0, 0, 0], [0, 0, 0]]
```
or in JavaScript:
```javascript
const mcalc = require("multivariate_calculus");
const A = new mcalc.Matrix(2, 3);   // [[0, 0, 0], [0, 0, 0]]
```

This library allows you to work with variables too.
```typescript
import { Scalar } from "multivariate_calculus"
const x = new Scalar.Variable();
const two = new Scalar.Constant(2);
const three = new Scalar.Constant(3);
const expr = x.add(two);
const value = expr.at(new Map[
	[x, three]
]);
console.log(value);
```

Upon execution `value` should be a `Scalar.Constant` object with a constant value of `4`.
One may choose to work with more than one variable too. There is support for scalar algebra 
for any number of variables.

This is still a work in progress. A documentation page and a browser version of this library
is coming soon. Work is being done on building the project to make it a useful tool for
Physics and Mathematics.

**Features implemented:**
- [x] Scalar operations
- [x] Matrix operations
- [x] Vector operations
- [ ] Tensor operations
- [x] A system of variables and constants for Scalar
- [ ] A system of variables and constants for Matrix
- [ ] A system of variables and constants for Vector
- [ ] A system of variables and constants for Tensor
- [x] Algebra of Scalar variables
- [ ] Algebra of Matrix variables
- [ ] Algebra of Vector variables
- [ ] Algebra of Tensor variables
- [ ] Calculating limits of arbitrary expressions of multiple variables
- [ ] Evaluating partial derivatives
- [ ] Evaluating integral with respect to single variable
- [ ] Evaluating multiple integrals: line, surface, volume