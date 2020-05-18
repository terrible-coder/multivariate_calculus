import { Numerical } from "../definitions";

/**
 * The negative value of its argument.
 * @param x A number.
 */
export function neg(x: number): number;
/**
 * The negative value of its argument. This function looks for the definition of
 * the negation function in the [[Numerical]] object.
 * @template T Asserts object passed to be [[Numerical]].
 * @param x A [[Numerical]].
 * @param args Any additional parameters required by the object's negation function.
 * @throws If negation is not defined for the argument object type.
 */
export function neg<T extends Numerical>(x: T, ...args: any[]): T;
export function neg<T extends Numerical>(x: number | T, ...args: any[]) {
	if(typeof x === "number")
		return -<number>x;
	if(!(x instanceof Numerical))
		throw TypeError("Numerical operations not defined on object.");
	const def = x.getDefinition("neg");
	if(def === "undefined")
		throw new TypeError("Operation neg not defined for object of type " + x.classRef.name);
	if(def === "instance")
		return (<any>x).neg;
	return x.classRef.neg(x, ...args);
}

/**
 * The trigonometric sine function.
 * @param x A number.
 */
export function sin(x: number): number;
/**
 * The trigonometric sine function. This function looks for the definition of
 * the sine function in the [[Numerical]] object.
 * @template T Asserts object passed to be [[Numerical]].
 * @param x A [[Numerical]].
 * @param args Any additional parameters required by the object's sine function.
 * @throws If the sine function is not defined for the argument object type.
 */
export function sin<T extends Numerical>(x: T, ...args: any[]): T;
export function sin<T extends Numerical>(x: number | T, ...args: any[]) {
	if(typeof x === "number")
		return Math.sin(<number>x);
	if(!(x instanceof Numerical))
		throw TypeError("Numerical operations not defined on object.");
	const def = x.getDefinition("sin");
	if(def === "undefined")
		throw new TypeError("Operation sin not defined for object of type " + x.classRef.name);
	if(def === "instance")
		return (<any>x).sin(...args);
	return x.classRef.sin(x, ...args);
}

/**
 * The trigonometric cosine function.
 * @param x A number.
 */
export function cos(x: number): number;
/**
 * The trigonometric cosine function. This function looks for the definition of
 * the cosine function in the [[Numerical]] object.
 * @template T Asserts object passed to be [[Numerical]].
 * @param x A [[Numerical]].
 * @param args Any additional parameters required by the object's cosine function.
 * @throws If the cosine function is not defined for the argument object type.
 */
export function cos<T extends Numerical>(x: T, ...args: any[]): T;
export function cos<T extends Numerical>(x: number | T, ...args: any[]) {
	if(typeof x === "number")
		return Math.cos(<number>x);
	if(!(x instanceof Numerical))
		throw TypeError("Numerical operations not defined on object.");
	const def = x.getDefinition("cos");
	if(def === "undefined")
		throw new TypeError("Operation cos not defined for object of type " + x.classRef.name);
	if(def === "instance")
		return (<any>x).cos(...args);
	return x.classRef.cos(x, ...args);
}

/**
 * The trigonometric tangent function.
 * @param x A number.
 */
export function tan(x: number): number;
/**
 * The trigonometric tangent function. This function looks for the definition of
 * the tangent function in the [[Numerical]] object.
 * @template T Asserts object passed to be [[Numerical]].
 * @param x A [[Numerical]].
 * @param args Any additional parameters required by the object's tangent function.
 * @throws If the tangent function is not defined for the argument object type.
 */
export function tan<T extends Numerical>(x: T, ...args: any[]): T;
export function tan<T extends Numerical>(x: number | T, ...args: any[]) {
	if(typeof x === "number")
		return Math.tan(<number>x);
	if(!(x instanceof Numerical))
		throw TypeError("Numerical operations not defined on object.");
	const def = x.getDefinition("tan");
	if(def === "undefined")
		throw new TypeError("Operation tan not defined for object of type " + x.classRef.name);
	if(def === "instance")
		return (<any>x).tan(...args);
	return x.classRef.tan(x, ...args);
}

