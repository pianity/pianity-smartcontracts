import * as io from "io-ts";

import { State, WriteResult } from "@/contractTypes";
import { BigNumber, ContractAssert, SmartWeave, _log } from "@/externals";
import { checkInput } from "@/utils";
import { addTokenTo, removeTokenFrom } from "@/handlers/transfer";

export const LockInputCodec = io.type({
    function: io.literal("lock"),
    tokenId: io.string,
    qty: io.string,
    lockLength: io.number,
});
export type LockInput = io.TypeOf<typeof LockInputCodec>;

export function lock(state: State, caller: string, input: LockInput): WriteResult {
    const { qty: rawQty, lockLength, tokenId } = checkInput(LockInputCodec, input);

    lockToken(state, tokenId, caller, caller, rawQty, lockLength);

    return { state };
}

export const UnlockInputCodec = io.type({
    function: io.literal("unlock"),
});
export type UnlockInput = io.TypeOf<typeof UnlockInputCodec>;

export function unlock(state: State, caller: string, input: UnlockInput): WriteResult {
    checkInput(UnlockInputCodec, input);

    const vault = state.vaults[caller];

    for (let i = vault.length - 1; i >= 0; i--) {
        const vaultItem = vault[i];

        if (SmartWeave.block.height < vaultItem.end) {
            continue;
        }

        addTokenTo(state, caller, vaultItem.tokenId, new BigNumber(vaultItem.balance));

        vault.pop();
    }

    return { state };
}

export const IncreaseVaultInputCodec = io.type({
    function: io.literal("increaseVault"),
    id: io.number,
    lockLength: io.number,
});
export type IncreaseVaultInput = io.TypeOf<typeof IncreaseVaultInputCodec>;

export function increaseVault(
    state: State,
    caller: string,
    input: IncreaseVaultInput,
): WriteResult {
    const { id, lockLength } = checkInput(IncreaseVaultInputCodec, input);
    const { lockMinLength, lockMaxLength } = state.settings;
    const vault = state.vaults[caller];

    ContractAssert(
        Number.isInteger(lockLength) && lockLength > lockMinLength && lockLength < lockMaxLength,
        `transferLocked: lockLength is out of range. lockLength must be between ${lockMinLength} - ${lockMaxLength}.`,
    );
    ContractAssert(vault && vault[id], "increaseVault: `caller` doesn't have a vault with `id`");

    const vaultItem = vault[id];

    ContractAssert(
        SmartWeave.block.height < vaultItem.end,
        "increaseVault: vault has already ended",
    );

    vaultItem.end = SmartWeave.block.height + lockLength;

    return { state };
}

export const TransferLockedInputCodec = io.type({
    function: io.literal("transferLocked"),
    target: io.string,
    tokenId: io.string,
    qty: io.string,
    lockLength: io.number,
});
export type TransferLockedInput = io.TypeOf<typeof TransferLockedInputCodec>;

export function transferLocked(
    state: State,
    caller: string,
    input: TransferLockedInput,
): WriteResult {
    const {
        target,
        tokenId,
        lockLength = 0,
        qty: rawQty,
    } = checkInput(TransferLockedInputCodec, input);

    lockToken(state, tokenId, caller, target, rawQty, lockLength);

    return { state };
}

function lockToken(
    state: State,
    tokenId: string,
    from: string,
    target: string,
    rawQty: string,
    lockLength: number,
) {
    const { lockMinLength, lockMaxLength } = state.settings;
    const token = state.tokens[tokenId];

    const qty = new BigNumber(rawQty);

    ContractAssert(!token.owners, "lockToken: `tokenId` must not be an NFT");
    ContractAssert(qty.isInteger() && qty.gte(0), "lockToken: `qty` must be a positive integer.");
    ContractAssert(
        Number.isInteger(lockLength) && lockLength > lockMinLength && lockLength < lockMaxLength,
        `lockToken: lockLength is out of range. lockLength must be between ${lockMinLength} - ${lockMaxLength}.`,
    );
    ContractAssert(token, "transferLocked: tokenId doesn't exist");

    removeTokenFrom(state, from, tokenId, qty);

    const start = SmartWeave.block.height;

    const end = start + lockLength;

    if (!state.vaults[target]) {
        state.vaults[target] = [];
    }

    state.vaults[target].push({
        tokenId,
        balance: qty.toString(),
        end,
        start,
    });
}
