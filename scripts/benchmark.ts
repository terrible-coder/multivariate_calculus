import { performance } from "perf_hooks";

declare global {
	export namespace jest {
		export interface Matchers<R> {
			toTakeLessThan(time: number): CustomMatcherResult;
		}
	}
}

expect.extend({
	toTakeLessThan: function(fn: () => void, time: number) {
		const now = performance.now();
		fn();
		const then = performance.now();
		const timeTaken = then - now;
		const pass = timeTaken <= time;
		const message = function() {
			if(pass)
				return [
					`Function ${fn.name} took less than ${time} milliseconds.`,
					`It took ${timeTaken} milliseconds.`
				].join(" \n");
			return [
				`Function ${fn.name} took longer than ${time} milliseconds.`,
				`It took ${timeTaken} milliseconds.`
			].join(" \n");
		}
		return {
			pass: pass,
			message: message
		}
	}
});

export function doNothing() {}