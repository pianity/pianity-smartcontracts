import { isLeft } from "fp-ts/lib/Either";
import { Type } from "io-ts";
import { PathReporter } from "io-ts/lib/PathReporter";

import { State } from "@/contractTypes";
import { ContractError } from "@/externals";

/**
 * Returns `input` if `input`'s type is correct according to `codec`; throws otherwise.
 */
export function checkInput<INPUT, CODEC extends Type<INPUT, INPUT, unknown>>(
    codec: CODEC,
    input: INPUT,
): INPUT {
    const inputDecoded = codec.decode(input);
    if (isLeft(inputDecoded)) {
        const report = PathReporter.report(inputDecoded).join("\n");
        throw new ContractError(report);
    }

    return input;
}

export function hasOwnProperty(object: any, property: string) {
    return Object.prototype.hasOwnProperty.call(object, property);
}

export function sleep(seconds: number) {
    return new Promise<void>((resolve) => {
        setTimeout(resolve, seconds * 1000);
    });
}

export function wrapErrorAsync<T extends unknown[], U, V extends Error>(
    action: (...args: T) => Promise<U>,
    args: T,
    error: V,
): Promise<U> {
    try {
        return action(...args);
    } catch {
        throw error;
    }
}

export function exhaustive(_: never): never {
    throw new Error("Check wasn't exhaustive");
}

// TODO: Investigate actually using this
export type Handler<INPUT> = (state: State, caller: string, input: INPUT) => void;
export type WrappedInput<INPUT> = Omit<INPUT, "function">;
export type WrappedHandler<INPUT> = (
    state: State,
    caller: string,
    input: WrappedInput<INPUT>,
) => void;

export function wrapHandler<INPUT>(
    handler: Handler<INPUT>,
): [Handler<INPUT>, WrappedHandler<INPUT>] {
    const wrappedHandler: WrappedHandler<INPUT> = function wrappedHandler(
        state: State,
        caller: string,
        input: WrappedInput<INPUT>,
    ) {
        handler(state, caller, { ...input, function: handler.name } as unknown as INPUT);
    };

    return [handler, wrappedHandler];
}
