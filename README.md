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

This is still a work in progress. The library might not be stable yet.
Work is being done on building the project to make it a useful tool for Physics and Mathematics.

**Features implemented:**
- [x] Scalar algebra
- [x] Matrix algebra
- [x] Vector algebra
- [ ] Tensor algebra
- [ ] Introduction of a system of variables and constants
- [ ] Perform algebra of variables
- [ ] Calculating limits of arbitrary expressions of multiple variables
- [ ] Evaluating partial derivatives
- [ ] Evaluating integral with respect to single variable
- [ ] Evaluating multiple integrals: line, surface, volume