/**
 * Specifies a *rounding behaviour* for numerical operations on {@link BigNum}
 * which are capable of discarding some precision. This is based on the [Java
 * implementation of rounding behaviour](https://docs.oracle.com/javase/8/docs/api/java/math/RoundingMode.html).
 * Each rounding mode indicates how the least significant digit of the rounded
 * result is to be calculated. If fewer digits are returned than the original
 * number then the discarded digits are called the *discarded fraction*.
 */
export enum RoundingMode {
	/**
	 * Rounds the number away from 0 only if the first digit of the discarded
	 * fraction is more than or equal to 1.
	 * 
	 * | Number | Rounded to 1 decimal place with UP rounding |
	 * |-------|------------|
	 * | 5.01 | 5.1 |
	 * | 5.001 | 5.0 |
	 * | 5.0 | 5.0 |
	 * | -5.0 | -5.0 |
	 * | -5.001 | -5.0 |
	 * | -5.01 | -5.1 |
	 * 
	 */
	UP,
	/**
	 * Rounds the number towards 0.
	 * 
	 * | Number | Rounded to 1 decimal place with DOWN rounding |
	 * |-------|------------|
	 * | 5.01 | 5.0 |
	 * | 5.001 | 5.0 |
	 * | 5.0 | 5.0 |
	 * | -5.0 | -5.0 |
	 * | -5.001 | -5.0 |
	 * | -5.01 | -5.0 |
	 * 
	 */
	DOWN,
	/**
	 * Rounds the number towards positive infinity.
	 * 
	 * | Number | Rounded to 1 decimal place with CEIL rounding |
	 * |-------|------------|
	 * | 5.001 | 5.1 |
	 * | 5.0001 | 5.1 |
	 * | 5.0 | 5.0 |
	 * | -5.0 | -5.0 |
	 * | -5.0001 | -5.0 |
	 * | -5.001 | -5.0 |
	 * 
	 */
	CEIL,
	/**
	 * Rounds the number down towards negative infinity.
	 * 
	 * | Number | Rounded to 1 decimal place with FLOOR rounding |
	 * |-------|------------|
	 * | 5.001 | 5.0 |
	 * | 5.0001 | 5.0 |
	 * | 5.0 | 5.0 |
	 * | -5.0 | -5.0 |
	 * | -5.0001 | -5.1 |
	 * | -5.001 | -5.1 |
	 * 
	 */
	FLOOR,
	/**
	 * Rounds towards nearest neighbour. In case it is equidistant it is rounded
	 * up.
	 * 
	 * | Number | Rounded to 1 decimal place with HALF_UP rounding |
	 * |-------|------------|
	 * | 5.06 | 5.1 |
	 * | 5.05 | 5.1 |
	 * | 5.04 | 5.0 |
	 * | 5.0 | 5.0 |
	 * | -5.0 | -5.0 |
	 * | -5.04 | -5.0 |
	 * | -5.05 | -5.1 |
	 * | -5.06 | -5.1 |
	 * 
	 */
	HALF_UP,
	/**
	 * Rounds towards nearest neighbour. In case it is equidistant it is rounded
	 * down.
	 * 
	 * | Number | Rounded to 1 decimal place with HALF_DOWN rounding |
	 * |-------|------------|
	 * | 5.06 | 5.1 |
	 * | 5.05 | 5.0 |
	 * | 5.04 | 5.0 |
	 * | 5.0 | 5.0 |
	 * | -5.0 | -5.0 |
	 * | -5.04 | -5.0 |
	 * | -5.05 | -5.0 |
	 * | -5.06 | -5.1 |
	 * 
	 */
	HALF_DOWN,
	/**
	 * Rounds towards nearest neighbour. In case it is equidistant it is rounded
	 * to nearest even neighbour.
	 * 
	 * | Number | Rounded to 1 decimal place with HALF_EVEN rounding |
	 * |-------|------------|
	 * | 5.15 | 5.2 |
	 * | 5.06 | 5.1 |
	 * | 5.05 | 5.0 |
	 * | 5.04 | 5.0 |
	 * | 5.0 | 5.0 |
	 * | -5.0 | -5.0 |
	 * | -5.04 | -5.0 |
	 * | -5.05 | -5.0 |
	 * | -5.06 | -5.1 |
	 * | -5.15 | -5.2 |
	 * 
	 */
	HALF_EVEN,
	/** Rounding mode to assert that no rounding is necessary as an exact
	 * representation is possible. If this mode is specified for an operation
	 * with an inexact result then it throws an Error.
	 */
	UNNECESSARY
}

/**
 * An object type which holds information about the context settings that
 * describes certain rules for certain numerical operations.
 */
export type MathContext = {
	/**
	 * The number of decimal places a {@link BigNum} object should store. This does
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
	 * The default {@link MathContext} used when an exact representation cannot be
	 * achieved for some operation.
	 */
	export const DEFAULT_CONTEXT: MathContext = {
		precision: 17,
		rounding: RoundingMode.UP
	};

	/**
	 * The {@link MathContext} used for high precision calculation. Stores up to
	 * 50 places after the decimal point with {@link RoundingMode.UP} rounding algorithm.
	 */
	export const HIGH_PRECISION: MathContext = {
		precision: 50,
		rounding: RoundingMode.UP
	};

	/**
	 * The {@link MathContext} which defines how numbers are dealt with in science.
	 * It has slightly higher precision value than the default context with
	 * {@link RoundingMode.HALF_EVEN} rounding algorithm.
	 */
	export const SCIENTIFIC: MathContext = {
		precision: 20,
		rounding: RoundingMode.HALF_EVEN
	};

	/**
	 * The {@link MathContext} which defines how to deal with high precision
	 * numbers in science. It has the same precision value as the high precision one
	 * and {@link RoundingMode.HALF_EVEN} rounding algorithm.
	 */
	export const HIGH_PREC_SCIENTIFIC: MathContext = {
		precision: 50,
		rounding: RoundingMode.HALF_EVEN
	};
}
