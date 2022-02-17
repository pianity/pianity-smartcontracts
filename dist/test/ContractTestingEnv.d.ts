import { ContractHandler } from "smartweave/lib/contract-step";
import { SmartWeaveGlobal } from "smartweave/lib/smartweave-global";
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
declare type ContractInteractionResult<T> = {
    type: "ok" | "error" | "exception";
    result: any;
    state: T;
};
declare enum ContractErrorKind {
    Error = "Error"
}
export declare class ContractError extends Error {
    kind: ContractErrorKind;
    actualError: unknown;
    constructor(actualError: unknown, kind?: ContractErrorKind, message?: string);
}
export default class ContractTestingEnv<STATE, INPUT> {
    private readonly contract;
    readonly srcPath: string;
    readonly initialState: STATE;
    readonly contractId: string;
    currentHeight: number;
    constructor(srcPath: string, // from the project's root.
    initialState: STATE, contractId?: string);
    /**
     * deploys new contract and returns its contractId
     */
    private deployContract;
    interact(caller: string, input: INPUT, block?: Block, forcedCurrentState?: STATE): Promise<ContractInteractionResult<STATE>>;
    clearState(): void;
    pushState(contractId: string, state: STATE): void;
    readState(): STATE;
    contractEnv(): ContractExecutionEnv;
    history(): STATE[];
    private currentState;
    private static mockActiveTx;
}
export {};
