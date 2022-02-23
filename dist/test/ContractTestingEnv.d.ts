import { ContractHandler } from "smartweave/lib/contract-step";
import { SmartWeaveGlobal } from "smartweave/lib/smartweave-global";
import { LogFn } from "ava";
import { ReadonlysResult } from "@/handlers";
export declare type ContractExecutionEnv = {
    handler: ContractHandler;
    swGlobal: SmartWeaveGlobal;
};
export declare type Block = {
    height: number;
    timestamp: number;
};
export declare type Contract<STATE> = {
    src: string;
    txId: string;
    initialState: STATE;
};
declare type InteractionResult<T> = {
    type: "ok" | "error" | "exception";
    result: ReadonlysResult;
    txId: string;
    state: T;
};
export declare class InteractionError extends Error {
    actualError: unknown;
    constructor(actualError: unknown, message?: string);
}
export default class ContractTestingEnv<STATE, INPUT> {
    private readonly contract;
    readonly srcPath: string;
    readonly initialState: STATE;
    readonly contractId: string;
    currentHeight: number;
    constructor(srcPath: string, // from the project's root.
    initialState: STATE, log: LogFn, contractId?: string);
    /**
     * deploys new contract and returns its contractId
     */
    private deployContract;
    interact(caller: string, input: INPUT, block?: Block, forcedCurrentState?: STATE): Promise<InteractionResult<STATE>>;
    clearState(): void;
    pushState(contractId: string, state: STATE): void;
    readState(): STATE;
    contractEnv(): ContractExecutionEnv;
    history(): STATE[];
    private currentState;
    private static mockActiveTx;
}
export {};