/**
 * The inverse trigonometric sine function.
 * @param x A number.
 */
export function asin(x: number): number;
/**
 * The inverse trigonometric sine function. This function looks for the definition of
 * the inverse sine function in the [[Numerical]] object.
 * @template T Asserts object passed to be [[Numerical]].
 * @param x A [[Numerical]].
 * @param args Any additional parameters required by the object's inverse sine function.
 * @throws If the inverse sine function is not defined for the argument object type.
 */
export function asin<T extends Numerical>(x: T, ...args: any[]): T;
export function asin<T extends Numerical>(x: number | T, ...args: any[]) {
	if(typeof x === "number")
		return Math.asin(<number>x);
	if(!(x instanceof Numerical))
		throw TypeError("Numerical operations not defined on object.");
	const def = x.getDefinition("asin");
	if(def === "undefined")
		throw new TypeError("Operation asin not defined for object of type " + x.classRef.name);
	if(def === "instance")
		return (<any>x).asin(...args);
	return x.classRef.asin(x, ...args);
}

/**
 * The inverse trigonometric cosine function.
 * @param x A number.
 */
export function acos(x: number): number;
/**
 * The inverse trigonometric cosine function. This function looks for the definition of
 * the inverse cosine function in the [[Numerical]] object.
 * @template T Asserts object passed to be [[Numerical]].
 * @param x A [[Numerical]].
 * @param args Any additional parameters required by the object's inverse cosine function.
 * @throws If the inverse cosine function is not defined for the argument object type.
 */
export function acos<T extends Numerical>(x: T, ...args: any[]): T;
export function acos<T extends Numerical>(x: number | T, ...args: any[]) {
	if(typeof x === "number")
		return Math.acos(<number>x);
	if(!(x instanceof Numerical))
		throw TypeError("Numerical operations not defined on object.");
	const def = x.getDefinition("acos");
	if(def === "undefined")
		throw new TypeError("Operation acos not defined for object of type " + x.classRef.name);
	if(def === "instance")
		return (<any>x).acos(...args);
	return x.classRef.acos(x, ...args);
}

/**
 * The inverse trigonometric tangent function.
 * @param x A number.
 */
export function atan(x: number): number;
/**
 * The inverse trigonometric tangent function. This function looks for the definition of
 * the inverse tangent function in the [[Numerical]] object.
 * @template T Asserts object passed to be [[Numerical]].
 * @param x A [[Numerical]].
 * @param args Any additional parameters required by the object's inverse tangent function.
 * @throws If the inverse tangent function is not defined for the argument object type.
 */
export function atan<T extends Numerical>(x: T, ...args: any[]): T;
export function atan<T extends Numerical>(x: number | T, ...args: any[]) {
	if(typeof x === "number")
		return Math.atan(<number>x);
	if(!(x instanceof Numerical))
		throw TypeError("Numerical operations not defined on object.");
	const def = x.getDefinition("atan");
	if(def === "undefined")
		throw new TypeError("Operation atan not defined for object of type " + x.classRef.name);
	if(def === "instance")
		return (<any>x).atan(...args);
	return x.classRef.atan(x, ...args);
}

/**
 * The hyperbolic sine function.
 * @param x A number.
 */
export function sinh(x: number): number;
/**
 * The hyperbolic sine function. This function looks for the definition of
 * the sinh function in the [[Numerical]] object.
 * @template T Asserts object passed to be [[Numerical]].
 * @param x A [[Numerical]].
 * @param args Any additional parameters required by the object's hyperbolic sine function.
 * @throws If the hyperbolic sine function is not defined for the argument object type.
 */
export function sinh<T extends Numerical>(x: T, ...args: any[]): T;
export function sinh<T extends Numerical>(x: number | T, ...args: any[]) {
	if(typeof x === "number")
		return Math.sinh(<number>x);
	if(!(x instanceof Numerical))
		throw TypeError("Numerical operations not defined on object.");
	const def = x.getDefinition("sinh");
	if(def === "undefined")
		throw new TypeError("Operation sinh not defined for object of type " + x.classRef.name);
	if(def === "instance")
		return (<any>x).sinh(...args);
	return x.classRef.sinh(x, ...args);
}

