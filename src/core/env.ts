import { MathContext } from "./math/context";
/**
 * @ignore
 */
type env = {
    /**
     * Specifies the precision settings and rounding algorithm to use
     * for numerical operations. Any operation by default will use this value if
     * no context settings object has been given.
     */
    mode: MathContext,
    /** Specifies how to interpret the coordinates of any multidimensional system. */
    coordinate_system: "cartesian"
}

/**
 * Stores information about the Math environment.
 */
export const mathenv: env = {
	mode: MathContext.DEFAULT_CONTEXT,
	coordinate_system: "cartesian"
};
