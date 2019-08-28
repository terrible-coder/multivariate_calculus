multivariate_calculus
=====================

A zero dependency libray that handles calculus of several variables in
multidimensional space. It works with both TypeScript and JavaScript projects
seamlessly. This library is so designed that you can write your mathematics code
as you would do maths in pen and paper.

## Installation

#### Browser

If you wish to work with this library in the browser, you can download it from [here](https://github.com/terrible-coder/multivariate_calculus/releases).

Once you have downloaded the file in you project folder, open up your index.html
file and add the following line:
```html
<script src="mcalc.js"></script>
```

This will tell the HTML that an external script is being referenced.
Now if you wish to, say, create a new constant scalar object, you can say
```javascript
const a = Scalar.constant(5);
console.log(a);
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
console.log(a);
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
import { Scalar } from "multivariate_calculus";

const a = Scalar.constant(5);
console.log(a);
```

-------------------

Check out the [documentation](https://terrible-coder.github.io/multivariate_calculus) for further readings.
If there are any issues or some changes you would like to see, [file an issue](https://github.com/terrible-coder/multivariate_calculus/issues).
To check out the documentation of some previous version add the generic version
number after the URL:
https://terrible-coder.github.io/multivariate_calculus/0.2/