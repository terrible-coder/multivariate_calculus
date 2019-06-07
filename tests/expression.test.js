const { Scalar } = require("../build/Scalar");

const x = Scalar.variable("x");
const y = Scalar.variable("y");
const two = Scalar.constant(2);
const expr1 = x.add(two);
const expr2 = x.add(y);

describe("Checks expression functionality", function() {
	test("Checks dependency", function() {
		expect(expr1).toBeInstanceOf(Scalar.Expression);
		expect(expr1.isFunctionOf(x)).toBe(true);
		expect(expr2.isFunctionOf(y)).toBe(true);
	});

	test("Check evaluation at a point", function() {
		expect(expr1.at(new Map([
			[x, two]
		]))).toEqual(two.add(two));
		expect(expr2.at(new Map([
			[x, two]
		]))).toEqual(two.add(y));
		expect(expr2.at(new Map([
			[x, two],
			[y, two]
		]))).toEqual(two.add(two));
	});
});