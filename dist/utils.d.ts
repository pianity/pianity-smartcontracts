import { Type } from "io-ts";
import BigNumber from "bignumber.js";
/**
 * Returns `input` if `input`'s type is correct according to `codec`; throws otherwise.
 */
export declare function checkInput<INPUT, CODEC extends Type<INPUT, INPUT, unknown>>(codec: CODEC, input: INPUT): INPUT;
export declare function isPositiveInt(value: number): boolean;
export declare function isPositiveIntBn(value: BigNumber): boolean;
export declare function hasOwnProperty(object: any, property: string): boolean;
export declare function exhaustive(_: never): never;
