import { Numerical } from "./definitions";

export function setErrorPrototype(E: any, name: string) {
	E.prototype = Object.create(Error.prototype, {
		constructor: {
			value: Error,
			enumerable: false,
			writable: true,
			configurable: true
		}
	});
	Reflect.setPrototypeOf(E, Error);
	E.prototype.name = name;
}

export function getErrorObject(thisArg: any, ...args: any[]) {
	const instance = Reflect.construct(Error, args);
	Reflect.setPrototypeOf(instance, Reflect.getPrototypeOf(thisArg));
	return instance;
}

/**
 * The error thrown when attempt is made to divide by zero.
 */
export interface DivisionByZero {
	/**
	 * The error thrown when attempt is made to divide by zero.
	 * @param message The message to show.
	 */
	new (message: string): DivisionByZero;
}
export const DivisionByZero = <DivisionByZero><unknown> function(this: any, message: string) {
	return getErrorObject(this, message);
}
setErrorPrototype(DivisionByZero, "division by zero");

/**
 * The error thrown when some sort of [indeterminate form](https://en.wikipedia.org/wiki/Indeterminate_form) is produced during
 * calculations.
 */
export interface IndeterminateForm {
	/**
	 * The error thrown when some sort of [indeterminate form](https://en.wikipedia.org/wiki/Indeterminate_form) is produced during
	 * calculations.
	 * @param message The message to display.
	 */
	new (message: string): IndeterminateForm;
}
export const IndeterminateForm = <IndeterminateForm><unknown> function(this: any, message: string) {
	return getErrorObject(this, message);
}
setErrorPrototype(IndeterminateForm, "indeterminate form");

/**
 * The error thrown when some sort of illegal overwrite is attempted. It is
 * usually in the case of trying to define a constant with the same name
 * as another previously defined constant.
 */
export interface Overwrite {
	/**
	 * The error thrown when some sort of illegal overwrite is attempted. It is
	 * usually in the case of trying to define a constant with the same name
	 * as another previously defined constant.
	 * @param name The name of the constant which is being overwritten.
	 */
	new (name: string): Overwrite;
}
export const Overwrite = <Overwrite><unknown> function(this: any, name: string) {
	return getErrorObject(this, `A constant with name ${name} has already been declared.`);
}
setErrorPrototype(Overwrite, "overwrite");

/**
 * The error thrown when some invalid index of some quantity is being accessed.
 * An invalid index would be any index which does not exist on a particular quantity.
 */
export interface InvalidIndex {
	/**
	 * Creates an [[InvalidIndex]] error.
	 * @param passed The index value being accessed.
	 * @param start The value from which indexing starts.
	 */
	new (passed: number, start: number): InvalidIndex;
}
export const InvalidIndex = <InvalidIndex><unknown> function(this: any, passed: number, start: number) {
	return getErrorObject(this, `Index ${passed} does not exist. Indexing starts from ${start}.`);
}
setErrorPrototype(InvalidIndex, "invalid index");

/**
 * The error thrown when a value is passed to a function for which the function
 * value is undefined. This is a better way to handle undefined function values
 * than returning an `undefined`.
 */
export interface UndefinedValue {
	/**
	 * The error thrown when a value is passed to a function for which the function
	 * value is undefined. This is a better way to handle undefined function values
	 * than returning an `undefined`.
	 * @param fnName The name of the function called.
	 * @param value The value passed to the function.
	 * @param extra Any additional message to display.
	 */
	new (fnName: string, value: Numerical, extra?: string): UndefinedValue;
}
export const UndefinedValue = <UndefinedValue><unknown>function(this: any, fnName: string, value: Numerical, extra?: string) {
	const trail = extra === undefined? "": ` ${extra}`;
	return getErrorObject(this, `Function ${fnName} is undefined for input ${value}.${trail}`);
}
setErrorPrototype(UndefinedValue, "undefined value");

/**
 * The error thrown when the string form of a number fails to parse.
 */
export interface IllegalNumberFormat {
	/**
	 * The error thrown when the string form of a number fails to parse.
	 * @param passed The incorrect string form of number passed.
	 */
	new (passed: string): IllegalNumberFormat;
}
export const IllegalNumberFormat = <IllegalNumberFormat><unknown>function(this: any, passed: string) {
	return getErrorObject(this, `Number format failed to parse: ${passed}`);
}
setErrorPrototype(IllegalNumberFormat, "illegal number format");