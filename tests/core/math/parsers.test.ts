import { align, decimate, parseNum } from "../../../src/core/math/parsers";

describe("decimating", function() {
	test("with negative index", function() {
		expect(() => decimate("random", -1)).toThrow();
		expect(() => decimate("random", -10)).toThrow();
	});

	describe("with positive index", function() {
		test("for index larger than length of string", function() {
			expect(() => decimate("abc", 5)).not.toThrow();
			expect(decimate("abc", 5)).toBe("0.00abc");
		});

		test("with positive numbers", function() {
			expect(decimate("1234", 2)).toBe("12.34");
			expect(decimate("1234", 5)).toBe("0.01234");
		});

		test("with negative numbers", function() {
			expect(decimate("-1234", 2)).toBe("-12.34");
			expect(decimate("-1234", 5)).toBe("-0.01234");
		});
	});
});

describe("aligning", function() {
	describe("for strings", function() {
		test("same length +ve diff", function() {
			expect(align("123", "444", "a", 3)).toEqual(["123", "444aaa"]);
		});

		test("same length -ve diff", function() {
			expect(align("123", "444", "a", -4)).toEqual(["123aaaa", "444"]);
		});

		test("different length +ve diff", function() {
			expect(align("1234", "LLL", "o", 3)).toEqual(["1234", "LLLooo"]);
		});

		test("different length -ve length", function() {
			expect(align("1234", "LLL", "o", -4)).toEqual(["1234oooo", "LLL"]);
		});
	});

	describe("for objects", function() {
		const random = () => {
			return {
				foo: (Math.random() * 10) | 0,
				bar: ((Math.random() * 10) | 0).toString()
			}
		}
		const elt = {
			foo: 4,
			bar: "filler"
		};

		test("same length +ve diff", function() {
			const a = new Array(3).fill(0).map(() => random());
			const b = new Array(3).fill(0).map(() => random());
			const end = b.concat(new Array(3).fill(elt));
			expect(align(a, b, elt, 3)).toEqual([a, end]);
		});

		test("same length -ve diff", function() {
			const a = new Array(3).fill(0).map(() => random());
			const b = new Array(3).fill(0).map(() => random());
			const end = a.concat(new Array(4).fill(elt));
			expect(align(a, b, elt, -4)).toEqual([end, b]);
		});

		test("different length +ve diff", function() {
			const a = new Array(4).fill(0).map(() => random());
			const b = new Array(3).fill(0).map(() => random());
			const end = b.concat(new Array(3).fill(elt));
			expect(align(a, b, elt, 3)).toEqual([a, end]);
		});

		test("different length -ve diff", function() {
			const a = new Array(4).fill(0).map(() => random());
			const b = new Array(3).fill(0).map(() => random());
			const end = a.concat(new Array(4).fill(elt));
			expect(align(a, b, elt, -4)).toEqual([end, b]);
		});
	});
});

