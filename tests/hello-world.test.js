const Welcome = require("../build/hello-world").Welcome;

describe("Hello world", function() {
	it("Greets properly", function() {
		const W = new Welcome("Ayan");
		expect(W.sayHello).toBeDefined();
	});
});