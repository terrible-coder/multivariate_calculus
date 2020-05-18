/**
 * Specifies a *rounding behaviour* for numerical operations on [[BigNum]]
 * which are capable of discarding some precision. This is based on the JAVA
 * implementation of rounding behaviour. Read more [here](https://docs.oracle.com/javase/8/docs/api/java/math/RoundingMode.html).
 */
export enum RoundingMode {
	/** Rounds the number away from 0. */
	UP,
	/** Rounds the number down towards 0. */
	DOWN,
	/** Rounds the number up towards positive infinity. */
	CEIL,
	/** Rounds the number down towards negative infinity. */
	FLOOR,
	/** Rounds towards nearest neighbour. In case it is equidistant it is rounded up. */
	HALF_UP,
	/** Rounds towards nearest neighbour. In case it is equidistant it is rounded down. */
	HALF_DOWN,
	/** Rounds towards nearest neighbour. In case it is equidistant it is rounded to nearest even number. */
	HALF_EVEN,
	/** Rounding mode to assert that no rounding is necessary as an exact representation is possible. */
	UNNECESSARY
}

/**
 * An object type which holds information about the context settings that
 * describes certain rules for certain numerical operations.
 */
export type MathContext = {
	/**
	 * The number of decimal places a [[BigNum]] object should store. This does
	 * not represent the number of significant digits in the number unlike the
	 * JAVA implementation of the same concept.
	 */
	precision: number;

	/**
	 * The rounding algorithm that should be used for a particular numerical
	 * operation. Care must be taken as to when the UNNECESSARY mode is used,
	 * it will throw an exception if an exact representation of the result is
	 * not found.
	 */
	rounding: RoundingMode;
};

export namespace MathContext {
	/**
	 * The default [[MathContext]] used when an exact representation cannot be
	 * achieved for some operation.
	 */
	export const DEFAULT_CONTEXT: MathContext = {
		precision: 17,
		rounding: RoundingMode.UP
	};

	/**
	 * The [[MathContext]] used for high precision calculation. Stores up to
	 * 50 places after the decimal point with [[RoundingMode.UP]] rounding algorithm.
	 */
	export const HIGH_PRECISION: MathContext = {
		precision: 50,
		rounding: RoundingMode.UP
	};

	/**
	 * The [[MathContext]] which defines how numbers are dealt with in science.
	 * It has slightly higher precision value than the default context with
	 * [[RoundingMode.HALF_EVEN]] rounding algorithm.
	 */
	export const SCIENTIFIC: MathContext = {
		precision: 20,
		rounding: RoundingMode.HALF_EVEN
	};

	/**
	 * The [[MathContext]] which defines how to deal with high precision
	 * numbers in science. It has the same precision value as the high precision one
	 * and [[RoundingMode.HALF_EVEN]] rounding algorithm.
	 */
	export const HIGH_PREC_SCIENTIFIC: MathContext = {
		precision: 50,
		rounding: RoundingMode.HALF_EVEN
	};
}
