import { ERR_NOTARGET } from "@/consts";
import { handle } from "@/erc1155";
import { Action, SmartcontractResult, State } from "@/contractTypes";
import { ContractAssert, Smartweave } from "@/externals";
import { Input } from "@/handlers";

export type ForeignInvokeInput = {
    function: "foreignInvoke";
    target: string;
    invocationId: string;
};

export async function foreignInvoke(
    state: State,
    caller: string,
    input: ForeignInvokeInput,
): Promise<SmartcontractResult> {
    const { contractOwners } = state.settings;
    const { target, invocationId } = input;

    ContractAssert(contractOwners.includes(caller), "Caller is not authorized to foreignInvoke");
    ContractAssert(target, ERR_NOTARGET);
    ContractAssert(typeof invocationId !== "undefined", "No invocationId specified");
    ContractAssert(state.settings.foreignContracts, "No foreignContracts specified");
    ContractAssert(state.settings.foreignContracts.includes(target), "Invalid auction contract");

    const foreignState = await Smartweave.contracts.readContractState(target);
    ContractAssert(foreignState.foreignCalls, "Contract is missing support for foreign calls");

    const invocation = foreignState.foreignCalls[invocationId];
    ContractAssert(invocation, `Incorrect invocationId: invocation not found (${invocationId})`);
    ContractAssert(
        !state.invocations.includes(target + invocationId),
        `Invocation already exists (${invocation})`,
    );
    state.invocations.push(target + invocationId);

    const foreignAction: Action<Input> = {
        input: invocation,
        caller,
    };

    return await handle(state, foreignAction);
}
