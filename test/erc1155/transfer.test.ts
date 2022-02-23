import BigNumber from "bignumber.js";

import { InteractionError } from "?/ContractTestingEnv";
import test from "?/erc1155/context";
import * as m from "?/erc1155/mocks";

import { TransferInput } from "@/handlers";

test("transfer 1 pty", async (t) => {
    const { owner: apiAddress, createContract } = t.context;
    const contract = createContract(t);

    await contract.interact(apiAddress, {
        function: "transfer",
        target: m.USER1,
        qty: "1",
    });

    const balance = contract.readState().tokens.PTY.balances[m.USER1];

    t.assert(balance === "1");
});

test("wrongly typed input field should throw", async (t) => {
    const { owner: apiAddress, createContract } = t.context;
    const contract = createContract(t);

    await t.throwsAsync(
        contract.interact(apiAddress, {
            function: "transfer",
            target: m.USER1,
            qty: "1",
            no: "wrong type",
        } as unknown as TransferInput),
        { instanceOf: InteractionError },
    );
});

// test("royalties", async (t) => {
//     const { apiAddress } = t.context;
//     const contract = t.context.createContract();
//
//     const randomUser = await generateAddress();
//
//     await contract.interact(apiAddress, {
//         function: "transfer",
//         target: randomUser,
//         qty: 1,
//     });
//
//     await contract.interact(apiAddress, {
//         function: "royalties",
//     });
//
//     t.assert(contract.readState().tokens.PTY.balances[randomUser] === 1);
// });