describe("decimal notation", function() {
	describe("positive values", function() {
		test("exact values", function () {
			for(let i = 1; i <= 9; i++) {
				expect(parseNum(`0.${i}`)).toEqual(["", `${i}`]);
				expect(parseNum(`+0.${i}`)).toEqual(["", `${i}`]);
			}
		});
	
		test("with leading zeroes", function() {
			for(let i = 1; i <= 9; i++) {
				expect(parseNum(`004.${i}`)).toEqual(["4", `${i}`]);
				expect(parseNum(`+004.${i}`)).toEqual(["4", `${i}`]);
			}
		});
	
		test("with trailing zeroes", function() {
			for(let i = 1; i <= 9; i++) {
				expect(parseNum(`4.${i}000`)).toEqual(["4", `${i}`]);
				expect(parseNum(`+4.${i}000`)).toEqual(["4", `${i}`]);
			}
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
					expect(parseNum(`+1.${i}e2`)).toEqual([`1${i}0`, ""]);
					expect(parseNum(`+1.${i}e+2`)).toEqual([`1${i}0`, ""]);
				}
			});

			test("negative exponent", function() {
				for(let i = 1; i <= 9; i++) {
					expect(parseNum(`1.${i}e-2`)).toEqual(["", `01${i}`]);
					
					expect(parseNum(`+1.${i}e-2`)).toEqual(["", `01${i}`]);
				}
			});
		});
		
		describe("mantissa with trailing zeros", function() {
			test("positive exponent", function() {
				for(let i = 1; i <= 9; i++) {
					expect(parseNum(`1.${i}00e2`)).toEqual([`1${i}0`, ""]);
					expect(parseNum(`1.${i}00e+2`)).toEqual([`1${i}0`, ""]);
					expect(parseNum(`+1.${i}00e2`)).toEqual([`1${i}0`, ""]);
					expect(parseNum(`+1.${i}00e+2`)).toEqual([`1${i}0`, ""]);
				}
			});

			test("negative exponent", function() {
				for(let i = 1; i <= 9; i++) {
					expect(parseNum(`1.${i}00e-2`)).toEqual(["", `01${i}`]);
					expect(parseNum(`+1.${i}00e-2`)).toEqual(["", `01${i}`]);
				}
			});
		});
		
		describe("mantissa with leading zeros", function() {
			test("positive exponent", function() {
				for(let i = 1; i <= 9; i++) {
					expect(parseNum(`001.${i}e2`)).toEqual([`1${i}0`, ""]);
					expect(parseNum(`001.${i}e+2`)).toEqual([`1${i}0`, ""]);
					expect(parseNum(`+001.${i}e2`)).toEqual([`1${i}0`, ""]);
					expect(parseNum(`+001.${i}e+2`)).toEqual([`1${i}0`, ""]);
				}
			});

			test("negative exponent", function() {
				for(let i = 1; i <= 9; i++) {
					expect(parseNum(`001.${i}e-2`)).toEqual(["", `01${i}`]);
					expect(parseNum(`+001.${i}e-2`)).toEqual(["", `01${i}`]);
				}
			});
		});
		
		describe("exponent with leading zeros", function() {
			test("positive exponent", function() {
				for(let i = 1; i <= 9; i++) {
					expect(parseNum(`1.${i}e002`)).toEqual([`1${i}0`, ""]);
					expect(parseNum(`1.${i}e+002`)).toEqual([`1${i}0`, ""]);
					expect(parseNum(`+1.${i}e002`)).toEqual([`1${i}0`, ""]);
					expect(parseNum(`+1.${i}e+002`)).toEqual([`1${i}0`, ""]);
				}
			});

			test("negative exponent", function() {
				for(let i = 1; i <= 9; i++) {
					expect(parseNum(`1.${i}e-002`)).toEqual(["", `01${i}`]);
					expect(parseNum(`+1.${i}e-002`)).toEqual(["", `01${i}`]);
				}
			});
		});
	});

	describe("negative values", function() {
		describe("exact value of mantissa", function() {
			test("positive exponent", function() {
				for(let i = 1; i <= 9; i++) {
					expect(parseNum(`-1.${i}e2`)).toEqual([`-1${i}0`, ""]);
					expect(parseNum(`-1.${i}e+2`)).toEqual([`-1${i}0`, ""]);
				}
			});

			test("negative exponent", function() {
				for(let i = 1; i <= 9; i++)
					expect(parseNum(`-1.${i}e-2`)).toEqual(["-", `01${i}`]);
			});
		});
		
		describe("mantissa with trailing zeros", function() {
			test("positive exponent", function() {
				for(let i = 1; i <= 9; i++) {
					expect(parseNum(`-1.${i}00e2`)).toEqual([`-1${i}0`, ""]);
					expect(parseNum(`-1.${i}00e+2`)).toEqual([`-1${i}0`, ""]);
				}
			});

			test("negative exponent", function() {
				for(let i = 1; i <= 9; i++)
					expect(parseNum(`-1.${i}00e-2`)).toEqual(["-", `01${i}`]);
			});
		});
		
		describe("mantissa with leading zeros", function() {
			test("positive exponent", function() {
				for(let i = 1; i <= 9; i++) {
					expect(parseNum(`-001.${i}e2`)).toEqual([`-1${i}0`, ""]);
					expect(parseNum(`-001.${i}e+2`)).toEqual([`-1${i}0`, ""]);
				}
			});

			test("negative exponent", function() {
				for(let i = 1; i <= 9; i++)
					expect(parseNum(`-001.${i}e-2`)).toEqual(["-", `01${i}`]);
			});
		});
		
		describe("exponent with leading zeros", function() {
			test("positive exponent", function() {
				for(let i = 1; i <= 9; i++) {
					expect(parseNum(`-1.${i}e002`)).toEqual([`-1${i}0`, ""]);
					expect(parseNum(`-1.${i}e+002`)).toEqual([`-1${i}0`, ""]);
				}
			});

			test("negative exponent", function() {
				for(let i = 1; i <= 9; i++)
					expect(parseNum(`-1.${i}e-002`)).toEqual(["-", `01${i}`]);
			});
		});
	});
});