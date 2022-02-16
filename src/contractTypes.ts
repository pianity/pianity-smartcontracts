import * as io from "io-ts";

export type Token = {
    ticker: string;
    owners?: string[]; // Ordered list of NFTs' owners
    balances: Record<string, string>; // owner -> balance
    royalties?: Record<string, number>;
    primaryRate: number;
    secondaryRate: number;
    royaltyRate: number;
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
    foreignContracts: io.array(io.string),
};

export const SettingsCodec = io.intersection([
    io.type(SettingsKnownProps),
    io.record(io.string, io.unknown),
]);
export type Settings = io.TypeOf<typeof SettingsCodec>;

export type State = {
    name: string;
    nonce: number;
    settings: Settings;

    tokens: Record<string, Token>; // token ID -> Token
    operatorApprovals: Record<string, Record<string, boolean>>; // owner -> approved operators...
    invocations: string[];
};

export type ReadonlyResult<T = unknown> = { result: T; state?: never };
export type WriteResult = { state: State; result?: never };
export type SmartcontractResult = ReadonlyResult | WriteResult;

export type Action<T> = {
    input: T;
    caller: string;
};
