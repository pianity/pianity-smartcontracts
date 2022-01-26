import test from "?/erc1155/context";

test("settings with invalid fields types should throws", async (t) => {
    await t.throwsAsync(async () => {
        const { testEnv, apiAddress, contractId } = t.context;

        await testEnv.interact<any>(apiAddress, contractId, {
            function: "settings",
            settings: {
                allowFreeTransfer: "wrong value",
            },
        });
    });
});
