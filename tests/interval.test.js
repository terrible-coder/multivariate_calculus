const { Interval } = require("../build/core/interval");

describe("Checks intervals", function() {
	const a = 0, b = 1;
	
	it("Both ends closed", function() {
		const intvl = Interval.closed(a, b);
		expect(intvl.isClosed()).toBe(true);
		expect(intvl.contains((a + b)/2)).toBe(true);
		expect(intvl.contains(5)).toBe(false);
		expect(intvl.contains(a)).toBe(true);
		expect(intvl.contains(b)).toBe(true);
	});

	it("Both ends open", function() {
		const intvl = Interval.open(a, b);
		expect(intvl.isOpen()).toBe(true);
		expect(intvl.contains((a + b)/2)).toBe(true);
		expect(intvl.contains(5)).toBe(false);
		expect(intvl.contains(a)).toBe(false);
		expect(intvl.contains(b)).toBe(false);
	});

	it("Left-open right-closed", function() {
		const intvl = Interval.open_closed(a, b);
		expect(intvl.isClosed()).toBe(false);
		expect(intvl.isLeftOpen()).toBe(true);
		expect(intvl.contains((a + b)/2)).toBe(true);
		expect(intvl.contains(5)).toBe(false);
		expect(intvl.contains(a)).toBe(false);
		expect(intvl.contains(b)).toBe(true);
	});

	it("Left-closed right-open", function() {
		const intvl = Interval.closed_open(a, b);
		expect(intvl.isClosed()).toBe(false);
		expect(intvl.isRightOpen()).toBe(true);
		expect(intvl.contains((a + b)/2)).toBe(true);
		expect(intvl.contains(5)).toBe(false);
		expect(intvl.contains(a)).toBe(true);
		expect(intvl.contains(b)).toBe(false);
	});
});