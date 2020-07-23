multivariate_calculus
=====================
[![CircleCI](https://img.shields.io/circleci/build/gh/terrible-coder/multivariate_calculus/master?style=flat-square&logo=circleci)](https://www.circleci.com/gh/terrible-coder/multivariate_calculus)

[![npm](https://img.shields.io/npm/v/multivariate_calculus?style=flat-square&logo=npm)](https://npmjs.com/package/multivariate_calculus)
[![GitHub release (latest by date)](https://img.shields.io/github/v/release/terrible-coder/multivariate_calculus?style=flat-square&logo=github)](https://github.com/terrible-coder/multivariate_calculus/releases/latest)

[![Typescript](https://img.shields.io/badge/made_with-typescript-007ACC?style=flat-square&logo=typescript)](http://typescriptlang.org/)
[![License](https://img.shields.io/github/license/terrible-coder/multivariate_calculus?style=flat-square)](https://opensource.org/licenses/MIT)

A zero dependency library that handles calculus of several variables in
multidimensional space. It works with both TypeScript and JavaScript projects
seamlessly. This library is so designed that you can write your mathematics code
as you would do maths in pen and paper.

> From version 1.0.0, the library is based completely on [BigNum](https://terrible-coder.github.io/multivariate_calculus/classes/bignum.html) objects.

## Installation

#### Browser

If you wish to work with this library in the browser, you can download it from [here](https://github.com/terrible-coder/multivariate_calculus/releases).

Once you have downloaded the file in you project folder, open up your index.html
file and add the following line:
```html
<script src="mcalc.js"></script>
```

To create a new constant scalar object you can say
```javascript
const a = Scalar.constant(5);
print(a);
```
If you open up the developer console window in the browser you will be able to
see what the object `a` looks like.

-------------------

#### Node

**JavaScript**

For using this package in a nodejs environment, you first need to have [Nodejs](https://nodejs.org/en/download/)
installed on your computer.
Once that is done, open up your project directory and create an index.js file.
At the top of the file copy the following line:
```javascript
const mc = require("multivariate_calculus");
```

This will import all the modules, classes, functions and constants from the
package under the name `mc`. If we try to recreate the same example from above,
you would have to write
```javascript
const a = mc.Scalar.constant(5);
mc.print(a);
```

You may also avoid having to write `mc` over and over again by modifying the
import statement slightly
```javascript
const { Scalar } = require("multivariate_calculus");
```

This way you need not use the namespace object to access the modules, classes,
functions and constants. The code will look exactly like in the case of browser use.

**TypeScript**

Working in TypeScript is similar to working with plain JavaScript. However, before
you can start writing your code using TypeScript you need to first make sure
that it is installed. If you are unfamiliar with TypeScript check out their
[documentation here](http://www.typescriptlang.org/docs/home.html).

Once that is done you can now import stuff from this package by using just one
line at the top of your `.ts` file. To recreate the above example in TypeScript:
```typescript
import { Scalar, print } from "multivariate_calculus";

const a = Scalar.constant(5);
print(a);
```

The library now comes with cleaner global math functions which you can call with
any object. You can even perform trigonometry on `Scalar` objects by calling the global
functions

```typescript
const x = Scalar.variable("x");
const y = sin(x);
print(y.at(new Map([
	[x, pi]
])));
```

-------------------

Check out the [documentation](https://terrible-coder.github.io/multivariate_calculus) for further readings.
If there are any issues or some changes you would like to see, [file an issue](https://github.com/terrible-coder/multivariate_calculus/issues).
To check out the documentation of some previous version add the generic version
number after the URL:
https://terrible-coder.github.io/multivariate_calculus/0.2/.

You can now take a sneak peek into the upcoming features in the next release
and their documentation by going to https://terrible-coder.github.io/multivariate_calculus/next/.