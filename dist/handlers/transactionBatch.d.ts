import * as io from "io-ts";
import { ReadWriteResult, State } from "../contractTypes";
import { ReadonlysResult, TransactionBatchInputCodec } from "../handlers";
export declare type TransactionBatchInput = io.TypeOf<typeof TransactionBatchInputCodec>;
export declare type TransactionBatchResult = {
    results: Array<ReadonlysResult | TransactionBatchResult | undefined>;
};
export declare function transactionBatch(state: State, caller: string, input: TransactionBatchInput): Promise<ReadWriteResult<TransactionBatchResult>>;
