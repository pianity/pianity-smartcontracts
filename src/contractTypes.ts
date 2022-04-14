import * as io from "io-ts";

import { Input, ReadonlysResult } from "@/handlers";
import { TransactionBatchResult } from "@/handlers/transactionBatch";
import { CT } from "@/consts";

export type Token = {
    ticker: string;
    owners?: string[]; // Ordered list of NFTs' owners
    balances: Record<string, string>; // owner -> balance
    royalties?: Record<string, number>;
    royaltyRate?: number;
};

/**
 * Props present in the initial state settings.
 *
 * This is separated from the SettingsCodec definition because it's also used in {@link settings}
 * to make the input codec, which requires a partial version of these props
 */
export const SettingsKnownProps = {
    allowFreeTransfer: io.boolean,
    paused: io.boolean,

    communityChest: io.string,

    contractOwners: io.array(io.string),
    contractSuperOwners: io.array(io.string),
    settingsOwnersPermissions: io.array(io.string),

    foreignContracts: io.array(io.string),

    lockMinLength: io.number,
    lockMaxLength: io.number,
};

export const SettingsCodec = io.intersection([
    io.type(SettingsKnownProps),
    io.record(io.string, io.unknown),
]);
export type Settings = io.TypeOf<typeof SettingsCodec>;

export type Vault = {
    tokenId: string;
    balance: string;
    start: number;
    end: number;
};

export type State = {
    name: string;
    nonce: number;
    settings: Settings;

    vaults: Record<string, Vault[]>;
    tokens: Record<string, Token>; // token ID -> Token
    operatorApprovals: Record<string, Record<string, boolean>>; // owner -> approved operators...

    invocations: string[];
};

export type ReadResult<T> = { result: T; state?: never };
export type WriteResult = { state: State; result?: never };
export type ReadWriteResult<T> = { state: State; result: T };
export type SmartcontractResult =
    | (ReadResult<ReadonlysResult> | WriteResult)
    | ReadWriteResult<TransactionBatchResult>;

export type Action = {
    input: Input;
    caller: string;
};
