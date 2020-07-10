export function setErrorPrototype(E: any) {
	E.prototype = Object.create(Error.prototype, {
		constructor: {
			value: Error,
			enumerable: false,
			writable: true,
			configurable: true
		}
	});
	Reflect.setPrototypeOf(E, Error);
}

export function getErrorObject(thisArg: any, name: string, message: string, ...args: any[]): Error {
	const instance = Reflect.construct(Error, args);
	instance.message = message;
	instance.name = name;
	Reflect.setPrototypeOf(instance, Reflect.getPrototypeOf(thisArg));
	return instance;
}

/**
 * The error thrown when attempt is made to divide by zero.
 */
export class DivisionByZero extends Error {
	/**
	 * Creates a [[DivisionByZero]] error.
	 * @param message The message to display.
	 */
	constructor(message: string) {
		super(message);
		this.name = "Division by zero";
	}
}

/**
 * The error thrown when some sort of [indeterminate form](https://en.wikipedia.org/wiki/Indeterminate_form) is produced during
 * calculations.
 */
export class IndeterminateForm extends Error {
	/**
	 * Creates an [[IndeterminateForm]] error.
	 * @param message The message to display.
	 */
	constructor(message: string) {
		super(message);
		this.name = "Indeterminate form";
	}
}

/**
 * The error thrown when some sort of illegal overwrite is attempted. It is
 * usually in the case of trying to define a constant with the same name
 * as another previously defined constant.
 */
export class Overwrite extends Error {
	/**
	 * Creates a [[Overwrite]] error.
	 * @param name The name of the constant which is being overwritten.
	 */
	constructor(name: string) {
		super("A constant with name " + name + " has already been declared.");
		this.name = "Overwrite";
	}
}

/**
 * The error thrown when some invalid index of some quantity is being accessed.
 * An invalid index would be any index which does not exist on a particular quantity.
 */
export class InvalidIndex extends Error {
	/**
	 * Creates an [[InvalidIndex]] error.
	 * @param passed The index value being accessed.
	 * @param start The value from which indexing starts.
	 */
	constructor(passed: number, start: number) {
		super("Index " + passed + " does not exist. Indexing starts from " + start + ".");
		this.name = "Invalid index";
	}
}