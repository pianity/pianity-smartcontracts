import { ERR_NOTARGET } from "@/consts";
import { ReadonlyResult, State, WriteResult } from "@/erc1155";
import { ContractAssert } from "@/externals";

export type IsApprovedForAllInput = {
    function: "isApprovedForAll";
    target: string;
    owner: string;
};

export type SetApprovalForAllInput = {
    function: "setApprovalForAll";
    target: string;
    approved: boolean;
};

export function isApprovedForAll(
    state: State,
    caller: string,
    input: IsApprovedForAllInput,
): ReadonlyResult<{ approved: boolean }> {
    const { target, owner } = input;

    ContractAssert(owner, "No owner specified");
    ContractAssert(target, ERR_NOTARGET);
    const approved = isApprovedForAllHelper(state, owner, target);

    return { result: { approved } };
}

export function setApprovalForAll(
    state: State,
    caller: string,
    input: SetApprovalForAllInput,
): WriteResult {
    const { approved } = input;
    const { target } = input;

    ContractAssert(target, ERR_NOTARGET);
    ContractAssert(typeof approved !== "undefined", "No approved parameter specified");
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
