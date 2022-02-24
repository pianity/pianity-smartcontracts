import { InteractionError } from "?/ContractTestingEnv";
import test from "?/erc1155/context";
import * as m from "?/erc1155/mocks";

import { Input } from "@/handlers";

test("test transactionBatch", async (t) => {
    const { superOwner, createContract } = t.context;
    const contract = createContract(t);

    contract.interact(superOwner, {
        function: "transactionBatch",
        inputs: [
            { function: "mint", ...m.LEGENDARY_MINT },
            { function: "mint", ...m.EPIC_MINT },
            { function: "mint", ...m.RARE_MINT },
        ],
    });
});
