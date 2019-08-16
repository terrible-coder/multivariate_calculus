export type MathContext = {
	accuracy: number;
}

export class BigNum {

	public context: MathContext;
	readonly integer: string;
	readonly decimal: string;

	constructor(num: string, context?: MathContext) {
		this.context = context || {
			accuracy: 17
		};
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

	private get digits() {
		return this.integer.length + this.decimal.length;
	}

	public add(that: BigNum) {
		const d = this.digits - that.digits;
		const padding = BigInt(Math.pow(10, Math.abs(d)));
		const sum = (d > 0? this.asBigInt + that.asBigInt * padding: this.asBigInt * padding + that.asBigInt).toString();
		const i = sum.length - Math.max(this.decimal.length, that.decimal.length);
		return new BigNum(sum.substring(0, i) + "." + sum.substring(i));
	}

	public sub(that: BigNum) {
		const d = this.digits - that.digits;
		const padding = BigInt(Math.pow(10, Math.abs(d)));
		const diff = (d > 0? this.asBigInt - that.asBigInt * padding: this.asBigInt * padding - that.asBigInt).toString();
		const i = diff.length - Math.max(this.decimal.length, that.decimal.length);
		return new BigNum(diff.substring(0, i) + "." + diff.substring(i));
	}

	public mul(that: BigNum) {
		const prod = (this.asBigInt * that.asBigInt).toString();
		const i = prod.length - (this.decimal.length + that.decimal.length);
		return new BigNum(prod.substring(0, i) + "." + prod.substring(i));
	}

	public div(that: BigNum) {
		const integer = (BigInt(this.integer) / BigInt(that.integer)).toString();
		const i = integer === "0"? 0: integer.length;
		const a = this.asBigInt * BigInt(Math.pow(10, this.context.accuracy));
		const b = that.asBigInt;
		const quo = (a / b).toString();
		return new BigNum(quo.substring(0, i) + "." + quo.substring(i));
	}

	public toString() {
		return this.integer + "." + this.decimal;
	}
}