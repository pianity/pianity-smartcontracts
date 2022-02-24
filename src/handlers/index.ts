import * as io from "io-ts";

import {
    BalanceInputCodec,
    BalanceResult,
    NameInputCodec,
    NameResult,
    OwnerInputCodec,
    OwnerResult,
    RoyaltiesInputCodec,
    RoyaltiesResult,
    TickerInputCodec,
    TickerResult,
} from "@/handlers/readonlys";
import {
    IsApprovedForAllInputCodec,
    IsApprovedForallResult,
    SetApprovalForAllInputCodec,
} from "@/handlers/approval";
import {
    TransferBatchInputCodec,
    TransferInputCodec,
    TransferRoyaltiesInputCodec,
} from "@/handlers/transfer";
import { BurnInputCodec, MintBatchInputCodec, MintInputCodec } from "@/handlers/mint";
import { SettingsInputCodec } from "@/handlers/settings";
import { ForeignInvokeInputCodec } from "@/handlers/foreignInvoke";
import { TransactionBatchInputCodec } from "@/handlers/transactionBatch";

export * from "@/handlers/readonlys";
export * from "@/handlers/approval";
export * from "@/handlers/transfer";
export * from "@/handlers/mint";
export * from "@/handlers/settings";
export * from "@/handlers/foreignInvoke";
export * from "@/handlers/transactionBatch";

/**
 * The codec for every Input except TransactionBatchInput. This is done because it is forbidden to
 * nest TransactionBatch calls.
 */
export const InputWOTxBatchCodec = io.union([
    NameInputCodec,
    TickerInputCodec,
    BalanceInputCodec,
    RoyaltiesInputCodec,
    OwnerInputCodec,
    IsApprovedForAllInputCodec,
    SetApprovalForAllInputCodec,
    TransferInputCodec,
    TransferBatchInputCodec,
    TransferRoyaltiesInputCodec,
    MintInputCodec,
    MintBatchInputCodec,
    BurnInputCodec,
    SettingsInputCodec,
    ForeignInvokeInputCodec,
]);
export type InputWOTxBatchCodec = io.TypeOf<typeof InputWOTxBatchCodec>;

export const InputCodec = io.union([InputWOTxBatchCodec, TransactionBatchInputCodec]);
export type Input = io.TypeOf<typeof InputCodec>;

export type ReadonlysResult =
    | NameResult
    | TickerResult
    | BalanceResult
    | RoyaltiesResult
    | OwnerResult
    | IsApprovedForallResult;
