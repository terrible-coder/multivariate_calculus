import { Vector } from "./vector";

export class Scalar {
	constructor(readonly value: number) {}

	public add(that: Scalar) {
		return new Scalar(this.value + that.value);
	}

	public sub(that: Scalar) {
		return new Scalar(this.value - that.value);
	}

	public mul(that: Scalar|Vector) {
		if(that instanceof Scalar)
			return new Scalar(this.value * that.value);
		return that.scale(this.value);
	}

	public div(that: Scalar) {
		if(that.value === 0)
			throw "Division by zero error.";
		return new Scalar(this.value / that.value);
	}
}