import { BinaryOperator, Evaluable } from "./definitions";

export const ADD = BinaryOperator.define("+", (a: Evaluable, b: Evaluable) => a.add(b));
export const MUL = BinaryOperator.define("*", (a: Evaluable, b: Evaluable) => a.mul(b));
