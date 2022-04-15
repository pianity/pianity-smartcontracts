"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.transferLocked = exports.TransferLockedInputCodec = exports.increaseVault = exports.IncreaseVaultInputCodec = exports.unlock = exports.UnlockInputCodec = exports.lock = exports.LockInputCodec = void 0;
const io = __importStar(require("io-ts"));
const externals_1 = require("../externals");
const utils_1 = require("../utils");
const transfer_1 = require("../handlers/transfer");
exports.LockInputCodec = io.type({
    function: io.literal("lock"),
    tokenId: io.string,
    qty: io.string,
    lockLength: io.number,
});
function lock(state, caller, input) {
    const { qty: rawQty, lockLength, tokenId } = (0, utils_1.checkInput)(exports.LockInputCodec, input);
    lockToken(state, tokenId, caller, caller, rawQty, lockLength);
    return { state };
}
exports.lock = lock;
exports.UnlockInputCodec = io.type({
    function: io.literal("unlock"),
});
function unlock(state, caller, input) {
    (0, utils_1.checkInput)(exports.UnlockInputCodec, input);
    const vault = state.vaults[caller];
    for (let i = vault.length - 1; i >= 0; i--) {
        const vaultItem = vault[i];
        if (externals_1.SmartWeave.block.height < vaultItem.end) {
            continue;
        }
        (0, transfer_1.addTokenTo)(state, caller, vaultItem.tokenId, new externals_1.BigNumber(vaultItem.balance));
        vault.pop();
    }
    return { state };
}
exports.unlock = unlock;
exports.IncreaseVaultInputCodec = io.type({
    function: io.literal("increaseVault"),
    id: io.number,
    lockLength: io.number,
});
function increaseVault(state, caller, input) {
    const { id, lockLength } = (0, utils_1.checkInput)(exports.IncreaseVaultInputCodec, input);
    const { lockMinLength, lockMaxLength } = state.settings;
    const vault = state.vaults[caller];
    (0, externals_1.ContractAssert)(Number.isInteger(lockLength) && lockLength > lockMinLength && lockLength < lockMaxLength, `transferLocked: lockLength is out of range. lockLength must be between ${lockMinLength} - ${lockMaxLength}.`);
    (0, externals_1.ContractAssert)(vault && vault[id], "increaseVault: `caller` doesn't have a vault with `id`");
    const vaultItem = vault[id];
    (0, externals_1.ContractAssert)(externals_1.SmartWeave.block.height < vaultItem.end, "increaseVault: vault has already ended");
    vaultItem.end += lockLength;
    return { state };
}
exports.increaseVault = increaseVault;
exports.TransferLockedInputCodec = io.type({
    function: io.literal("transferLocked"),
    target: io.string,
    tokenId: io.string,
    qty: io.string,
    lockLength: io.number,
});
function transferLocked(state, caller, input) {
    const { target, tokenId, lockLength = 0, qty: rawQty, } = (0, utils_1.checkInput)(exports.TransferLockedInputCodec, input);
    lockToken(state, tokenId, caller, target, rawQty, lockLength);
    return { state };
}
exports.transferLocked = transferLocked;
function lockToken(state, tokenId, from, target, rawQty, lockLength) {
    const { lockMinLength, lockMaxLength } = state.settings;
    const token = state.tokens[tokenId];
    const qty = new externals_1.BigNumber(rawQty);
    (0, externals_1.ContractAssert)(!token.owners, "lockToken: `tokenId` must not be an NFT");
    (0, externals_1.ContractAssert)(qty.isInteger() && qty.gte(0), "lockToken: `qty` must be a positive integer.");
    (0, externals_1.ContractAssert)(Number.isInteger(lockLength) && lockLength > lockMinLength && lockLength < lockMaxLength, `lockToken: lockLength is out of range. lockLength must be between ${lockMinLength} - ${lockMaxLength}.`);
    (0, externals_1.ContractAssert)(token, "transferLocked: tokenId doesn't exist");
    (0, transfer_1.removeTokenFrom)(state, from, tokenId, qty);
    const start = externals_1.SmartWeave.block.height;
    const end = start + lockLength;
    if (!state.vaults[target]) {
        state.vaults[target] = [];
    }
    state.vaults[target].push({
        tokenId,
        balance: qty.toString(),
        end,
        start,
    });
}
