import BigNumber from "bignumber.js";
import { InteractionError } from "?/ContractTestingEnv";
import test from "?/erc1155/context";
import * as m from "?/erc1155/mocks";
import { divideShare } from "?/utils";
import { Input } from "@/handlers";

test("mint nft with 5 owners", async (t) => {
    const { owner: apiAddress, createContract } = t.context;
    const contract = createContract(t);

    const shares = divideShare(2);

    await contract.interact(apiAddress, {
        function: "mint",
        no: 100,
        royalties: {
            [m.USER1]: shares[0],
            [m.USER2]: shares[1],
        },
        royaltyRate: 0.1,
    });

    t.pass();
});

test("mintBatch", async (t) => {
    const { owner: apiAddress, createContract } = t.context;
    const contract = createContract(t);

    await contract.interact(apiAddress, {
        function: "mintBatch",
        mints: [m.UNIQUE_MINT, m.EPIC_MINT],
    });

    t.pass();
});

test("mintBatch with invalid mints", async (t) => {
    const { owner: apiAddress, createContract } = t.context;
    const contract = createContract(t);

    await t.throwsAsync(
        contract.interact(apiAddress, {
            function: "mintBatch",
            mints: [m.UNIQUE_MINT, m.EPIC_MINT, m.UNIQUE_MINT],
        }),
        {
            instanceOf: InteractionError,
        },
    );

    t.pass();
});

test("throws: buggy mint", async (t) => {
    const { owner: apiAddress, createContract } = t.context;
    const contract = createContract(t);

    // mint with 0 shares
    await t.throwsAsync(
        contract.interact(apiAddress, {
            function: "mint",
            no: 100,
            royalties: {
                [m.USER1]: 0,
                [m.USER2]: 0,
            },
            royaltyRate: 0.1,
        }),
        {
            instanceOf: InteractionError,
        },
    );
});

test("throws: mint missing royalties or royaltyRate", async (t) => {
    const { owner: apiAddress, createContract } = t.context;
    const contract = createContract(t);

    const shares = divideShare(2);

    await t.throwsAsync(
        contract.interact(apiAddress, {
            function: "mint",
            no: 100,
            royalties: {
                [m.USER1]: shares[0],
                [m.USER2]: shares[1],
            },
        }),
        { instanceOf: InteractionError },
    );

    await t.throwsAsync(
        contract.interact(apiAddress, {
            function: "mint",
            no: 100,
            royaltyRate: 0.1,
        }),
        { instanceOf: InteractionError },
    );
});

test("throws: null as royalty", async (t) => {
    const { owner: apiAddress, createContract } = t.context;
    const contract = createContract(t);

    const shares = divideShare(3);

    await t.throwsAsync(
        contract.interact(apiAddress, {
            function: "mint",
            no: 100,
            royaltyRate: 0.1,
            royalties: {
                [m.USER1]: shares[0],
                [m.USER2]: shares[1],
                [m.USER3]: null,
            },
        } as unknown as Input),
        { instanceOf: InteractionError },
    );
});
