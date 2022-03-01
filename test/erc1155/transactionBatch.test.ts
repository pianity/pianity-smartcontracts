import { InteractionError } from "?/ContractTestingEnv";
import test from "?/erc1155/context";
import * as m from "?/erc1155/mocks";

import { Input } from "@/handlers";

test("mint 3 different nfts", async (t) => {
    const { owner, createContract } = t.context;
    const contract = createContract(t);

    await contract.interact(owner, {
        function: "transactionBatch",
        inputs: [
            { function: "mint", ...m.LEGENDARY_MINT },
            { function: "mint", ...m.EPIC_MINT },
            { function: "mint", ...m.RARE_MINT },
        ],
    });

    t.pass();
});

test("throws: nest transactionBatch calls", async (t) => {
    const { owner, createContract } = t.context;
    const contract = createContract(t);

    await t.throwsAsync(
        contract.interact(owner, {
            function: "transactionBatch",
            inputs: [
                {
                    function: "transactionBatch",
                    inputs: [{ function: "mint", ...m.LEGENDARY_MINT }],
                },
            ],
        } as unknown as Input),
        { instanceOf: InteractionError },
    );
});
