const Field = require("../build/field").Field;

describe("test", function() {
	it("test", function() {
		expect(Field.Scalar).toBeDefined();
		expect(Field.Vector).toBeDefined();
	});
});