"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputCodec = exports.TransactionBatchInputCodec = exports.InputWOTxBatchCodec = void 0;
const io = __importStar(require("io-ts"));
const readonlys_1 = require("../handlers/readonlys");
const approval_1 = require("../handlers/approval");
const transfer_1 = require("../handlers/transfer");
const mint_1 = require("../handlers/mint");
const settings_1 = require("../handlers/settings");
const foreignInvoke_1 = require("../handlers/foreignInvoke");
__exportStar(require("../handlers/readonlys"), exports);
__exportStar(require("../handlers/approval"), exports);
__exportStar(require("../handlers/transfer"), exports);
__exportStar(require("../handlers/mint"), exports);
__exportStar(require("../handlers/settings"), exports);
__exportStar(require("../handlers/foreignInvoke"), exports);
__exportStar(require("../handlers/transactionBatch"), exports);
/**
 * The codec for every Input except TransactionBatchInput. This is done because it is forbidden to
 * nest TransactionBatch calls.
 */
exports.InputWOTxBatchCodec = io.union([
    readonlys_1.NameInputCodec,
    readonlys_1.TickerInputCodec,
    readonlys_1.BalanceInputCodec,
    readonlys_1.RoyaltiesInputCodec,
    readonlys_1.OwnerInputCodec,
    approval_1.IsApprovedForAllInputCodec,
    approval_1.SetApprovalForAllInputCodec,
    transfer_1.TransferInputCodec,
    transfer_1.TransferBatchInputCodec,
    transfer_1.TransferRoyaltiesInputCodec,
    mint_1.MintInputCodec,
    mint_1.MintBatchInputCodec,
    mint_1.BurnInputCodec,
    settings_1.SettingsInputCodec,
    foreignInvoke_1.ForeignInvokeInputCodec,
]);
// NOTE: `TransactionBatchInputCodec` is defined here instead of in `transactionBatch.ts` because
// of a bug with esbuild that makes it appear before the definition of `InputWOTxBatchCodec`.
// TODO: Post a Github issue on esbuild's repo
exports.TransactionBatchInputCodec = io.type({
    function: io.literal("transactionBatch"),
    inputs: io.array(exports.InputWOTxBatchCodec),
});
exports.InputCodec = io.union([exports.InputWOTxBatchCodec, exports.TransactionBatchInputCodec]);
