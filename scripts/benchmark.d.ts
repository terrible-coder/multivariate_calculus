/// <reference types="jest" />
declare global {
    export namespace jest {
        interface Matchers<R> {
            toTakeLessThan(time: number): CustomMatcherResult;
        }
    }
}
export declare function doNothing(): void;
