import { ExecutionContext, TestFn } from "ava";
import Arweave from "arweave";
import ContractTestingEnv from "?/ContractTestingEnv";
import { State } from "@/contractTypes";
import { Input } from "@/handlers";
declare type Context = {
    arweave: Arweave;
    caller: string;
    initialState: State;
    contractSrcPath: string;
    owner: string;
    superOwner: string;
    communityChestAddress: string;
    createContract: (t: ExecutionContext<Context>) => ContractTestingEnv<State, Input>;
};
declare const test: TestFn<Context>;
export default test;
