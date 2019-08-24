import { IndeterminateForm, DivisionByZero } from "../errors";
import { abs } from "./functions";

export enum RoundingMode {
	UP,
	DOWN,
	CEIL,
	FLOOR,
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

	public get sign() {
		if(this.integer === "0" && this.decimal === "0")
			return 0;
		if(this.integer.charAt(0) === '-')
			return -1;
		return 1;
	}

	public static abs(x: BigNum) {
		return x.integer.charAt(0) === '-'? new BigNum(x.integer.substring(1) + "." + x.decimal): x;
	}

	public static round(x: BigNum, context: MathContext) {
		const one = BigInt(1), ten = BigInt(10);
		if(x.precision > context.precision) {
			const diff = x.precision - context.precision;
			const num = x.asBigInt;
			const divider = BigInt(Math.pow(10, diff));
			let rounded = num / divider;
			const last = num % divider;
			const five = BigInt(5 * Math.pow(10, diff - 1));
			switch(context.rounding) {
			case RoundingMode.UP:
				if(last > 0) rounded += one;
				else if(last < 0) rounded -= one;
				break;
			case RoundingMode.DOWN:
				break;
			case RoundingMode.CEIL:
				if(last > 0) rounded += one;
				break;
			case RoundingMode.FLOOR:
				if(last < 0) rounded -= one;
				break;
			case RoundingMode.HALF_DOWN:
				if(last > five) rounded += one;
				else if(last < -five) rounded -= one;
				break;
			case RoundingMode.HALF_UP:
				if(last >= five) rounded += one;
				else if(last <= -five) rounded -= one;
				break;
			case RoundingMode.HALF_EVEN:
				if(last > five) rounded += one;
				else if(last < -five) rounded -= one;
				else if(abs(Number(rounded % ten)) % 2 !== 0) {
					if(last === five) rounded += one;
					else if(last === -five) rounded -= one;
				}
				break;
			case RoundingMode.UNNECESSARY:
				if(last > 0 || last < 0)
					throw Error("Rounding necessary. Exact representation not known.");
				break;
			}
			let r = rounded.toString();
			const i = r.length - context.precision;
			return new BigNum(r.substring(0, i) + "." + r.substring(i));
		} else return x;
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
		if(that.sign === 0) {
			if(this.sign === 0)
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