import { ContractAssert, ContractError } from "@/externals";
import { exhaustive } from "@/utils";
import { Action, SmartcontractResult, State } from "@/contractTypes";
import * as handlers from "@/handlers";

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

        case "burn":
            return handlers.burn(state, caller, input);

        default:
            exhaustive(input);
            throw new ContractError(
                `No function supplied or function not recognised: "${input.function}".`,
            );
    }
}
