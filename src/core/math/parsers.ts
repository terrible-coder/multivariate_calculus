function trimZeroes(s: string, pos: "end" | "start") {
	let i: number;
	if (pos === "end") {
		for (i = s.length - 1; i >= 0; i--)
			if (s.charAt(i) !== '0')
				break;
		return s.substring(0, i + 1);
	}
	for (i = 0; i < s.length; i++)
		if (s.charAt(i) !== '0')
			break;
	return s.substring(i);
}
function isInteger(s: string, positive = false) {
	const valids = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
	const ch = s.charAt(0);
	const st = positive ? (ch === '+' ? s.substring(1) : s) : ((ch === '+' || ch === '-') ? s.substring(1) : s);
	for (let x of st)
		if (!(x in valids))
			return false;
	return true;
}
function isDecimal(s: string) {
	const parts = s.split('.');
	if (parts.length > 2)
		return false;
	return parts.length === 1 ? isInteger(parts[0]) : isInteger(parts[0]) && isInteger(parts[1], true);
}
function isValid(s: string) {
	if (s.indexOf('e') > -1) {
		// The number is in scientific mode
		// Me-E
		// M is the mantissa and E is the exponent with base 10
		const i = s.indexOf('e');
		const mantissa = s.substring(0, i), exponent = s.substring(i + 1);
		return isDecimal(mantissa) && isInteger(exponent);
	}
	return isDecimal(s);
}
/**
 * Given a string, adds padding to the rear or front. This is an implementation
 * to only aid with numerical operations where the numbers are stored as
 * strings. Do not use for general use.
 * @param s The string which is to be padded.
 * @param n Number of times padding string must be used.
 * @param char The padding string. It must be a single character string.
 * @param front Flag value to indicate whether to pad at front or at rear.
 * @ignore
 */
export function pad(s: string, n: number, char: string, front = false) {
	if (char.length > 1)
		throw new Error("Padding string must have only one character.");
	return front ? "".padEnd(n, char) + s : s + "".padEnd(n, char);
}
/**
 * Inserts a decimal point in the string at a given index. The `index`
 * value is calculated from the rear of the string starting from 1.
 * @param a The number as a string.
 * @param index The index from the rear.
 * @ignore
 */
export function decimate(a: string, index: number) {
	if (index < 0)
		throw new Error("Cannot put decimal point at negative index.");
	let s = a, sgn = "";
	if (s.charAt(0) === '-') {
		s = s.substring(1);
		sgn = "-";
	}
	if (index > s.length)
		s = "0." + pad(s, index - s.length, "0", true);
	else
		s = s.substring(0, s.length - index) + "." + s.substring(s.length - index);
	return sgn + s;
}
/**
 * Takes a string and parses into the format expected by the [[BigNum]] class.
 * @param s String representation of the number.
 * @returns An array where the first element is the integer part and the second is the decimal part.
 */
export function parseNum(s: string) {
	if (!isValid(s))
		throw new TypeError("Illegal number format.");
	let a = [];
	if (s.indexOf('e') > -1) {
		// The number is in scientific mode
		// Me-E
		// M is the mantissa and E is the exponent with base 10
		const i = s.indexOf('e');
		const mantissa = s.substring(0, i), exponent = Number(s.substring(i + 1));
		const index = mantissa.indexOf('.');
		const precision = index == -1 ? 0 : mantissa.substring(index + 1).length;
		let num = mantissa.split('.').join("");
		if (exponent > precision) {
			num = pad(mantissa, exponent - precision, "0");
		}
		else
			num = decimate(num, precision - exponent);
		a = num.split(".");
	}
	else
		a = s.split(".");
	return a.length === 1 ? [trimZeroes(a[0], "start"), ""] :
		[trimZeroes(a[0], "start"), trimZeroes(a[1], "end")];
}
