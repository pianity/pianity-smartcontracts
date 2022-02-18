import anyTest, { TestFn } from "ava";

import Arweave from "arweave";

import ContractTestingEnv from "?/ContractTestingEnv";
import { State } from "@/contractTypes";
import { Input } from "@/handlers";

type Context = {
    arweave: Arweave;
    caller: string;

    initialState: State;
    contractSrcPath: string;

    apiAddress: string;
    superOwnerAddress: string;
    communityChestAddress: string;

    createContract: () => ContractTestingEnv<State, Input>;
};

const test = anyTest as TestFn<Context>;

export default test;

test.before((t) => {
    const contractSrcPath = "build/erc1155.js";

    const arweave = Arweave.init({});
    const caller = "50duQsQV5iMo6JNNJ4oVgVPmT2IPosO55pB7edWphB8";
    const apiAddress = "w2YJFs6-lNr3WhL--wTKzYuzfJzAH09CUEc3BzPuLbc";
    const superOwnerAddress = "6EJsy9WLXRMRRBOds-psdVm9o0O0f_idx3g0cEUGkz8";
    const communityChestAddress = "rvcqUue4SjrmTSrICnChjmyWgsQvYmL5FZKT0XNtWwM";

    const initialState: State = {
        name: "Pianity",
        nonce: 1,
        settings: {
            contractOwners: [apiAddress],
            contractSuperOwners: [superOwnerAddress],
            communityChest: communityChestAddress,
            foreignContracts: [],
            allowFreeTransfer: false,
            paused: false,
        },
        tokens: {
            PTY: {
                ticker: "PTY",
                balances: {
                    [superOwnerAddress]: "900000000000000",
                    [apiAddress]: "100000000000000",
                },
                primaryRate: 0.15,
                secondaryRate: 0.1,
                royaltyRate: 0.1,
            },
        },
        operatorApprovals: {},
        invocations: [],
    };

    const createContract = () => {
        return new ContractTestingEnv<State, Input>(contractSrcPath, initialState);
    };

    t.context = {
        arweave,
        caller,
        contractSrcPath,
        initialState,
        apiAddress,
        superOwnerAddress,
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
