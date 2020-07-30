import { RoundingMode } from "./context";
import { pad } from "./parsers";

/**
 * Rounds a number off, accurate to the given power of 10. The rounding algorithms
 * are heavily influenced by the [Java implementation of the same](https://docs.oracle.com/javase/8/docs/api/java/math/RoundingMode.html).
 * @param num The number to round off.
 * @param power The power of 10 to round the number to.
 * @param mode Flag for which rounding algorithm to use.
 */
export function roundTo(num: bigint, power: number, mode: RoundingMode) {
	const divider = BigInt(pad("1", power, "0", "end"));
	let rounded = num / divider, last = num % divider;
	const one = BigInt("1"), ten = BigInt("10");
	const FIVE = BigInt(pad("5", power - 1, "0", "end")), ONE = BigInt(pad("1", power - 1, "0", "end"));
	switch(mode) {
	case RoundingMode.UP:
		if(last >= ONE) rounded += one;
		else if(last <= -ONE) rounded -= one;
		break;
	case RoundingMode.DOWN:
		break;
	case RoundingMode.CEIL:
		if(last >= 0) rounded += one;
		break;
	case RoundingMode.FLOOR:
		if(last <= 0) rounded -= one;
		break;
	case RoundingMode.HALF_DOWN:
		if(last > FIVE) rounded += one;
		else if(last < -FIVE) rounded -= one;
		break;
	case RoundingMode.HALF_UP:
		if(last >= FIVE) rounded += one;
		else if(last <= -FIVE) rounded -= one;
		break;
	case RoundingMode.HALF_EVEN:
		if(last > FIVE) rounded += one;
		else if(last < -FIVE) rounded -= one;
		else if(Math.abs(Number(rounded % ten)) % 2 !== 0) {
			if(last === FIVE) rounded += one;
			else if(last === -FIVE) rounded -= one;
		}
		break;
	case RoundingMode.UNNECESSARY:
		if(last > 0 || last < 0)
			throw Error("Rounding necessary. Exact representation not known.");
		break;
	}
	return rounded;
}