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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForeignInvokeInputCodec = exports.TransferLockedInputCodec = exports.IncreaseVaultInputCodec = exports.UnlockInputCodec = exports.LockInputCodec = exports.TransactionBatchInputCodec = exports.SettingsInputCodec = exports.MintInputCodec = exports.TransferInputCodec = exports.TransferBatchInputCodec = exports.TransferRoyaltiesInputCodec = exports.SetApprovalForAllInputCodec = exports.IsApprovedForAllInputCodec = exports.RoyaltiesInputCodec = exports.OwnerInputCodec = exports.TickerInputCodec = exports.TotalBalanceInputCodec = exports.VaultBalanceInputCodec = exports.BalanceInputCodec = exports.InputCodec = exports.CT = exports.PST = exports.UNIT = void 0;
var consts_1 = require("./consts");
Object.defineProperty(exports, "UNIT", { enumerable: true, get: function () { return consts_1.UNIT; } });
Object.defineProperty(exports, "PST", { enumerable: true, get: function () { return consts_1.PST; } });
Object.defineProperty(exports, "CT", { enumerable: true, get: function () { return consts_1.CT; } });
__exportStar(require("./contractTypes"), exports);
var handlers_1 = require("./handlers");
Object.defineProperty(exports, "InputCodec", { enumerable: true, get: function () { return handlers_1.InputCodec; } });
var readonlys_1 = require("./handlers/readonlys");
Object.defineProperty(exports, "BalanceInputCodec", { enumerable: true, get: function () { return readonlys_1.BalanceInputCodec; } });
Object.defineProperty(exports, "VaultBalanceInputCodec", { enumerable: true, get: function () { return readonlys_1.VaultBalanceInputCodec; } });
Object.defineProperty(exports, "TotalBalanceInputCodec", { enumerable: true, get: function () { return readonlys_1.TotalBalanceInputCodec; } });
Object.defineProperty(exports, "TickerInputCodec", { enumerable: true, get: function () { return readonlys_1.TickerInputCodec; } });
Object.defineProperty(exports, "OwnerInputCodec", { enumerable: true, get: function () { return readonlys_1.OwnerInputCodec; } });
Object.defineProperty(exports, "RoyaltiesInputCodec", { enumerable: true, get: function () { return readonlys_1.RoyaltiesInputCodec; } });
var approval_1 = require("./handlers/approval");
Object.defineProperty(exports, "IsApprovedForAllInputCodec", { enumerable: true, get: function () { return approval_1.IsApprovedForAllInputCodec; } });
Object.defineProperty(exports, "SetApprovalForAllInputCodec", { enumerable: true, get: function () { return approval_1.SetApprovalForAllInputCodec; } });
var transfer_1 = require("./handlers/transfer");
Object.defineProperty(exports, "TransferRoyaltiesInputCodec", { enumerable: true, get: function () { return transfer_1.TransferRoyaltiesInputCodec; } });
Object.defineProperty(exports, "TransferBatchInputCodec", { enumerable: true, get: function () { return transfer_1.TransferBatchInputCodec; } });
Object.defineProperty(exports, "TransferInputCodec", { enumerable: true, get: function () { return transfer_1.TransferInputCodec; } });
var mint_1 = require("./handlers/mint");
Object.defineProperty(exports, "MintInputCodec", { enumerable: true, get: function () { return mint_1.MintInputCodec; } });
var settings_1 = require("./handlers/settings");
Object.defineProperty(exports, "SettingsInputCodec", { enumerable: true, get: function () { return settings_1.SettingsInputCodec; } });
var handlers_2 = require("./handlers");
Object.defineProperty(exports, "TransactionBatchInputCodec", { enumerable: true, get: function () { return handlers_2.TransactionBatchInputCodec; } });
var vault_1 = require("./handlers/vault");
Object.defineProperty(exports, "LockInputCodec", { enumerable: true, get: function () { return vault_1.LockInputCodec; } });
Object.defineProperty(exports, "UnlockInputCodec", { enumerable: true, get: function () { return vault_1.UnlockInputCodec; } });
Object.defineProperty(exports, "IncreaseVaultInputCodec", { enumerable: true, get: function () { return vault_1.IncreaseVaultInputCodec; } });
Object.defineProperty(exports, "TransferLockedInputCodec", { enumerable: true, get: function () { return vault_1.TransferLockedInputCodec; } });
var foreignInvoke_1 = require("./handlers/foreignInvoke");
Object.defineProperty(exports, "ForeignInvokeInputCodec", { enumerable: true, get: function () { return foreignInvoke_1.ForeignInvokeInputCodec; } });
