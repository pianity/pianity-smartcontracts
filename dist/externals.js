"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._log = exports.BigNumber = exports.ContractAssert = exports.ContractError = exports.SmartWeave = void 0;
const node_assert_1 = __importDefault(require("node:assert"));
const arweave_1 = __importDefault(require("arweave"));
const warp_contracts_1 = require("warp-contracts");
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const arweave = arweave_1.default.init({});
exports.SmartWeave = new warp_contracts_1.SmartWeaveGlobal(arweave, { id: "", owner: "" }, {
    ignoreExceptions: false,
    waitForConfirmation: false,
    updateCacheForEachInteraction: false,
    internalWrites: false,
    maxCallDepth: 2,
    maxInteractionEvaluationTimeSeconds: 120,
    stackTrace: {
        saveState: false,
    },
    bundlerUrl: "",
    gasLimit: 1,
    useFastCopy: false,
    manualCacheFlush: false,
    useVM2: false,
    allowUnsafeClient: true,
    walletBalanceUrl: "",
});
exports.ContractError = Error;
exports.ContractAssert = node_assert_1.default;
class BigNumber extends bignumber_js_1.default {
}
exports.BigNumber = BigNumber;
// eslint-disable-next-line @typescript-eslint/no-empty-function
function _log(..._values) { }
exports._log = _log;
