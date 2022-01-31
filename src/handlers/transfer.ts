import {
    ERR_404TOKENID,
    ERR_INTEGER,
    ERR_INVALID,
    ERR_NOFROM,
    ERR_NOQTY,
    ERR_NOROYALTIES,
    ERR_NOTARGET,
    ERR_NOTOKENID,
    PST,
    UNITY,
} from "@/consts";
import { State, Token, WriteResult } from "@/erc1155";
import { ContractAssert } from "@/externals";
import { isApprovedForAllHelper, isApprovedOrOwner } from "@/handlers/approval";

export type TransferInput = {
    function: "transfer";
    from?: string;
    target: string;
    tokenId?: string;
    qty?: number;
    no?: number;
    price?: number;
};

export type TransferBatchInput = {
    function: "transferBatch";
    targets: string[];
    froms: string[];
    tokenIds: string[];
    qtys?: number[];
    prices?: number[];
    nos?: number[];
};

export type TransferRoyaltiesInput = {
    function: "transferRoyalties";
    target: string;
    tokenId: string;
    qty: number;
};

export function transfer(
    state: State,
    caller: string,
    { target, qty, no, price, from = caller, tokenId = PST }: TransferInput,
): WriteResult {
    ContractAssert(target, ERR_NOTARGET);
    ContractAssert(from !== target, ERR_INVALID);
    const token = state.tokens[tokenId];
    ContractAssert(token, ERR_404TOKENID);
    ContractAssert(!token.owners || (no && !qty), "no. must be set and qty unset for NFTs");
    ContractAssert(token.owners || (!no && qty), "qty must be set and no unset for tokens");
    ContractAssert(
        isApprovedOrOwner(state, caller, from),
        "Sender is not approved nor the owner of the token",
    );

    if (token.royalties) {
        const { contractOwners } = state.settings;
        ContractAssert(
            state.settings.allowFreeTransfer || contractOwners.includes(caller),
            "Free transfers not allowed",
        );
        ContractAssert(
            !price || isApprovedForAllHelper(state, caller, target),
            "Receiver is not approved",
        );
        removeTokenFrom(state, target, PST, price || 0);
        pay(state, token, from, price || 0);
    }

    removeTokenFrom(state, from, tokenId, qty || 1, no);
    addTokenTo(state, target, tokenId, qty || 1, no);

    return { state };
}

