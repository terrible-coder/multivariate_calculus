import { Vector as Vec } from "./vector";

export module Field {
	export class Scalar {
		private expression: (v:Vec)=>number;
		constructor(expr: (v:Vec)=>number) {
			this.expression = expr;
		}
		public at(v: Vec) {
			return this.expression(v);
		}
	}

	export class Vector {
		private expression: (v: Vec)=>Vec;
		constructor(expr: (v: Vec)=>Vec) {
			this.expression = expr;
		}
		public at(v: Vec) {
			return this.expression(v);
		}
	}
}