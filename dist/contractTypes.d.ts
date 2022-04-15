import * as io from "io-ts";
import { Input, ReadonlysResult } from "./handlers";
import { TransactionBatchResult } from "./handlers/transactionBatch";
export declare type Token = {
    ticker: string;
    owners?: string[];
    balances: Record<string, string>;
    royalties?: Record<string, number>;
    royaltyRate?: number;
};
/**
 * Props present in the initial state settings.
 *
 * This is separated from the SettingsCodec definition because it's also used in {@link settings}
 * to make the input codec, which requires a partial version of these props
 */
export declare const SettingsKnownProps: {
    allowFreeTransfer: io.BooleanC;
    paused: io.BooleanC;
    communityChest: io.StringC;
    contractOwners: io.ArrayC<io.StringC>;
    contractSuperOwners: io.ArrayC<io.StringC>;
    settingsOwnersPermissions: io.ArrayC<io.StringC>;
    foreignContracts: io.ArrayC<io.StringC>;
    lockMinLength: io.NumberC;
    lockMaxLength: io.NumberC;
};
export declare const SettingsCodec: io.IntersectionC<[io.TypeC<{
    allowFreeTransfer: io.BooleanC;
    paused: io.BooleanC;
    communityChest: io.StringC;
    contractOwners: io.ArrayC<io.StringC>;
    contractSuperOwners: io.ArrayC<io.StringC>;
    settingsOwnersPermissions: io.ArrayC<io.StringC>;
    foreignContracts: io.ArrayC<io.StringC>;
    lockMinLength: io.NumberC;
    lockMaxLength: io.NumberC;
}>, io.RecordC<io.StringC, io.UnknownC>]>;
export declare type Settings = io.TypeOf<typeof SettingsCodec>;
export declare type Vault = {
    tokenId: string;
    balance: string;
    start: number;
    end: number;
};
export declare type State = {
    name: string;
    nonce: number;
    settings: Settings;
    vaults: Record<string, Vault[]>;
    tokens: Record<string, Token>;
    operatorApprovals: Record<string, Record<string, boolean>>;
    invocations: string[];
};
export declare type ReadResult<T> = {
    result: T;
    state?: never;
};
export declare type WriteResult = {
    state: State;
    result?: never;
};
export declare type ReadWriteResult<T> = {
    state: State;
    result: T;
};
export declare type SmartcontractResult = (ReadResult<ReadonlysResult> | WriteResult) | ReadWriteResult<TransactionBatchResult>;
export declare type Action = {
    input: Input;
    caller: string;
};
