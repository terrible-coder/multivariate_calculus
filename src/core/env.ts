import { MathContext } from "./math/context";

type env = {
    /** Specifies the precision settings and rounding algorithm to use. */
    mode?: MathContext,
    /** Specifies how to interpret the coordinates of any multidimensional system. */
    coordinate_system?: "cartesian"
}

/**
 * Stores information about the Math environment.
 */
export const mathenv: env = {
    mode: MathContext.DEFAULT_CONTEXT,
    coordinate_system: "cartesian"
}
