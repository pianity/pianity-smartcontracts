import { SmartWeaveGlobal } from "redstone-smartweave";

declare const Smartweave: SmartWeaveGlobal;
declare const ContractError: ErrorConstructor;
declare const ContractAssert: (cond: unknown, message?: string) => asserts cond;
