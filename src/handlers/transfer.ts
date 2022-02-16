import * as io from "io-ts";

import { ERR_INTEGER, PST, UNIT } from "@/consts";
import { State, Token, WriteResult } from "@/contractTypes";
import { BigNumber, ContractAssert } from "@/externals";
import { isApprovedForAllHelper, isApprovedOrOwner } from "@/handlers/approval";
import { checkInput } from "@/utils";
import { balanceOf } from "@/handlers/readonlys";

export const TransferInputCodec = io.intersection([
    io.type({
        function: io.literal("transfer"),
        target: io.string,
    }),
    io.partial({
        from: io.string,
        tokenId: io.string,
        qty: io.string,
        no: io.number,
        price: io.string,
    }),
]);
export type TransferInput = io.TypeOf<typeof TransferInputCodec>;

export function transfer(state: State, caller: string, input: TransferInput): WriteResult {
    const {
        target,
        qty,
        no,
        price,
        from = caller,
        tokenId = PST,
    } = checkInput(TransferInputCodec, input);

    const token = state.tokens[tokenId];

    ContractAssert(from !== target, "transfer: `from` cannot be equal to `target`");
    ContractAssert(token, "transfer: `tokenId` doesn't exist");
    ContractAssert(
        !token.owners || (no && !qty),
        "transfer: `no` must be set and `qty` unset for NFTs",
    );
    ContractAssert(
        token.owners || (!no && qty),
        "transfer: `qty` must be set and `no` unset for tokens",
    );
    ContractAssert(
        isApprovedOrOwner(state, caller, from),
        "transfer: Sender is not approved nor the owner of the token",
    );

    if (token.royalties) {
        const { contractOwners } = state.settings;

        ContractAssert(
            state.settings.allowFreeTransfer || contractOwners.includes(caller),
            "transfer: Free transfers are not allowed",
        );
        ContractAssert(
            !price || isApprovedForAllHelper(state, caller, target),
            "transfer: Receiver is not approved",
        );

        removeTokenFrom(state, target, PST, new BigNumber(price || 0));
        pay(state, token, from, new BigNumber(price || 0));
    }

    removeTokenFrom(state, from, tokenId, new BigNumber(qty || 1), no);
    addTokenTo(state, target, tokenId, new BigNumber(qty || 1), no);

    return { state };
}

export const TransferBatchInputCodec = io.intersection([
    io.type({
        function: io.literal("transferBatch"),
        targets: io.array(io.string),
        froms: io.array(io.string),
        tokenIds: io.array(io.string),
    }),
    io.partial({
        qtys: io.array(io.string),
        prices: io.array(io.string),
        nos: io.array(io.number),
    }),
]);
export type TransferBatchInput = io.TypeOf<typeof TransferBatchInputCodec>;

export function transferBatch(
    state: State,
    caller: string,
    input: TransferBatchInput,
): WriteResult {
    const { targets, froms, tokenIds, qtys, prices, nos } = checkInput(
        TransferBatchInputCodec,
        input,
    );

    ContractAssert(
        tokenIds.length === froms.length,
        "transferBatch: `tokenIds` and `froms` length mismatch",
    );
    ContractAssert(
        tokenIds.length === targets.length,
        "transferBatch: `tokenIds` and `targets` length mismatch",
    );
    ContractAssert(qtys || nos, "transferBatch: At least one of `qtys` or `nos` must be set");
    ContractAssert(
        !qtys || tokenIds.length === qtys.length,
        "transferBatch: `tokenIds` and `qtys` length mismatch",
    );
    ContractAssert(
        !nos || tokenIds.length === nos.length,
        "transferBatch: `tokenIds` and `nos` length mismatch",
    );

    for (const i in tokenIds) {
        const from = typeof froms[i] === "undefined" ? caller : froms[i];
        const no = nos ? nos[i] : undefined;
        const qty = qtys ? qtys[i] : undefined;
        const price = prices ? prices[i] : undefined;

        ContractAssert(targets[i], `transferBatch: No target found for \`tokenIds[${i}]\``);
        transfer(state, caller, {
            function: "transfer",
            from,
            target: targets[i],
            tokenId: tokenIds[i],
            qty,
            no,
            price,
        });
    }

    return { state };
}

export const TransferRoyaltiesInputCodec = io.type({
    function: io.literal("transferRoyalties"),
    target: io.string,
    tokenId: io.string,
    qty: io.number,
});
export type TransferRoyaltiesInput = io.TypeOf<typeof TransferRoyaltiesInputCodec>;

export function transferRoyalties(
    state: State,
    caller: string,
    input: TransferRoyaltiesInput,
): WriteResult {
    const { target, tokenId, qty } = checkInput(TransferRoyaltiesInputCodec, input);
    const token = state.tokens[tokenId];

    ContractAssert(
        target !== caller,
        "transferRoyalties: `target` must be different from the caller",
    );
    ContractAssert(qty > 0, "transferRoyalties: `qty` must be positive");
    ContractAssert(token, "transferRoyalties: `tokenId` doesn't exist");
    ContractAssert(token.royalties, "transferRoyalties: Royalties are not set for this token");

    removeRoyaltiesFrom(token, caller, qty);
    addRoyaltiesTo(token, target, qty);

    checkRoyalties(token.royalties);

    return { state };
}

