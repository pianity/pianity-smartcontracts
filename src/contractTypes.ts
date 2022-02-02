import { Input } from "@/handlers";

export type Token = {
    ticker: string;
    owners?: string[]; // Ordered list of NFTs' owners
    balances: Record<string, number>; // owner -> balance
    royalties?: Record<string, number>;
};

export type Settings = {
    primaryRate: number;
    secondaryRate: number;
    royaltyRate: number;

    allowFreeTransfer: boolean;
    paused: boolean;

    communityChest: string;

    contractOwners: string[];
    contractSuperOwners: string[];
    foreignContracts: string[];
};

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
