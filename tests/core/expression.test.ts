const { Scalar } = require("../../build/scalar");
const { BinaryOperator } = require("../../build/core/operators/binary");
const { UnaryOperator } = require("../../build/core/operators/unary");
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

describe("Calls with rest parameters", function() {
	const x = Scalar.variable("x");
	const obj = {
		foo: "bar"
	}

	describe("Static methods", function() {
		const exp = new Scalar.Expression(UnaryOperator.ABS, x, obj);

		it("stores rest parameters", function() {
			expect(exp.rest).toEqual([obj]);
		});

		it("passes rest parameters", function() {
			Scalar.abs = jest.fn();
			try {
				exp.at(new Map([
					[x, Scalar.constant(2)]
				]));
			} catch {}
			expect(Scalar.abs.mock.calls[0].length).toEqual(2);
			expect(Scalar.abs.mock.calls[0][1]).toBe(obj);
		});
	});

	describe("Instance methods", function() {
		const exp = new Scalar.Expression(BinaryOperator.ADD, x, Scalar.constant(1), obj);

		it("stores rest parameters", function() {
			expect(exp.rest).toEqual([obj]);
		});

		it("passes rest parameters", function() {
			const atValue = Scalar.constant(2);
			atValue.add = jest.fn();
			try {
			exp.at(new Map([
					[x, atValue]
				]));
			} catch {}
			expect(atValue.add.mock.calls[0].length).toBe(2);
			expect(atValue.add.mock.calls[0][1]).toBe(obj);
		});
	});
});