/**
 * The hyperbolic cosine function.
 * @param x A number.
 */
export function cosh(x: number): number;
/**
 * The hyperbolic cosine function. This function looks for the definition of
 * the cosh function in the [[Numerical]] object.
 * @template T Asserts object passed to be [[Numerical]].
 * @param x A [[Numerical]].
 * @param args Any additional parameters required by the object's hyperbolic cosine function.
 * @throws If the hyperbolic cosine function is not defined for the argument object type.
 */
export function cosh<T extends Numerical>(x: T, ...args: any[]): T;
export function cosh<T extends Numerical>(x: number | T, ...args: any[]) {
	if(typeof x === "number")
		return Math.cosh(<number>x);
	if(!(x instanceof Numerical))
		throw TypeError("Numerical operations not defined on object.");
	const def = x.getDefinition("cosh");
	if(def === "undefined")
		throw new TypeError("Operation cosh not defined for object of type " + x.classRef.name);
	if(def === "instance")
		return (<any>x).cosh(...args);
	return x.classRef.cosh(x, ...args);
}

/**
 * The hyperbolic tangent function.
 * @param x A number.
 */
export function tanh(x: number): number;
/**
 * The hyperbolic tangent function. This function looks for the definition of
 * the tanh function in the [[Numerical]] object.
 * @template T Asserts object passed to be [[Numerical]].
 * @param x A [[Numerical]].
 * @param args Any additional parameters required by the object's hyperbolic tangent function.
 * @throws If the hyperbolic tangent function is not defined for the argument object type.
 */
export function tanh<T extends Numerical>(x: T, ...args: any[]): T;
export function tanh<T extends Numerical>(x: number | T, ...args: any[]) {
	if(typeof x === "number")
		return Math.tanh(<number>x);
	if(!(x instanceof Numerical))
		throw TypeError("Numerical operations not defined on object.");
	const def = x.getDefinition("tanh");
	if(def === "undefined")
		throw new TypeError("Operation tanh not defined for object of type " + x.classRef.name);
	if(def === "instance")
		return (<any>x).tanh(...args);
	return x.classRef.tanh(x, ...args);
}

/**
 * The inverse hyperbolic sine function.
 * @param x A number.
 */
export function asinh(x: number): number;
/**
 * The inverse hyperbolic sine function. This function looks for the definition of
 * the inverse sinh function in the [[Numerical]] object.
 * @template T Asserts object passed to be [[Numerical]].
 * @param x A [[Numerical]].
 * @param args Any additional parameters required by the object's inverse hyperbolic sine function.
 * @throws If the inverse hyperbolic sine function is not defined for the argument object type.
 */
export function asinh<T extends Numerical>(x: T, ...args: any[]): T;
export function asinh<T extends Numerical>(x: number | T, ...args: any[]) {
	if(typeof x === "number")
		return Math.asinh(<number>x);
	if(!(x instanceof Numerical))
		throw TypeError("Numerical operations not defined on object.");
	const def = x.getDefinition("asinh");
	if(def === "undefined")
		throw new TypeError("Operation asinh not defined for object of type " + x.classRef.name);
	if(def === "instance")
		return (<any>x).asinh(...args);
	return x.classRef.asinh(x, ...args);
}

/**
 * The inverse hyperbolic cosine function.
 * @param x A number.
 */
export function acosh(x: number): number;
/**
 * The inverse hyperbolic cosine function. This function looks for the definition of
 * the inverse cosh function in the [[Numerical]] object.
 * @template T Asserts object passed to be [[Numerical]].
 * @param x A [[Numerical]].
 * @param args Any additional parameters required by the object's inverse hyperbolic cosine function.
 * @throws If the inverse hyperbolic cosine function is not defined for the argument object type.
 */
