import test from "?/erc1155/context";
import { generateAddress } from "?/utils";

test("transfer 1 pty", async (t) => {
    const { apiAddress } = t.context;
    const contract = t.context.createContract();

    const randomUser = await generateAddress();

    await contract.interact(apiAddress, {
        function: "transfer",
        target: randomUser,
        qty: 1,
    });

    t.assert(contract.readState().tokens.PTY.balances[randomUser] === 1);
});
