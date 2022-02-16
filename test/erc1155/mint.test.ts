import { ContractError } from "?/ContractTestingEnv";
import test from "?/erc1155/context";
import { generateAddress } from "?/utils";
import { UNIT } from "@/consts";
import { TransferInput } from "@/handlers";

test("mint an NFT", async (t) => {
    const { apiAddress } = t.context;
    const contract = t.context.createContract();

    const user1 = await generateAddress();
    const user2 = await generateAddress();

    await contract.interact(apiAddress, {
        function: "mint",
        no: 100,
        royalties: { [user1]: 123, [user2]: UNIT - 123 },
        primaryRate: 0.15,
        secondaryRate: 0.1,
        royaltyRate: 0.1,
    });

    t.pass();
});

test("mint nft with 4 owners", async (t) => {
    const { apiAddress } = t.context;
    const contract = t.context.createContract();

    const user1 = await generateAddress();
    const user2 = await generateAddress();
    const user3 = await generateAddress();
    const user4 = await generateAddress();

    await contract.interact(apiAddress, {
        function: "mint",
        no: 100,
        royalties: {
            [user1]: UNIT / 4,
            [user2]: UNIT / 4,
            [user3]: UNIT / 4,
            [user4]: UNIT / 4,
        },
        primaryRate: 0.15,
        secondaryRate: 0.1,
        royaltyRate: 0.1,
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
