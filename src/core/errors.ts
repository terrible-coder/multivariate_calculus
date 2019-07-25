export class DivisionByZero extends Error {
	constructor(message: string) {
		super(message);
		this.name = "Division by zero";
	}
}

export class IndeterminateForm extends Error {
	constructor(message: string) {
		super(message);
		this.name = "Indeterminate form";
	}
}

export class Overwrite extends Error {
	constructor(name: string) {
		super("A constant with name " + name + " has already been declared.");
		this.name = "Overwrite";
	}
}

export class InvalidIndex extends Error {
	constructor(passed: number, start: number) {
		super("Index " + passed + " does not exist. Indexing starts from " + start + ".");
		this.name = "Invalid index";
	}
}