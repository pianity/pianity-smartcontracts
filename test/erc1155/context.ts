/* eslint-disable prefer-arrow-callback, func-names */
import anyTest, { TestFn } from "ava";

import Arweave from "arweave";

import ContractsTestingEnv from "?/ContractsTestingEnv";
import { generateAddress } from "?/utils";
import { State } from "@/erc1155";

type Context = {
    arweave: Arweave;
    caller: string;

    initialState: State;
    contractSrcPath: string;

    apiAddress: string;
    superOwnerAddress: string;
    communityChestAddress: string;

    testEnv: ContractsTestingEnv<State>;
    contractId: string;
};

const test = anyTest as TestFn<Context>;

export default test;

test.before(async (t) => {
    const contractSrcPath = "build/erc1155.js";

    const arweave = Arweave.init({});
    const caller = await generateAddress();
    const apiAddress = await generateAddress();
    const superOwnerAddress = await generateAddress();
    const communityChestAddress = await generateAddress();

    const initialState: State = {
        name: "Pianity",
        nonce: 1,
        settings: {
            contractOwners: [apiAddress],
            contractSuperOwners: [superOwnerAddress],
            communityChest: communityChestAddress,
            foreignContracts: [],
            allowFreeTransfer: false,
            primaryRate: 0.15,
            secondaryRate: 0.1,
            royaltyRate: 0.1,
            paused: false,
        },
        tokens: {
            PTY: {
                ticker: "PTY",
                balances: {
                    [superOwnerAddress]: 900000000000000,
                    [apiAddress]: 100000000000000,
                },
            },
        },
        operatorApprovals: {},
        invocations: [],
    };

    const testEnv = new ContractsTestingEnv<State>();
    const contractId = testEnv.deployContract(contractSrcPath, initialState);

    t.context = {
        arweave,
        caller,
        contractSrcPath,
        initialState,
        apiAddress,
        superOwnerAddress,
        communityChestAddress,
        testEnv,
        contractId,
    };
});

test.beforeEach((t) => {
    const { testEnv, contractSrcPath, initialState } = t.context;
    t.context.contractId = testEnv.deployContract(contractSrcPath, initialState);
});

test.afterEach((t) => {
    t.context.testEnv.clearContracts();
});
