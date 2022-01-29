import { ContractError } from "?/ContractTestingEnv";
import test from "?/erc1155/context";
import { Input } from "@/erc1155";

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
    await t.throwsAsync(
        async () => {
            const { apiAddress, createContract } = t.context;
            const contract = createContract();

            await contract.interact(apiAddress, {
                function: "settings",
                settings: {
                    allowFreeTransfer: true,
                },
            } as unknown as Input);

            // TODO: check the updated field
        },
        { instanceOf: ContractError },
    );
});
