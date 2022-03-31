import { SmartWeaveGlobal } from "redstone-smartweave";
import BigNumberLib from "bignumber.js";
export declare const SmartWeave: SmartWeaveGlobal;
export declare const ContractError: ErrorConstructor;
export declare const ContractAssert: (cond: unknown, message?: string) => asserts cond;
export declare class BigNumber extends BigNumberLib {
}
export declare function _log(..._values: unknown[]): void;
