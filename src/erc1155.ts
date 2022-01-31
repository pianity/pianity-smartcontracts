import { ContractAssert, ContractError } from "@/externals";
import { exhaustive } from "@/utils";

import * as handlers from "@/handlers";

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

export type Action = {
    input: handlers.Input;
    caller: string;
};

export async function handle(state: State, action: Action): Promise<SmartcontractResult> {
    const { paused, contractSuperOwners } = state.settings;
    const { input, caller } = action;

    switch (input.function) {
        case "name":
            return { result: { name: "Pianity" } };

        case "ticker":
            return handlers.ticker(state, caller, input);

        case "balance":
            return handlers.balance(state, caller, input);

        case "royalties":
            return handlers.royalties(state, caller, input);

        case "owner":
        case "owners":
            return handlers.owner(state, caller, input);

        case "isApprovedForAll":
            return handlers.isApprovedForAll(state, caller, input);

        default:
            break;
    }

    ContractAssert(
        !paused || contractSuperOwners.includes(caller),
        "The contract must not be paused",
    );

    switch (input.function) {
        case "setApprovalForAll":
            return handlers.setApprovalForAll(state, caller, input);

        case "transfer":
            return handlers.transfer(state, caller, input);

        case "transferBatch":
            return handlers.transferBatch(state, caller, input);

        case "transferRoyalties":
            return handlers.transferRoyalties(state, caller, input);

        case "foreignInvoke":
            return handlers.foreignInvoke(state, caller, input);

        case "mint":
            return handlers.mint(state, caller, input);

        case "settings":
            return handlers.settings(state, caller, input);

        default:
            exhaustive(input);
            throw new ContractError(
                `No function supplied or function not recognised: "${(input as any)?.function}".`,
            );
    }
}
