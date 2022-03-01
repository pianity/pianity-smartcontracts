import * as io from "io-ts";

import { ReadWriteResult, State } from "@/contractTypes";
import { ReadonlysResult, TransactionBatchInputCodec } from "@/handlers";
import { checkInput } from "@/utils";
import { handle } from "@/erc1155";

export type TransactionBatchInput = io.TypeOf<typeof TransactionBatchInputCodec>;
export type TransactionBatchResult = {
    results: Array<ReadonlysResult | TransactionBatchResult | undefined>;
};

export async function transactionBatch(
    state: State,
    caller: string,
    input: TransactionBatchInput,
): Promise<ReadWriteResult<TransactionBatchResult>> {
    const { inputs } = checkInput(TransactionBatchInputCodec, input);

    // const transactions: [] = input.transactions || [];
    const results = [];

    // We deep clone the state to avoid side effects from failed batch
    let newState = JSON.parse(JSON.stringify(state));

    for (const input of inputs) {
        // TODO: check if nested transactionBatchInputs are allowed
        // ContractAssert(
        //     input.function !== "transactionBatch",
        //     "transactionBatch: Nested transactionBatch",
        // );

        const res = await handle(newState, { caller, input });

        if ("state" in res) {
            newState = res.state;
        }

        results.push(res.result);
    }

    state = { ...state, ...newState };
    // Object.assign(state, newState);

    return { state, result: { results } };
}
