import { IllegalNumberFormat } from "../../../src/core/errors";
import { align, decimate, pad, parseNum, trimZeroes } from "../../../src/core/math/parsers";

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

		test("0 diff", function() {
			expect(align("1234", "LLL", "o", 0)).toEqual(["1234", "LLL"]);
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

		test("0 diff", function() {
			const a = new Array(4).fill(0).map(() => random());
			const b = new Array(3).fill(0).map(() => random());
			expect(align(a, b, elt, 0)).toEqual([a, b]);
		});
	});
});

describe("trimming", function() {
	describe("with string", function() {
		test("from end", function() {
			const a = "LaLaLaLaaaa";
			expect(trimZeroes(a, "end", x => x === 'a')).toBe("LaLaLaL");
		});

		test("from beginning", function() {
			const a = "aaaaargh!!";
			expect(trimZeroes(a, "start", x => x === 'a')).toBe("rgh!!");
		});
	});

	describe("with object", function() {
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

		test("from end", function() {
			const a = new Array(5).fill(0).map(() => random());
			const noisy = a.concat(new Array(3).fill(elt));
			expect(trimZeroes(noisy, "end", x => x == elt)).toEqual(a);
		});

		test("from beginning", function() {
			const a = new Array(5).fill(0).map(() => random());
			const noisy = (new Array(3).fill(elt)).concat(a);
			expect(trimZeroes(noisy, "start", x => x == elt)).toEqual(a);
		});
	});
});

describe("padding", function() {
	describe("with strings", function() {
		test("at end", function() {
			expect(pad("hell", 2, "oo", "end")).toBe("helloooo");
		});

		test("at beginning", function() {
			expect(pad("foo", 3, "bar", "start")).toBe("barbarbarfoo");
		});
	});

	describe("with objects", function() {
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

		test("at end", function() {
			const a = new Array(3).fill(0).map(() => random());
			const b = new Array(5).fill(elt);
			expect(pad(a, 5, elt, "end")).toEqual(a.concat(b));
		});

		test("at beginning", function() {
			const a = new Array(3).fill(0).map(() => random());
			const b = new Array(2).fill(elt);
			expect(pad(a, 2, elt, "start")).toEqual(b.concat(a));
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

		test("errors", function() {
			expect(() => parseNum("1.1.1")).toThrow(IllegalNumberFormat);
			expect(() => parseNum("a.1")).toThrow();
			expect(() => parseNum("1.0!")).toThrow();
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

		test("errors", function() {
			expect(() => parseNum("-1.1.1")).toThrow(IllegalNumberFormat);
			expect(() => parseNum("-B.1")).toThrow();
			expect(() => parseNum("-1.0!")).toThrow();
			expect(() => parseNum("0.-212")).toThrow(IllegalNumberFormat);
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

		test("errors", function() {
			expect(() => parseNum("1e1.2")).toThrow(IllegalNumberFormat);
			expect(() => parseNum("5e")).toThrow();
			expect(() => parseNum("e10")).toThrow();
			expect(() => parseNum("0.e-212")).toThrow(IllegalNumberFormat);
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

		test("errors", function() {
			expect(() => parseNum("-1e1.2")).toThrow(IllegalNumberFormat);
			expect(() => parseNum("-5e")).toThrow();
			expect(() => parseNum("-e10")).toThrow();
			expect(() => parseNum("-0.e-212")).toThrow(IllegalNumberFormat);
		});
	});
});