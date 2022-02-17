import { TestFn } from "ava";
import Arweave from "arweave";
import ContractTestingEnv from "../ContractTestingEnv";
import { State } from "../../src/contractTypes";
import { Input } from "../../src/handlers";
declare type Context = {
    arweave: Arweave;
    caller: string;
    initialState: State;
    contractSrcPath: string;
    apiAddress: string;
    superOwnerAddress: string;
    communityChestAddress: string;
    createContract: () => ContractTestingEnv<State, Input>;
};
declare const test: TestFn<Context>;
export default test;
