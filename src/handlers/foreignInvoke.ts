import * as io from "io-ts";

import { ERR_NOTARGET } from "@/consts";
import { handle } from "@/erc1155";
import { Action, SmartcontractResult, State } from "@/contractTypes";
import { ContractAssert, SmartWeave } from "@/externals";
import { checkInput } from "@/utils";

export const ForeignInvokeInputCodec = io.type({
    function: io.literal("foreignInvoke"),
    target: io.string,
    invocationId: io.string,
});
export type ForeignInvokeInput = io.TypeOf<typeof ForeignInvokeInputCodec>;

export async function foreignInvoke(
    state: State,
    caller: string,
    input: ForeignInvokeInput,
): Promise<SmartcontractResult> {
    const { target, invocationId } = checkInput(ForeignInvokeInputCodec, input);
    const { contractOwners } = state.settings;

    ContractAssert(contractOwners.includes(caller), "Caller is not authorized to foreignInvoke");
    ContractAssert(target, ERR_NOTARGET);
    ContractAssert(typeof invocationId !== "undefined", "No invocationId specified");
    ContractAssert(state.settings.foreignContracts, "No foreignContracts specified");
    ContractAssert(state.settings.foreignContracts.includes(target), "Invalid auction contract");

    const foreignState = await SmartWeave.contracts.readContractState(target);
    ContractAssert(foreignState.foreignCalls, "Contract is missing support for foreign calls");

    const invocation = foreignState.foreignCalls[invocationId];
    ContractAssert(invocation, `Incorrect invocationId: invocation not found (${invocationId})`);
    ContractAssert(
        !state.invocations.includes(target + invocationId),
        `Invocation already exists (${invocation})`,
    );
    state.invocations.push(target + invocationId);

    const foreignAction: Action = {
        input: invocation,
        caller,
    };

    return await handle(state, foreignAction);
}