export function addTokenTo(
    state: State,
    target: string,
    tokenId: string,
    qty: BigNumber,
    no?: number,
) {
    ContractAssert(qty.isInteger(), "addTokenTo: `qty` must be an integer");
    ContractAssert(qty.gte(0), "addTokenTo: `qty` must be positive");

    if (qty.eq(0)) return;

    const token = state.tokens[tokenId];
    ContractAssert(token, "addTokenTo: `tokenId` does not exist");

    if (!(target in token.balances)) {
        token.balances[target] = "0";
    }
    token.balances[target] = new BigNumber(token.balances[target]).plus(qty).toString();

    if (token.owners && no) {
        ContractAssert(Number.isInteger(no), "addTokenTo: `no` must be an integer");
        ContractAssert(no > 0, "Invalid value for no. Must be strictly positive");
        ContractAssert(qty.eq(1), "Amount must be 1 for NFTs");
        ContractAssert(token.owners[no - 1] === "", "Token no. is already attributed");
        token.owners[no - 1] = target;
    }
}

function removeTokenFrom(state: State, from: string, tokenId: string, qty: BigNumber, no?: number) {
    const fromBalance = balanceOf(state, tokenId, from);

    ContractAssert(fromBalance.gt(0), "removeTokenFrom: Sender does not own the token");
    ContractAssert(qty.gte(0), "removeTokenFrom: Invalid value for qty. Must be positive");
    ContractAssert(fromBalance.gte(qty), "removeTokenFrom: Insufficient balance");

    if (qty.eq(0)) {
        return;
    }

    const token = state.tokens[tokenId];
    const newBalance = new BigNumber(token.balances[from]).minus(qty).toString();

    if (token.owners) {
        ContractAssert(no, "removeTokenFrom: No no. specified");
        ContractAssert(Number.isInteger(no), ERR_INTEGER);
        ContractAssert(no > 0, "removeTokenFrom: Invalid value for no. Must be strictly positive");
        ContractAssert(qty.eq(1), "removeTokenFrom: Amount must be 1 for NFTs");
        ContractAssert(
            token.owners[no - 1] === from,
            "removeTokenFrom: Token no. is not owned by caller",
        );
        token.owners[no - 1] = "";
    }

    if (newBalance === "0") {
        delete token.balances[from];
    } else {
        token.balances[from] = newBalance;
    }
}

function pay(state: State, token: Token, from: string, price: BigNumber) {
    ContractAssert(token.royalties, "pay: Token doesn't have any fees");
    ContractAssert(price.isInteger(), ERR_INTEGER);
    ContractAssert(price.gte(0), "pay: `price` must be positive");
    ContractAssert(price.mod(1_000_000).eq(0), "pay: `price` must be a multiple of 1_000_000");

    if (price.eq(0)) {
        return;
    }

    if (from.length === 0) {
        // primary sales
        addTokenTo(
            state,
            state.settings.communityChest,
            PST,
            price.multipliedBy(token.primaryRate),
        );
        for (const [target, split] of Object.entries(token.royalties)) {
            addTokenTo(
                state,
                target,
                PST,
                price.multipliedBy((1 - token.primaryRate) * split).dividedBy(UNIT),
            );
        }
    } else {
        // secondary sales
        const netValue = price.multipliedBy(1 - token.secondaryRate - token.royaltyRate);
        addTokenTo(state, from, PST, netValue);
        addTokenTo(
            state,
            state.settings.communityChest,
            PST,
            price.multipliedBy(token.secondaryRate),
        );
        for (const [target, split] of Object.entries(token.royalties)) {
            addTokenTo(
                state,
                target,
                PST,
                price.multipliedBy(token.royaltyRate * split).dividedBy(UNIT),
            );
        }
    }
}

export function checkRoyalties(royalties: Record<string, number>) {
    const sum = Object.values(royalties).reduce((acc, val) => {
        ContractAssert(Number.isInteger(val), `checkRoyalties: Royalties must be integers`);
        ContractAssert(val > 0, "checkRoyalties: Royalties must be strictly positive");
        return acc + val;
    }, 0);
    ContractAssert(
        sum === UNIT,
        `checkRoyalties: Sum of royalties shares must be ${UNIT}; was ${sum}`,
    );
}

function addRoyaltiesTo(token: Token, target: string, qty: number) {
    ContractAssert(token.royalties, "addRoyaltiesTo: Token doesn't have any royalties");
    if (!(target in token.royalties)) {
        token.royalties[target] = 0;
    }
    token.royalties[target] += qty;
}

function removeRoyaltiesFrom(token: Token, from: string, qty: number) {
    ContractAssert(token.royalties, "removeRoyaltiesFrom: Token doesn't have any royalties");
    ContractAssert(Number.isInteger(qty), "removeRoyaltiesFrom: Royalties must be integers");

    const fromRoyalties = token.royalties[from] || 0;
    ContractAssert(fromRoyalties > 0, "Sender does not own royalties on the token");
    ContractAssert(fromRoyalties >= qty, "Insufficient royalties' balance");

    const newBalance = token.royalties[from] - qty;

    if (newBalance === 0) {
        delete token.royalties[from];
    } else {
        token.royalties[from] = newBalance;
    }
}
