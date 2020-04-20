import { math } from "./math";

/** The negative value of its argument. */
export const neg = math.neg;
/** The trigonometric sine function. */
export const sin = math.sin;
/** The trigonometric cosine function. */
export const cos = math.cos;
/** The trigonometric tangent function. */
export const tan = math.tan;
/** The inverse trigonometric sine function. */
export const asin = math.asin;
/** The inverse trigonometric cosine function. */
export const acos = math.acos;
/** The inverse trigonometric tangent function. */
export const atan = math.atan;
/** The hyperbolic sine function. */
export const sinh = math.sinh;
/** The hyperbolic cosine function. */
export const cosh = math.cosh;
/** The hyperbolic tangent function. */
export const tanh = math.tanh;
/** The inverse hyperbolic sine function. */
export const asinh = math.asinh;
/** The inverse hyperbolic cosine function. */
export const acosh = math.acosh;
/** The inverse hyperbolic tangent function. */
export const atanh = math.atanh;
/** The common logarithm function (to the base 10). */
export const log = math.log;
/** The natural logarithm function (to the base `e`). */
export const ln = math.ln;
/** The exponentiation function. */
export const exp = math.exp;
/** The square root function. */
export const sqrt = math.sqrt;
/** The absolute value function. */
export const abs = math.abs;
/** The greatest integer function. */
export const floor = math.floor;
/** The smallest integer function. */
export const ceil = math.ceil;

/**
 * Prints the string representation of an object to the default console.
 * @param obj Object to print.
 */
export function print(obj: any) {
    if(obj.toString !== undefined)
        console.log(obj.toString());
    else console.log(obj);
}