export function acosh<T extends Numerical>(x: T, ...args: any[]): T;
export function acosh<T extends Numerical>(x: number | T, ...args: any[]) {
	if(typeof x === "number")
		return Math.acosh(<number>x);
	if(!(x instanceof Numerical))
		throw TypeError("Numerical operations not defined on object.");
	const def = x.getDefinition("acosh");
	if(def === "undefined")
		throw new TypeError("Operation acosh not defined for object of type " + x.classRef.name);
	if(def === "instance")
		return (<any>x).acosh(...args);
	return x.classRef.acosh(x, ...args);
}

/**
 * The inverse hyperbolic tangent function.
 * @param x A number.
 */
export function atanh(x: number): number;
/**
 * The inverse hyperbolic tangent function. This function looks for the definition of
 * the inverse tanh function in the [[Numerical]] object.
 * @template T Asserts object passed to be [[Numerical]].
 * @param x A [[Numerical]].
 * @param args Any additional parameters required by the object's inverse hyperbolic tangent function.
 * @throws If the inverse hyperbolic tangent function is not defined for the argument object type.
 */
export function atanh<T extends Numerical>(x: T, ...args: any[]): T;
export function atanh<T extends Numerical>(x: number | T, ...args: any[]) {
	if(typeof x === "number")
		return Math.atanh(<number>x);
	if(!(x instanceof Numerical))
		throw TypeError("Numerical operations not defined on object.");
	const def = x.getDefinition("atanh");
	if(def === "undefined")
		throw new TypeError("Operation atanh not defined for object of type " + x.classRef.name);
	if(def === "instance")
		return (<any>x).atanh(...args);
	return x.classRef.atanh(x, ...args);
}

/**
 * The common logarithm function (to the base \\( 10 \\)).
 * @param x A number.
 */
export function log(x: number): number;
/**
 * The common logarithm function (to the base \\( 10 \\)). This function looks for the definition of
 * the log function in the [[Numerical]] object.
 * @template T Asserts object passed to be [[Numerical]].
 * @param x A [[Numerical]].
 * @param args Any additional parameters required by the object's common log function.
 * @throws If the common log function is not defined for the argument object type.
 */
export function log<T extends Numerical>(x: T, ...args: any[]): T;
export function log<T extends Numerical>(x: number | T, ...args: any[]) {
	if(typeof x === "number")
		return Math.log10(<number>x);
	if(!(x instanceof Numerical))
		throw TypeError("Numerical operations not defined on object.");
	const def = x.getDefinition("log");
	if(def === "undefined")
		throw new TypeError("Operation log not defined for object of type " + x.classRef.name);
	if(def === "instance")
		return (<any>x).log(...args);
	return x.classRef.log(x, ...args);
}

/**
 * The natural logarithm function (to the base \\( e \\)).
 * @param x A number.
 */
export function ln(x: number): number;
/**
 * The natural logarithm function (to the base \\( e \\)). This function looks for the definition of
 * the ln function in the [[Numerical]] object.
 * @template T Asserts object passed to be [[Numerical]].
 * @param x A [[Numerical]].
 * @param args Any additional parameters required by the object's log function.
 * @throws If the log function is not defined for the argument object type.
 */
export function ln<T extends Numerical>(x: T, ...args: any[]): T;
export function ln<T extends Numerical>(x: number | T, ...args: any[]) {
	if(typeof x === "number")
		return Math.log(<number>x);
	if(!(x instanceof Numerical))
		throw TypeError("Numerical operations not defined on object.");
	const def = x.getDefinition("ln");
	if(def === "undefined")
		throw new TypeError("Operation ln not defined for object of type " + x.classRef.name);
	if(def === "instance")
		return (<any>x).ln(...args);
	return x.classRef.ln(x, ...args);
}

/**
 * The exponential function.
 * @param x A number.
 */
export function exp(x: number): number;
/**
 * The exponential function. This function looks for the definition of
 * the exp function in the [[Numerical]] object.
 * @template T Asserts object passed to be [[Numerical]].
 * @param x A [[Numerical]].
 * @param args Any additional parameters required by the object's exponential function.
 * @throws If the exponential function is not defined for the argument object type.
 */
