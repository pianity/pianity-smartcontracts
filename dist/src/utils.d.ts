import { Type } from "io-ts";
import { State } from "./contractTypes";
/**
 * Returns `input` if `input`'s type is correct according to `codec`; throws otherwise.
 */
export declare function checkInput<INPUT, CODEC extends Type<INPUT, INPUT, unknown>>(codec: CODEC, input: INPUT): INPUT;
export declare function hasOwnProperty(object: any, property: string): boolean;
export declare function sleep(seconds: number): Promise<void>;
export declare function wrapErrorAsync<T extends unknown[], U, V extends Error>(action: (...args: T) => Promise<U>, args: T, error: V): Promise<U>;
export declare function exhaustive(_: never): never;
export declare type Handler<INPUT> = (state: State, caller: string, input: INPUT) => void;
export declare type WrappedInput<INPUT> = Omit<INPUT, "function">;
export declare type WrappedHandler<INPUT> = (state: State, caller: string, input: WrappedInput<INPUT>) => void;
export declare function wrapHandler<INPUT>(handler: Handler<INPUT>): [Handler<INPUT>, WrappedHandler<INPUT>];
