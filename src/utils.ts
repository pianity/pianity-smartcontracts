import { isLeft } from "fp-ts/lib/Either";
import { Type } from "io-ts";

import { State } from "@/contractTypes";
import { ContractError } from "@/externals";

import PrettyReporter from "@/prettyReporter";

/**
 * Returns `input` if `input`'s type is correct according to `codec`; throws otherwise.
 */
export function checkInput<INPUT, CODEC extends Type<INPUT, INPUT, unknown>>(
    codec: CODEC,
    input: INPUT,
): INPUT {
    const inputDecoded = codec.decode(input);
    if (isLeft(inputDecoded)) {
        // const report = PathReporter.report(inputDecoded).join("\n");
        const report = PrettyReporter.report(inputDecoded).join("\n");
        throw new ContractError(report);
    }

    return input;
}

export function isPositiveInt(value: number): boolean {
    return Number.isInteger(value) && value > 0;
}

export function isPositiveIntBn(value: BigNumber): boolean {
    return Number.isInteger(value) && value > 0;
}
export function hasOwnProperty(object: any, property: string) {
    return Object.prototype.hasOwnProperty.call(object, property);
}

export function exhaustive(_: never): never {
    throw new Error("Check wasn't exhaustive");
}
