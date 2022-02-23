import assert from "node:assert";

import Arweave from "arweave";
import { SmartWeaveGlobal } from "redstone-smartweave";
import BigNumberLib from "bignumber.js";

const arweave = Arweave.init({});

export const SmartWeave: SmartWeaveGlobal = new SmartWeaveGlobal(arweave, { id: "a", owner: "a" });
export const ContractError = Error;
export const ContractAssert: (cond: unknown, message?: string) => asserts cond = assert;
export class BigNumber extends BigNumberLib {}
// eslint-disable-next-line @typescript-eslint/no-empty-function
export function _log(..._values: unknown[]) {}
