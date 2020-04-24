const func = require("../../../src/core/math/functions");
const { Component } = require("../../../build/core/math/component");

describe("Print", function() {
	console.log = jest.fn();
	it("Objects with toString", function() {
		const obj = Component.ONE;
		func.print(obj);
		expect(console.log.mock.calls[0][0]).toBe("1.0");
	});

	it("Objects without toString", function() {
		const obj = new (class {
			constructor() {}
		})();
		func.print(obj);
		expect(console.log.mock.calls[1][0]).toBe(obj);
	});
});