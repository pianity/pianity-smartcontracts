import test from "?/erc1155/context";

test("transfer 1 pty", async (t) => {
    await t.notThrowsAsync(async () => {
        const { testEnv, apiAddress, contractId } = t.context;

        await testEnv.interact<any>(apiAddress, contractId, {
            function: "transfer",
            settings: {
                allowFreeTransfer: "wrong value",
            },
        });
    });
});
