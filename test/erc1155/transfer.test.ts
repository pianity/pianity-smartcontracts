import BigNumber from "bignumber.js";

import { InteractionError } from "?/ContractTestingEnv";
import test from "?/erc1155/context";
import * as m from "?/erc1155/mocks";
import { divideShare } from "?/utils";

import { TransferInput } from "@/handlers";
import { UNIT } from "@/consts";

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

test("mint nft with royalties and transfer", async (t) => {
    const { superOwner, owner, createContract } = t.context;
    const contract = createContract(t);

    const shares = divideShare(7);

    await contract.interact(owner, {
        function: "transfer",
        target: m.USER6,
        qty: "500e10",
    });

    await contract.interact(m.USER6, {
        function: "setApprovalForAll",
        target: owner,
        approved: true,
    });

    const { txId: tokenId } = await contract.interact(owner, {
        function: "mint",
        no: 100,
        royalties: {
            [m.USER1]: shares[0],
            [m.USER2]: shares[1],
            [m.USER3]: shares[2],
            [m.USER4]: shares[3],
            [m.USER5]: shares[4],
            [m.USER6]: shares[5],
            [m.USER7]: shares[6],
        },
        royaltyRate: 0.1,
    });

    const price = new BigNumber("100e6");

    await contract.interact(owner, {
        function: "transfer",
        from: "",
        target: m.USER6,
        tokenId,
        no: 1,
        price: price.toString(),
    });

    const user1PredictedBalance = price.times(shares[0]).div(UNIT).toString();
    const user1Balance = contract.readState().tokens.PTY.balances[m.USER1];
    t.assert(user1Balance === user1PredictedBalance);

    const user7PredictedBalance = price.times(shares[6]).div(UNIT).toString();
    const user7Balance = contract.readState().tokens.PTY.balances[m.USER7];
    t.assert(user7Balance === user7PredictedBalance);

    t.pass();
});
