// Code cloned and edited as needed from https://github.com/redstone-finance/redstone-smartweave-contracts/

import { readFileSync } from "node:fs";

import Arweave from "arweave-testing";
import { createContractExecutionEnvironment } from "smartweave/lib/contract-load";
import { ContractHandler, execute } from "smartweave/lib/contract-step";
import { SmartWeaveGlobal } from "smartweave/lib/smartweave-global";
import { InteractionTx } from "smartweave/lib/interaction-tx";
import { LogFn } from "ava";
import { ReadonlysResult } from "@/handlers";

export type ContractExecutionEnv = {
    handler: ContractHandler;
    swGlobal: SmartWeaveGlobal;
};

export type Block = {
    height: number;
    timestamp: number;
};

export type Contract<STATE> = {
    src: string;
    txId: string;
    initialState: STATE;
};

type InteractionResult<T> = {
    type: "ok" | "error" | "exception";
    result: ReadonlysResult;
    txId: string;
    state: T;
};

export class InteractionError extends Error {
    actualError: unknown;

    constructor(actualError: unknown, message = "") {
        super(message);
        this.name = "InteractionError";
        this.actualError = actualError;
        Error.captureStackTrace(this, InteractionError);
    }
}

// TODO: All the function that could throw should throw a specific custom error maybe
export default class ContractTestingEnv<STATE, INPUT> {
    private readonly contract: {
        env: ContractExecutionEnv;
        states: STATE[];
    };

    readonly srcPath: string;

    readonly initialState: STATE;

    readonly contractId: string;

    currentHeight: number;

    constructor(
        srcPath: string, // from the project's root.
        initialState: STATE,
        avaContextLog: LogFn,
        contractId = `TEST-${srcPath}`,
    ) {
        this.srcPath = srcPath;
        this.contractId = contractId;
        this.initialState = initialState;

        this.contract = this.deployContract(avaContextLog);

        this.currentHeight = 0;
    }

    // deploy(contract: Contract<STATE>): string {
    //     return this.deployContract(contract.src, contract.initialState, contract.txId);
    // }

    /**
     * deploys new contract and returns its contractId
     */
    private deployContract(avaContextLog: LogFn) {
        if (this.srcPath === undefined || this.srcPath.length === 0) {
            throw new Error("srcPath is required.");
        }

        // const result = require("esbuild").buildSync({
        //     entryPoints: [`${process.cwd()}/${srcPath}`],
        //     minify: false,
        //     bundle: true,
        //     format: "iife",
        //     write: false,
        // });

        const src = readFileSync(this.srcPath).toString();
        const env: ContractExecutionEnv = createContractExecutionEnvironment(
            Arweave.init({}),
            src,
            this.contractId,
            "",
            avaContextLog,
        );

        env.swGlobal.contracts.readContractState = () => {
            return JSON.parse(JSON.stringify(this.currentState()));
        };

        return {
            env,
            states: [this.initialState],
        };
    }

    async interact(
        caller: string,
        input: INPUT,
        block?: Block,
        forcedCurrentState?: STATE,
    ): Promise<InteractionResult<STATE>> {
        try {
            // NOTE: no need to copy state here, as it is copied by execute method:
            // https://github.com/ArweaveTeam/SmartWeave/blob/788a974e66494ef2ab8f876024e72bf363d4c4a4/src/contract-step.ts#L56
            const currentState = forcedCurrentState || this.currentState();

            const prevActiveTx = this.contract.env.swGlobal._activeTx;
            const newTx = ContractTestingEnv.mockActiveTx(
                block || { height: this.currentHeight, timestamp: Date.now() / 1000 },
            );
            this.contract.env.swGlobal._activeTx = newTx;

            const res = await execute(
                this.contract.env.handler,
                {
                    input,
                    caller,
                },
                currentState,
            );

            if (res.type === "error" || res.type === "exception") {
                throw Error(res.result);
            }

            this.pushState(this.contractId, res.state || currentState);
            this.contract.env.swGlobal._activeTx = prevActiveTx;
            this.currentHeight += 1;

            return { ...res, txId: newTx.id };
        } catch (e) {
            throw new InteractionError(e);
        }
    }

    clearState() {
        this.contract.states = [];
    }

    pushState(contractId: string, state: STATE) {
        this.contract.states.push(state);
    }

    readState(): STATE {
        return this.currentState();
    }

    contractEnv() {
        return this.contract.env;
    }

    history() {
        return this.contract.states;
    }

    private currentState(): STATE {
        const statesLength = this.contract.states.length;
        return this.contract.states[statesLength - 1];
    }

    private static mockActiveTx(mockBlock: Block): InteractionTx {
        return {
            id: `TX-ID-${mockBlock.height}`,
            owner: {
                address: "tx.owner.address",
            },
            recipient: "tx.recipient",
            tags: {},
            fee: {
                winston: "444",
            },
            quantity: {
                winston: "333",
            },
            block: {
                height: mockBlock.height,
                id: `BLOCK-${Date.now()}`,
                timestamp: mockBlock.timestamp,
            },
        };
    }
}
