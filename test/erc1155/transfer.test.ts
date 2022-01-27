import test from "?/erc1155/context";
import { generateAddress } from "?/utils";

test("transfer 1 pty", async (t) => {
    await t.notThrowsAsync(async () => {
        const { testEnv, apiAddress, contractId } = t.context;

        const randomUser = await generateAddress();

        await testEnv.interact(apiAddress, contractId, {
            function: "transfer",
            target: randomUser,
            qty: 1,
        });

        t.assert(testEnv.readState(contractId).tokens.PTY.balances[randomUser] === 1);
    });
});
