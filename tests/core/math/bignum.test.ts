import { BigNum } from "../../../src/core/math/bignum";
import { Component } from "../../../src/core/math/component";

describe("Creates numbers", function() {
	it("from 1 real", function() {
		const a = new BigNum(Component.create("5"));
		expect(a.dim).toBe(1);
		expect(a.components.length).toBe(1);
		expect(a.components).toEqual([Component.create("5")]);
	});

	it("from 2 reals", function() {
		const comps = [Component.create("5"), Component.create("1")];
		const a = new BigNum(Component.create("5"), Component.create("1"));
		expect(a.dim).toBe(2);
		expect(a.components.length).toBe(2);
		expect(a.components).toEqual(comps);
	});

	it("from 3 reals", function() {
		const comps = [Component.create("5"), Component.create("4"), Component.create("1")];
		const a = new BigNum(comps);
		expect(a.dim).toBe(4);
		expect(a.components.length).toBe(4);
		expect(a.components).toEqual(comps.concat(Component.create("0")));
	});
});

describe("Adds", function() {
	it("for 1 real", function() {
		const a = new BigNum(Component.create("5"));
		const b = new BigNum(Component.create("2"));
		const sum = new BigNum(Component.create("7"));
		expect(sum).toEqual(a.add(b));
	});

	it("for 2 reals", function() {
		const a = new BigNum(Component.create("5"), Component.create("1"));
		const b = new BigNum(Component.create("2"), Component.create("3"));
		const sum = new BigNum(Component.create("7"), Component.create("4"));
		expect(sum).toEqual(a.add(b));
	});

	it("for 3 reals", function() {
		const a = new BigNum(Component.create("5"), Component.create("1"), Component.create("4"));
		const b = new BigNum(Component.create("2"), Component.create("3"), Component.create("1"));
		const sum = new BigNum(Component.create("7"), Component.create("4"), Component.create("5"));
		expect(sum).toEqual(a.add(b));
	});

	it("for mixed number of reals", function() {
		const a = new BigNum(Component.create("5"));
		const b = new BigNum(Component.create("2"), Component.create("4"));
		const sum = new BigNum(Component.create("7"), Component.create("4"));
		expect(() => a.add(b)).not.toThrow();
		expect(sum).toEqual(a.add(b));
	});
});

describe("Negates", function() {
	it("Creates additive inverse", function() {
		const a = new BigNum(Component.create("5"), Component.create("1"), Component.create("4"));
		expect(a.add(a.neg)).toEqual(new BigNum(Component.create("0")));
	});
});