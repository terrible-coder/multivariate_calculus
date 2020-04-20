const func = require("../../../src/core/math/functions");
const { math } = require("../../../src/core/math/math");
const { Component } = require("../../../build/core/math/component");

describe("Functions", function() {
	it("Compare with math", function() {
		let props = Object.getOwnPropertyNames(func);
		props = props.slice(1, props.length - 1);
		props.forEach(fn => {
			expect(func[fn]).toBe(math[fn]);
		});
	});
});

describe("Print", function() {
	console.log = jest.fn();
	it("Objects with toString", function() {
		const obj = Component.ONE;
		func.print(obj);
		expect(console.log.mock.calls[0][0]).toBe("1.0");
	});

	it("Objects without toString", function() {
		const obj = {
			name: "Steve",
			place: "California",
			animal: "Leopard",
			thing: "Bottle"
		};
		func.print(obj);
		expect(console.log.mock.calls[1][0]).toBe(obj);
	});
});