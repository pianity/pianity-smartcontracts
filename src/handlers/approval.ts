import * as io from "io-ts";

import { ERR_NOTARGET } from "@/consts";
import { ReadResult, State, WriteResult } from "@/contractTypes";
import { ContractAssert } from "@/externals";
import { checkInput } from "@/utils";

export const IsApprovedForAllInputCodec = io.type({
    function: io.literal("isApprovedForAll"),
    target: io.string,
    owner: io.string,
});
export type IsApprovedForAllInput = io.TypeOf<typeof IsApprovedForAllInputCodec>;
export type IsApprovedForallResult = { approved: boolean };

export function isApprovedForAll(
    state: State,
    caller: string,
    input: IsApprovedForAllInput,
): ReadResult<IsApprovedForallResult> {
    const { target, owner } = checkInput(IsApprovedForAllInputCodec, input);

    const approved = isApprovedForAllHelper(state, owner, target);

    return { result: { approved } };
}

export const SetApprovalForAllInputCodec = io.type({
    function: io.literal("setApprovalForAll"),
    target: io.string,
    approved: io.boolean,
});
export type SetApprovalForAllInput = io.TypeOf<typeof SetApprovalForAllInputCodec>;

export function setApprovalForAll(
    state: State,
    caller: string,
    input: SetApprovalForAllInput,
): WriteResult {
    const { approved, target } = checkInput(SetApprovalForAllInputCodec, input);

    ContractAssert(target !== caller, "Target must be different from the caller");

    if (!(caller in state.operatorApprovals)) {
        state.operatorApprovals[caller] = {};
    }

    state.operatorApprovals[caller][target] = approved;

    return { state };
}

// TODO: Find a better name (isApprovedForAll is already taken by the handler)
// Is caller allowed to move owners tokens?
export function isApprovedForAllHelper(state: State, caller: string, target: string): boolean {
    if (target.length === 0 && state.settings.contractOwners.includes(caller)) {
        return true;
    }
    if (!(target in state.operatorApprovals)) return false;
    if (!(caller in state.operatorApprovals[target])) return false;
    return state.operatorApprovals[target][caller];
}

export function isApprovedOrOwner(state: State, caller: string, target: string): boolean {
    if (caller === target) {
        return true;
    }

    return isApprovedForAllHelper(state, caller, target);
}
