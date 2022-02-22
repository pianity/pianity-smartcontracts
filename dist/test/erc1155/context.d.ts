import { TestFn } from "ava";
import Arweave from "arweave";
import ContractTestingEnv from "?/ContractTestingEnv";
import { State } from "@/contractTypes";
import { Input } from "@/handlers";
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
