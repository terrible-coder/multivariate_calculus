import { IndeterminateForm, DivisionByZero } from "../errors";

export enum RoundingMode {
	UP,
	DOWN,
	HALF_UP,
	HALF_DOWN,
	HALF_EVEN,
	UNNECESSARY
}

export type MathContext = {
	precision: number;
	rounding: RoundingMode
}

export class BigNum {

	public static DEFAULT_CONTEXT: MathContext = {
		precision: 17,
		rounding: RoundingMode.HALF_EVEN
	};
	readonly integer: string;
	readonly decimal: string;

	constructor(num: string) {
		const parts = num.split(".");
		if(parts.length > 2)
			throw new Error("Number format exception.");
		let [integer, decimal] = parts;
		let i;
		if(integer !== undefined) {
			for(i = 0; i < integer.length; i++)
				if(integer.charAt(i) !== '0')
					break;
			integer = integer.substring(i) || "0";
		} else integer = "0";
		if(decimal !== undefined) {
			for(i = decimal.length - 1; i >= 0; i--)
				if(decimal.charAt(i) !== '0')
					break;
			decimal = decimal.substring(0, i+1) || "0";
		} else decimal = "0";
		this.integer = integer;
		this.decimal = decimal;
	}

	private get asBigInt() {
		return BigInt(this.integer + this.decimal);
	}

	private get precision() {
		return this.decimal.length;
	}

	public add(that: BigNum) {
		const d = this.precision - that.precision;
		const padding = BigInt(Math.pow(10, Math.abs(d)));
		const sum = (d > 0? this.asBigInt + that.asBigInt * padding: this.asBigInt * padding + that.asBigInt).toString();
		const precision = Math.max(this.precision, that.precision);
		const i = sum.length - precision;
		return new BigNum(sum.substring(0, i) + "." + sum.substring(i));
	}

	public sub(that: BigNum) {
		const d = this.precision - that.precision;
		const padding = BigInt(Math.pow(10, Math.abs(d)));
		const diff = (d > 0? this.asBigInt - that.asBigInt * padding: this.asBigInt * padding - that.asBigInt).toString();
		const precision = Math.max(this.precision, that.precision);
		const i = diff.length - precision;
		return new BigNum(diff.substring(0, i) + "." + diff.substring(i));
	}

	public mul(that: BigNum) {
		const prod = (this.asBigInt * that.asBigInt).toString();
		const precision = this.precision + that.precision;
		const i = prod.length - precision;
		return new BigNum(prod.substring(0, i) + "." + prod.substring(i));
	}

	public div(that: BigNum) {
		if(that.integer === "0" && that.decimal === "0") {
			if(this.integer === "0" && that.decimal === "0")
				throw new IndeterminateForm("Cannot determine 0/0.");
			throw new DivisionByZero("Cannot divide by zero.");
		}
		const p = BigNum.DEFAULT_CONTEXT.precision;
		const raise = p - this.precision + that.precision;
		const a = this.asBigInt * BigInt(Math.pow(10, raise));
		const b = that.asBigInt;
		let quo = (a / b).toString();
		if(p > quo.length)
			quo = new Array(p - quo.length).fill("0").join("") + quo;
		const i = quo.length - p;
		return new BigNum(quo.substring(0, i) + "." + quo.substring(i));
	}

	public toString() {
		return this.integer + "." + this.decimal;
	}
}