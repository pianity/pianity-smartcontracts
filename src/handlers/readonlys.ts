import { ERR_404TOKENID, ERR_NOTARGET, ERR_NOTOKENID, PST } from "@/consts";
import { ReadonlyResult, State } from "@/contractTypes";
import { BigNumber, ContractAssert } from "@/externals";

// TODO: impl io-ts here

export type TickerInput = {
    function: "ticker";
    tokenId?: string;
};

export function ticker(state: State, caller: string, input: TickerInput): ReadonlyResult {
    const tokenId = input.tokenId || PST;
    const ticker = tickerOf(state, tokenId);

    return { result: { ticker } };
}

export type BalanceInput = {
    function: "balance";
    target?: string;
    tokenId?: string;
};

export function balance(state: State, caller: string, input: BalanceInput): ReadonlyResult {
    const target = input.target || caller;
    const tokenId = input.tokenId || PST;

    const balance = balanceOf(state, tokenId, target);

    return { result: { target, balance } };
}

export type RoyaltiesInput = {
    function: "royalties";
    target: string;
    tokenId: string;
};

export function royalties(state: State, caller: string, input: RoyaltiesInput): ReadonlyResult {
    const { target, tokenId } = input;

    ContractAssert(tokenId, ERR_NOTOKENID);
    ContractAssert(target, ERR_NOTARGET);

    const royalties = royaltiesOf(state, tokenId, target);

    return { result: { royalties } };
}

export type OwnerInput = {
    function: "owner" | "owners";
    tokenId: string;
};

export function owner(state: State, caller: string, input: OwnerInput): ReadonlyResult {
    const { tokenId } = input;

    ContractAssert(tokenId, ERR_NOTOKENID);
    const owners = ownersOf(state, tokenId);
    return { result: { owners } };
}

export function balanceOf(state: State, tokenId: string, target: string): BigNumber {
    const token = state.tokens[tokenId];
    ContractAssert(token, "balanceOf: Token not found");
    return new BigNumber(token.balances[target] || 0);
}

function royaltiesOf(state: State, tokenId: string, target: string): number {
    const token = state.tokens[tokenId];
    ContractAssert(token, ERR_404TOKENID);
    return token.royalties?.[target] ?? 0;
}

function tickerOf(state: State, tokenId: string): string {
    const token = state.tokens[tokenId];
    ContractAssert(token, ERR_404TOKENID);
    const { ticker } = token;
    return ticker;
}

function ownersOf(state: State, tokenId: string): string[] {
    const token = state.tokens[tokenId];
    ContractAssert(token, ERR_404TOKENID);
    return Object.keys(token.balances);
}
