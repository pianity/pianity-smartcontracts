import anyTest, { ExecutionContext, TestFn } from "ava";

import Arweave from "arweave";

import ContractTestingEnv from "?/ContractTestingEnv";
import { State } from "@/contractTypes";
import { Input } from "@/handlers";

type Context = {
    arweave: Arweave;
    caller: string;

    initialState: State;
    contractSrcPath: string;

    owner: string;
    superOwner: string;
    communityChestAddress: string;

    createContract: (t: ExecutionContext<Context>) => ContractTestingEnv<State, Input>;
};

const test = anyTest as TestFn<Context>;

export default test;

test.before((t) => {
    const contractSrcPath = "build/erc1155.js";

    const arweave = Arweave.init({});
    const caller = "50duQsQV5iMo6JNNJ4oVgVPmT2IPosO55pB7edWphB8";
    const owner = "w2YJFs6-lNr3WhL--wTKzYuzfJzAH09CUEc3BzPuLbc";
    const superOwner = "6EJsy9WLXRMRRBOds-psdVm9o0O0f_idx3g0cEUGkz8";
    const communityChestAddress = "rvcqUue4SjrmTSrICnChjmyWgsQvYmL5FZKT0XNtWwM";

    const initialState: State = {
        name: "Pianity",
        nonce: 1,
        settings: {
            contractOwners: [owner],
            contractSuperOwners: [superOwner],
            settingsOwnersPermissions: ["allowFreeTransfer", "paused"],
            communityChest: communityChestAddress,
            foreignContracts: [],
            allowFreeTransfer: false,
            paused: false,
        },
        tokens: {
            PTY: {
                ticker: "PTY",
                balances: {
                    [superOwner]: "900000000000000",
                    [owner]: "100000000000000",
                },
                royaltyRate: 0.1,
            },
        },
        operatorApprovals: {},
        invocations: [],
    };

    const createContract = (t: ExecutionContext<Context>) => {
        return new ContractTestingEnv<State, Input>(contractSrcPath, initialState, t.log);
    };

    t.context = {
        arweave,
        caller,
        contractSrcPath,
        initialState,
        owner,
        superOwner,
        communityChestAddress,
        createContract,
    };
});

// test.afterEach.always((t) => {
//     t.context.contract = t.context.createContract();
//     console.log("NEW CONTRACT: ", t.context.contract.id);
// });

// test.beforeEach((t) => {
//     const { srcPath, initialState } = t.context.contract;
//     t.context.contract = new ContractTestingEnv<State, Input>(srcPath, initialState);
// });
