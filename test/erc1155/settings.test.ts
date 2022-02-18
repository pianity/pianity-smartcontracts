import { ContractError } from "?/ContractTestingEnv";
import test from "?/erc1155/context";

import { Input } from "@/handlers";

test("throws: setting a field with an invalid type", async (t) => {
    const { apiAddress, createContract } = t.context;
    const contract = createContract();

    await t.throwsAsync(
        async () => {
            await contract.interact(apiAddress, {
                function: "settings",
                settings: {
                    allowFreeTransfer: "wrong value",
                },
            } as unknown as Input);
        },
        { instanceOf: ContractError },
    );
});

test("changes the field: setting a field with a valid type", async (t) => {
    const { apiAddress, createContract } = t.context;
    const contract = createContract();

    const newFieldValue = !contract.readState().settings.allowFreeTransfer;

    await contract.interact(apiAddress, {
        function: "settings",
        settings: {
            allowFreeTransfer: newFieldValue,
        },
    });

    t.assert(contract.readState().settings.allowFreeTransfer === newFieldValue);
});

test("set a new field", async (t) => {
    const { apiAddress, createContract } = t.context;
    const contract = createContract();

    const nonExistentField = Math.random().toString();

    await contract.interact(apiAddress, {
        function: "settings",
        settings: {
            [nonExistentField]: true,
        },
    });

    t.assert(contract.readState().settings[nonExistentField] === true);
});
