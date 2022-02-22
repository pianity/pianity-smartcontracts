import { ContractError } from "?/ContractTestingEnv";
import test from "?/erc1155/context";
import * as m from "?/erc1155/mocks";

import { UNIT } from "@/consts";
import { TransferInput } from "@/handlers";

function divideShare(count: number): number[] {
    const shareInt = Math.floor(UNIT / count);
    const shares = Array(count).fill(shareInt);
    shares[shares.length - 1] = UNIT - shareInt * (count - 1);

    return shares;
}

test("mint nft with 5 owners", async (t) => {
    const { apiAddress, createContract } = t.context;
    const contract = createContract();

    const shares = divideShare(2);

    await contract.interact(apiAddress, {
        function: "mint",
        no: 100,
        royalties: {
            [m.USER1]: shares[0],
            [m.USER2]: shares[1],
        },
        primaryRate: 0.15,
        secondaryRate: 0.1,
        royaltyRate: 0.1,
    });

    t.pass();
});

test("mint nft with 5 owners and transfer", async (t) => {
    const { apiAddress, createContract } = t.context;
    const contract = createContract();

    const shares = divideShare(5);

    const { txId: tokenId } = await contract.interact(apiAddress, {
        function: "mint",
        no: 100,
        royalties: {
            [m.USER1]: shares[0],
            [m.USER2]: shares[1],
            [m.USER3]: shares[2],
            [m.USER4]: shares[3],
            [m.USER5]: shares[4],
        },
        primaryRate: 0.15,
        secondaryRate: 0.1,
        royaltyRate: 0.1,
    });

    // await contract.interact(apiAddress, {
    //     function: "transfer",
    //     target: m.USER6,
    //     tokenId:
    // });

    // await contract.inte

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
