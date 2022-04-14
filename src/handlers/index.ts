import * as io from "io-ts";

import {
    BalanceInputCodec,
    VaultBalanceInputCodec,
    TotalBalanceInputCodec,
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
import {
    LockInputCodec,
    UnlockInputCodec,
    IncreaseVaultInputCodec,
    TransferLockedInputCodec,
} from "@/handlers/vault";

export * from "@/handlers/readonlys";
export * from "@/handlers/approval";
export * from "@/handlers/transfer";
export * from "@/handlers/mint";
export * from "@/handlers/settings";
export * from "@/handlers/foreignInvoke";
export * from "@/handlers/transactionBatch";
export * from "@/handlers/vault";

/**
 * The codec for every Input except TransactionBatchInput. This is done because it is forbidden to
 * nest TransactionBatch calls.
 */
export const InputWOTxBatchCodec = io.union([
    NameInputCodec,
    TickerInputCodec,
    BalanceInputCodec,
    VaultBalanceInputCodec,
    TotalBalanceInputCodec,
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
    LockInputCodec,
    UnlockInputCodec,
    IncreaseVaultInputCodec,
    TransferLockedInputCodec,
    ForeignInvokeInputCodec,
]);
export type InputWOTxBatchCodec = io.TypeOf<typeof InputWOTxBatchCodec>;

// NOTE: `TransactionBatchInputCodec` is defined here instead of in `transactionBatch.ts` because
// of a bug with esbuild that makes it appear before the definition of `InputWOTxBatchCodec`.
// TODO: Post a Github issue on esbuild's repo
export const TransactionBatchInputCodec = io.type({
    function: io.literal("transactionBatch"),
    inputs: io.array(InputWOTxBatchCodec),
});

export const InputCodec = io.union([InputWOTxBatchCodec, TransactionBatchInputCodec]);
export type Input = io.TypeOf<typeof InputCodec>;

export type ReadonlysResult =
    | NameResult
    | TickerResult
    | BalanceResult
    | RoyaltiesResult
    | OwnerResult
    | IsApprovedForallResult;
