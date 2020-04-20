const { ExpressionBuilder } = require("../../build/core/expression");

const a = {
	name: "a",
	type: "variable"
}, b = {
	name: "b",
	type: "variable"
}, c = {
	name: "b",
	type: "variable"
};

const e1 = {
	type: "expression",
	quantity: "random",
	arg_list: new Set([a, b])
}, e2 = {
	type: "expression",
	quantity: "random",
	arg_list: new Set([c, b])
};

describe("Creates dependency list from", function() {
	it("Single variable", function() {
		const set = ExpressionBuilder.createArgList(a);
		expect(set.size).toBe(1);
		expect(set.has(a)).toBe(true);
	});

	it("Two variables", function() {
		const set = ExpressionBuilder.createArgList(a, b);
		expect(set.size).toBe(2);
		expect(set.has(a)).toBe(true);
		expect(set.has(b)).toBe(true);
	});

	it("Single expression", function() {
		const set1 = ExpressionBuilder.createArgList(e1);
		expect(set1.size).toBe(2);
		expect(set1.has(a)).toBe(true);
		expect(set1.has(b)).toBe(true);

		const set2 = ExpressionBuilder.createArgList(e2);
		expect(set2.size).toBe(2);
		expect(set2.has(b)).toBe(true);
		expect(set2.has(c)).toBe(true);
	});

	it("Two expressions", function() {
		const set = ExpressionBuilder.createArgList(e1, e2);
		expect(set.size).toBe(3);
		expect(set.has(a)).toBe(true);
		expect(set.has(b)).toBe(true);
		expect(set.has(c)).toBe(true);
	});

	it("(expression, variable) pair", function() {
		const set = ExpressionBuilder.createArgList(a, e2);
		expect(set.size).toBe(3);
		expect(set.has(a)).toBe(true);
		expect(set.has(b)).toBe(true);
		expect(set.has(c)).toBe(true);
	});

	it("(variable, expression) pair", function() {
		const set = ExpressionBuilder.createArgList(e1, b);
		expect(set.size).toBe(2);
		expect(set.has(a)).toBe(true);
		expect(set.has(b)).toBe(true);
		expect(set.has(c)).not.toBe(true);
	});
});