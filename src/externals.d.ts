import { SmartWeaveGlobal } from "redstone-smartweave";
import BigNumberLib from "bignumber.js";

declare const SmartWeave: SmartWeaveGlobal;
declare const ContractError: ErrorConstructor;
declare const ContractAssert: (cond: unknown, message?: string) => asserts cond;
declare class BigNumber extends BigNumberLib {}
