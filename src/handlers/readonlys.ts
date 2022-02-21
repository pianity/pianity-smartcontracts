import * as io from "io-ts";

import { ERR_404TOKENID, ERR_NOTARGET, ERR_NOTOKENID, PST } from "@/consts";
import { ReadResult, State } from "@/contractTypes";
import { BigNumber, ContractAssert } from "@/externals";
import { checkInput } from "@/utils";

export const NameInputCodec = io.type({ function: io.literal("name") });
export type NameInput = io.TypeOf<typeof NameInputCodec>;
export type NameResult = { name: "Pianity" };

export function name(state: State, caller: string, input: NameInput): ReadResult<NameResult> {
    checkInput(NameInputCodec, input);

    return { result: { name: "Pianity" } };
}

export const TickerInputCodec = io.intersection([
    io.type({
        function: io.literal("ticker"),
    }),
    io.partial({
        tokenId: io.string,
    }),
]);
export type TickerInput = io.TypeOf<typeof TickerInputCodec>;
export type TickerResult = { ticker: string };

export function ticker(state: State, caller: string, input: TickerInput): ReadResult<TickerResult> {
    const { tokenId } = checkInput(TickerInputCodec, input);

    const ticker = tickerOf(state, tokenId || PST);

    return { result: { ticker } };
}

export const BalanceInputCodec = io.intersection([
    io.type({
        function: io.literal("balance"),
    }),
    io.partial({
        target: io.string,
        tokenId: io.string,
    }),
]);
export type BalanceInput = io.TypeOf<typeof BalanceInputCodec>;
export type BalanceResult = { target: string; balance: string };

export function balance(
    state: State,
    caller: string,
    input: BalanceInput,
): ReadResult<BalanceResult> {
    const { target, tokenId } = checkInput(BalanceInputCodec, input);

    const effectiveTarget = target || caller;

    const balance = balanceOf(state, tokenId || PST, effectiveTarget);

    return { result: { target: effectiveTarget, balance: balance.toString() } };
}

export const RoyaltiesInputCodec = io.type({
    function: io.literal("royalties"),
    target: io.string,
    tokenId: io.string,
});
export type RoyaltiesInput = io.TypeOf<typeof RoyaltiesInputCodec>;
export type RoyaltiesResult = { royalties: number };

export function royalties(
    state: State,
    caller: string,
    input: RoyaltiesInput,
): ReadResult<RoyaltiesResult> {
    const { target, tokenId } = checkInput(RoyaltiesInputCodec, input);

    ContractAssert(tokenId, ERR_NOTOKENID);
    ContractAssert(target, ERR_NOTARGET);

    const royalties = royaltiesOf(state, tokenId, target);

    return { result: { royalties } };
}

export const OwnerInputCodec = io.type({
    function: io.union([io.literal("owner"), io.literal("owners")]),
    tokenId: io.string,
});
export type OwnerInput = io.TypeOf<typeof OwnerInputCodec>;
export type OwnerResult = { owners: string[] };

export function owner(state: State, caller: string, input: OwnerInput): ReadResult<OwnerResult> {
    const { tokenId } = checkInput(OwnerInputCodec, input);

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
