export class Welcome {
	/**
	 * Creates a new Welcome object.
	 * @param name Name of the person to welcome.
	 */
	constructor(public name:string) {
		console.log("Welcome to your initial setup.");
	}

	/**
	 * Says hello to the user who was to be welcomed.
	 */
	public sayHello() {
		console.log("Hello" + this.name);
	}
}