import { parseNum } from "../../../src/core/math/parsers";

describe("decimal notation", function() {
	describe("positive values", function() {
		test("exact values", function () {
			for(let i = 1; i <= 9; i++)
				expect(parseNum(`0.${i}`)).toEqual(["", `${i}`]);
		});
	
		test("with leading zeroes", function() {
			for(let i = 1; i <= 9; i++)
				expect(parseNum(`004.${i}`)).toEqual(["4", `${i}`]);
		});
	
		test("with trailing zeroes", function() {
			for(let i = 1; i <= 9; i++)
				expect(parseNum(`4.${i}000`)).toEqual(["4", `${i}`]);
		});
	});

	describe("negative values", function() {
		test("exact values", function () {
			for(let i = 1; i <= 9; i++)
				expect(parseNum(`-0.${i}`)).toEqual(["-", `${i}`]);
		});
	
		test("with leading zeroes", function() {
			for(let i = 1; i <= 9; i++)
				expect(parseNum(`-004.${i}`)).toEqual(["-4", `${i}`]);
		});
	
		test("with trailing zeroes", function() {
			for(let i = 1; i <= 9; i++)
				expect(parseNum(`-4.${i}000`)).toEqual(["-4", `${i}`]);
		});
	});
});

describe("Exponential notation", function() {
	describe("positive values", function() {
		describe("exact value of mantissa", function() {
			test("positive exponent", function() {
				for(let i = 1; i <= 9; i++) {
					expect(parseNum(`1.${i}e2`)).toEqual([`1${i}0`, ""]);
					expect(parseNum(`1.${i}e+2`)).toEqual([`1${i}0`, ""]);
				}
			});

			test("negative exponent", function() {
				for(let i = 1; i <= 9; i++)
					expect(parseNum(`1.${i}e-2`)).toEqual(["", `01${i}`]);
			});
		});
		
		describe("mantissa with trailing zeros", function() {
			test("positive exponent", function() {
				for(let i = 1; i <= 9; i++) {
					expect(parseNum(`1.${i}00e2`)).toEqual([`1${i}0`, ""]);
					expect(parseNum(`1.${i}00e+2`)).toEqual([`1${i}0`, ""]);
				}
			});

			test("negative exponent", function() {
				for(let i = 1; i <= 9; i++)
					expect(parseNum(`1.${i}00e-2`)).toEqual(["", `01${i}`]);
			});
		});
	});
});