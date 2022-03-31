"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._log = exports.BigNumber = exports.ContractAssert = exports.ContractError = exports.SmartWeave = void 0;
const node_assert_1 = __importDefault(require("node:assert"));
const arweave_1 = __importDefault(require("arweave"));
const redstone_smartweave_1 = require("redstone-smartweave");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const arweave = arweave_1.default.init({});
exports.SmartWeave = new redstone_smartweave_1.SmartWeaveGlobal(arweave, { id: "", owner: "" });
exports.ContractError = Error;
exports.ContractAssert = node_assert_1.default;
class BigNumber extends bignumber_js_1.default {
}
exports.BigNumber = BigNumber;
// eslint-disable-next-line @typescript-eslint/no-empty-function
function _log(..._values) { }
exports._log = _log;
