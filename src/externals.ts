import assert from "node:assert";

import Arweave from "arweave";
import { SmartWeaveGlobal } from "warp-contracts";
import BigNumberLib from "bignumber.js";

const arweave = Arweave.init({});

export const SmartWeave: SmartWeaveGlobal = new SmartWeaveGlobal(
    arweave,
    { id: "", owner: "" },
    {
        ignoreExceptions: false,
        waitForConfirmation: false,
        updateCacheForEachInteraction: false,
        internalWrites: false,
        maxCallDepth: 2,
        maxInteractionEvaluationTimeSeconds: 120,
        stackTrace: {
            saveState: false,
        },
        bundlerUrl: "",
        gasLimit: 1,
        useFastCopy: false,
        manualCacheFlush: false,
        useVM2: false,
        allowUnsafeClient: true,
        walletBalanceUrl: "",
    },
);
export const ContractError = Error;
export const ContractAssert: (cond: unknown, message?: string) => asserts cond = assert;
export class BigNumber extends BigNumberLib {}
// eslint-disable-next-line @typescript-eslint/no-empty-function
export function _log(..._values: unknown[]) {}