export function transferBatch(
    state: State,
    caller: string,
    { targets, froms, tokenIds, qtys, prices, nos }: TransferBatchInput,
): WriteResult {
    ContractAssert(froms, ERR_NOFROM);
    ContractAssert(tokenIds, ERR_NOTOKENID);
    ContractAssert(targets, ERR_NOTARGET);
    ContractAssert(tokenIds.length === froms.length, "tokenIds and froms length mismatch");
    ContractAssert(tokenIds.length === targets.length, "tokenIds and targets length mismatch");
    ContractAssert(qtys || nos, "At least one of qtys or nos must be set");
    ContractAssert(!qtys || tokenIds.length === qtys.length, "tokenIds and qtys length mismatch");
    ContractAssert(!nos || tokenIds.length === nos.length, "tokenIds and qtys length mismatch");

    for (const i in tokenIds) {
        const from = typeof froms[i] === "undefined" ? caller : froms[i];
        const no = nos ? nos[i] : undefined;
        const qty = qtys ? qtys[i] : undefined;
        const price = prices ? prices[i] : undefined;

        ContractAssert(targets[i], ERR_NOTARGET);
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

export function transferRoyalties(
    state: State,
    caller: string,
    input: TransferRoyaltiesInput,
): WriteResult {
    const { target, tokenId, qty } = input;

    ContractAssert(target, ERR_NOTARGET);
    ContractAssert(qty, ERR_NOQTY);
    ContractAssert(target !== caller, "Target must be different from the caller");
    ContractAssert(tokenId, ERR_NOTOKENID);
    ContractAssert(qty > 0, "Invalid value for qty. Must be positive");

    const token = state.tokens[tokenId];
    ContractAssert(token, "tokenId does not exist");
    ContractAssert(token.royalties, "Royalties are not set for this token");

    removeRoyaltiesFrom(token, caller, qty);
    addRoyaltiesTo(token, target, qty);

    checkRoyalties(token.royalties);

    return { state };
}

export function addTokenTo(
    state: State,
    target: string,
    tokenId: string,
    qty: number,
    no?: number,
) {
    ContractAssert(Number.isInteger(qty), ERR_INTEGER);
    ContractAssert(qty >= 0, "Invalid value for qty. Must be positive");
    if (qty === 0) return;

    const token = state.tokens[tokenId];
    ContractAssert(token, "tokenId does not exist");

    if (!(target in token.balances)) {
        token.balances[target] = 0;
    }
    token.balances[target] += qty;

    if (token.owners && no) {
        ContractAssert(Number.isInteger(no), ERR_INTEGER);
        ContractAssert(no > 0, "Invalid value for no. Must be strictly positive");
        ContractAssert(qty === 1, "Amount must be 1 for NFTs");
        ContractAssert(token.owners[no - 1] === "", "Token no. is already attributed");
        token.owners[no - 1] = target;
    }
}

function removeTokenFrom(state: State, from: string, tokenId: string, qty: number, no?: number) {
    const fromBalance = balanceOf(state, tokenId, from);

    ContractAssert(fromBalance > 0, "Sender does not own the token");
    ContractAssert(qty >= 0, "Invalid value for qty. Must be positive");
    ContractAssert(fromBalance >= qty, "Insufficient balance");
    if (qty === 0) return;

    const token = state.tokens[tokenId];
    const newBalance = token.balances[from] - qty;

    if (token.owners) {
        ContractAssert(no, "No no. specified");
        ContractAssert(Number.isInteger(no), ERR_INTEGER);
        ContractAssert(no > 0, "Invalid value for no. M(ust be strictly positive");
        ContractAssert(qty === 1, "Amount must be 1 for NFTs");
        ContractAssert(token.owners[no - 1] === from, "Token no. is not owned by caller");
        token.owners[no - 1] = "";
    }

    if (newBalance === 0) {
        delete token.balances[from];
    } else {
        token.balances[from] = newBalance;
    }
}

function pay(state: State, token: Token, from: string, price: number) {
    ContractAssert(token.royalties, ERR_NOROYALTIES);
    ContractAssert(Number.isInteger(price), ERR_INTEGER);
    ContractAssert(price >= 0, "Invalid value for price. Must be positive");
    if (price === 0) {
        return;
    }

    if (from.length === 0) {
        // primary sales
        addTokenTo(state, state.settings.communityChest, PST, price * state.settings.primaryRate);
        for (const [target, split] of Object.entries(token.royalties)) {
            addTokenTo(
                state,
                target,
                PST,
                (price * (1 - state.settings.primaryRate) * split) / UNITY,
            );
        }
    } else {
        // secondary sales
        const netValue = price * (1 - state.settings.secondaryRate - state.settings.royaltyRate);
        addTokenTo(state, from, PST, netValue);
        addTokenTo(state, state.settings.communityChest, PST, price * state.settings.secondaryRate);
        for (const [target, split] of Object.entries(token.royalties)) {
            addTokenTo(state, target, PST, (price * state.settings.royaltyRate * split) / UNITY);
        }
    }
}

export function balanceOf(state: State, tokenId: string, target: string): number {
    const token = state.tokens[tokenId];
    ContractAssert(token, ERR_404TOKENID);
    return token.balances[target] ?? 0;
}

export function checkRoyalties(royalties: Record<string, number>) {
    const sum = Object.values(royalties).reduce((acc, val) => {
        ContractAssert(Number.isInteger(val), `${ERR_INTEGER} {royalties}`);
        ContractAssert(val > 0, "Royalties must be strictly positive");
        return acc + val;
    }, 0);
    ContractAssert(sum === UNITY, `Sum of royalties shares must be ${UNITY}`);
}

function addRoyaltiesTo(token: Token, target: string, qty: number) {
    ContractAssert(token.royalties, ERR_NOROYALTIES);
    if (!(target in token.royalties)) {
        token.royalties[target] = 0;
    }
    token.royalties[target] += qty;
}

function removeRoyaltiesFrom(token: Token, from: string, qty: number) {
    ContractAssert(token.royalties, ERR_NOROYALTIES);
    ContractAssert(Number.isInteger(qty), `${ERR_INTEGER} {royalties}`);

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