export function exp<T extends Numerical>(x: T, ...args: any[]): T;
export function exp<T extends Numerical>(x: number | T, ...args: any[]) {
	if(typeof x === "number")
		return Math.exp(<number>x);
	if(!(x instanceof Numerical))
		throw TypeError("Numerical operations not defined on object.");
	const def = x.getDefinition("exp");
	if(def === "undefined")
		throw new TypeError("Operation exp not defined for object of type " + x.classRef.name);
	if(def === "instance")
		return (<any>x).exp(...args);
	return x.classRef.exp(x, ...args);
}

/**
 * The absolute value function.
 * @param x A number.
 */
export function abs(x: number): number;
/**
 * The absolute value function. This function looks for the definition of
 * the absolute value function in the [[Numerical]] object.
 * @template T Asserts object passed to be [[Numerical]].
 * @param x A [[Numerical]].
 * @param args Any additional parameters required by the object's sine function.
 * @throws If the sine function is not defined for the argument object type.
 */
export function abs<T extends Numerical>(x: T, ...args: any[]): T;
export function abs<T extends Numerical>(x: number | T, ...args: any[]) {
	if(typeof x === "number")
		return Math.abs(<number>x);
	if(!(x instanceof Numerical))
		throw TypeError("Numerical operations not defined on object.");
	const def = x.getDefinition("abs");
	if(def === "undefined")
		throw new TypeError("Operation abs not defined for object of type " + x.classRef.name);
	if(def === "instance")
		return (<any>x).abs(...args);
	return x.classRef.abs(x, ...args);
}

/**
 * The greatest integer function.
 * @param x A number.
 */
export function floor(x: number): number;
/**
 * The greatest integer function. This function looks for the definition of
 * the floor function in the [[Numerical]] object.
 * @template T Asserts object passed to be [[Numerical]].
 * @param x A [[Numerical]].
 * @param args Any additional parameters required by the object's floor function.
 * @throws If the floor function is not defined for the argument object type.
 */
export function floor<T extends Numerical>(x: T, ...args: any[]): T;
export function floor<T extends Numerical>(x: number | T, ...args: any[]) {
	if(typeof x === "number")
		return Math.floor(<number>x);
	if(!(x instanceof Numerical))
		throw TypeError("Numerical operations not defined on object.");
	const def = x.getDefinition("floor");
	if(def === "undefined")
		throw new TypeError("Operation floor not defined for object of type " + x.classRef.name);
	if(def === "instance")
		return (<any>x).floor(...args);
	return x.classRef.floor(x, ...args);
}

/**
 * The smallest integer function.
 * @param x A number.
 */
export function ceil(x: number): number;
/**
 * The smallest integer function. This function looks for the definition of
 * the ceil function in the [[Numerical]] object.
 * @template T Asserts object passed to be [[Numerical]].
 * @param x A [[Numerical]].
 * @param args Any additional parameters required by the object's ceil function.
 * @throws If the ceil function is not defined for the argument object type.
 */
export function ceil<T extends Numerical>(x: T, ...args: any[]): T;
export function ceil<T extends Numerical>(x: number | T, ...args: any[]) {
	if(typeof x === "number")
		return Math.ceil(<number>x);
	if(!(x instanceof Numerical))
		throw TypeError("Numerical operations not defined on object.");
	const def = x.getDefinition("ceil");
	if(def === "undefined")
		throw new TypeError("Operation ceil not defined for object of type " + x.classRef.name + ".");
	if(def === "instance")
		return (<any>x).ceil(...args);
	return x.classRef.ceil(x, ...args);
}

/**
 * Prints the string representation of an object to the default console.
 * @param obj Object to print.
 */
export function print(...obj: any[]) {
	const prototypes = obj.map(x => Object.getPrototypeOf(x));
	const properties = prototypes.map(proto => Object.getOwnPropertyNames(proto));
	const toPrint = properties.map((x, index) => x.indexOf("toString") !== -1? obj[index].toString(): obj[index])
	console.log(...toPrint);
}