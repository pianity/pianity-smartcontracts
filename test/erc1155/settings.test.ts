import { ContractError } from "?/ContractTestingEnv";
import test from "?/erc1155/context";
import { Input } from "@/handlers";

test("setting a field with an invalid type should throw", async (t) => {
    await t.throwsAsync(
        async () => {
            const { apiAddress, createContract } = t.context;
            const contract = createContract();

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

test("setting a field with a valid type should change the field", async (t) => {
    const { apiAddress, createContract } = t.context;
    const contract = createContract();

    const newFieldValue = !contract.readState().settings.allowFreeTransfer;

    await contract.interact(apiAddress, {
        function: "settings",
        settings: {
            allowFreeTransfer: newFieldValue,
        },
    } as unknown as Input);

    t.assert(contract.readState().settings.allowFreeTransfer === newFieldValue);
});

test("setting a new field should work", async (t) => {
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
