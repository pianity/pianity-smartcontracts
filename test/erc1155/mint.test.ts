import { ContractError } from "?/ContractTestingEnv";
import test from "?/erc1155/context";
import * as m from "?/erc1155/mocks";

import { UNIT } from "@/consts";
import { TransferInput } from "@/handlers";

test("mint an nft", async (t) => {
    const { apiAddress, createContract } = t.context;
    const contract = createContract();

    await contract.interact(apiAddress, {
        function: "mint",
        no: 100,
        royalties: { [m.USER1]: 123, [m.USER2]: UNIT - 123 },
        primaryRate: 0.15,
        secondaryRate: 0.1,
        royaltyRate: 0.1,
    });

    t.pass();
});

test("mint nft with 4 owners", async (t) => {
    const { apiAddress, createContract } = t.context;
    const contract = createContract();

    await contract.interact(apiAddress, {
        function: "mint",
        no: 100,
        royalties: {
            [m.USER1]: UNIT / 4,
            [m.USER2]: UNIT / 4,
            [m.USER3]: UNIT / 4,
            [m.USER4]: UNIT / 4,
        },
        primaryRate: 0.15,
        secondaryRate: 0.1,
        royaltyRate: 0.1,
    });

    t.pass();
});

test("mintBatch", async (t) => {
    const { apiAddress, createContract } = t.context;
    const contract = createContract();

    await contract.interact(apiAddress, {
        function: "mintBatch",
        mints: [m.UNIQUE_MINT, m.EPIC_MINT],
    });

    t.pass();
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
