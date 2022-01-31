// Code cloned and edited as needed from https://github.com/redstone-finance/redstone-smartweave-contracts/

import { readFileSync } from "node:fs";

import Arweave from "arweave";
import { createContractExecutionEnvironment } from "smartweave/lib/contract-load";
import { ContractHandler, ContractInteractionResult, execute } from "smartweave/lib/contract-step";
import { SmartWeaveGlobal } from "smartweave/lib/smartweave-global";
import { InteractionTx } from "smartweave/lib/interaction-tx";

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

enum ContractErrorKind {
    Error = "Error",
}

export class ContractError extends Error {
    kind: ContractErrorKind;

    actualError: unknown;

    constructor(actualError: unknown, kind = ContractErrorKind.Error, message = "") {
        super(`${kind}: ${message}`);
        this.name = "ContractError";
        this.kind = kind;
        this.actualError = actualError;
        Error.captureStackTrace(this, ContractError);
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

    // TODO: Is this useful?
    // constructor() {
    //     // this.pushState = this.pushState.bind(this);
    //     // this.currentState = this.currentState.bind(this);
    //     // this.clearContracts = this.clearContracts.bind(this);
    //     // this.readState = this.readState.bind(this);
    //     // this.history = this.history.bind(this);
    // }

    constructor(
        srcPath: string, // from the project's root.
        initialState: STATE,
        contractId = `TEST-${srcPath}`,
    ) {
        console.log("NEW CONTRACT", Math.random());

        this.srcPath = srcPath;
        this.contractId = contractId;
        this.initialState = initialState;

        this.contract = this.deployContract();
    }

    // deploy(contract: Contract<STATE>): string {
    //     return this.deployContract(contract.src, contract.initialState, contract.txId);
    // }

    /**
     * deploys new contract and returns its contractId
     */
    private deployContract() {
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
    ): Promise<ContractInteractionResult> {
        try {
            // note: no need to copy state here, as it is copied by execute method:
            // https://github.com/ArweaveTeam/SmartWeave/blob/788a974e66494ef2ab8f876024e72bf363d4c4a4/src/contract-step.ts#L56
            const currentState = forcedCurrentState || this.currentState();

            const prevActiveTx = this.contract.env.swGlobal._activeTx;
            this.contract.env.swGlobal._activeTx = ContractTestingEnv.mockActiveTx(
                block || { height: 1000, timestamp: 5555 },
            );

            const res: ContractInteractionResult = await execute(
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

            return res;
        } catch (e) {
            throw new ContractError(e);
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