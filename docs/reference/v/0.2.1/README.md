multivariate_calculus
=====================

Handles calculus of several variables in multidimensional space.
It works with both TypeScript and JavaScript projects seamlessly.

<!-- tabs:start -->
## **Node**

To install this version of the library navigate to your project directory from
the default terminal app and execute the following:

	npm install multivariate_calculus --save

If you prefer to work with TypeScript then in your new file add the classes you
want to consume at the top as
```typescript
import { Scalar } from "multivariate_calculus"
```

If, however, you want to work in JavaScript then import the library as
```javascript
const mcalc = require('multivariate_calculus');
```

Now all the classes defined in the library will be available under the variable
`mcalc`. If you are a lazy programmer then you may do the following to import the
classes in JavaScript:
```javascript
const { Scalar } = require('multivariate_calculus');
```


## **Browser**

The browser compatible form of this version of the library can be downloaded from [here](https://github.com/terrible-coder/multivariate_calculus/releases/download/v0.2.1/mcalc.js).
All the classes and functions defined in the library will now be available to you
in the global scope.

<!-- tabs:end -->

---------------------
Created using [docsify](https://docsify.js.org/#).