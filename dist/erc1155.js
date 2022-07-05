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
Object.defineProperty(exports, "__esModule", { value: true });
exports.handle = void 0;
const externals_1 = require("./externals");
const utils_1 = require("./utils");
const handlers = __importStar(require("./handlers"));
async function handle(state, action) {
    const { paused, contractSuperOwners } = state.settings;
    const { input, caller } = action;
    switch (input.function) {
        case "name":
            return handlers.name(state, caller, input);
        case "ticker":
            return handlers.ticker(state, caller, input);
        case "balance":
            return handlers.balance(state, caller, input);
        case "royalties":
            return handlers.royalties(state, caller, input);
        case "owner":
        case "owners":
            return handlers.owner(state, caller, input);
        case "isApprovedForAll":
            return handlers.isApprovedForAll(state, caller, input);
        default:
            break;
    }
    (0, externals_1.ContractAssert)(!paused || contractSuperOwners.includes(caller), "The contract must not be paused");
    switch (input.function) {
        case "setApprovalForAll":
            return handlers.setApprovalForAll(state, caller, input);
        case "transfer":
            return handlers.transfer(state, caller, input);
        case "transferBatch":
            return handlers.transferBatch(state, caller, input);
        case "transferRoyalties":
            return handlers.transferRoyalties(state, caller, input);
        case "foreignInvoke":
            return handlers.foreignInvoke(state, caller, input);
        case "mint":
            return handlers.mint(state, caller, input);
        case "mintBatch":
            return handlers.mintBatch(state, caller, input);
        case "settings":
            return handlers.settings(state, caller, input);
        case "burn":
            return handlers.burn(state, caller, input);
        case "transactionBatch":
            return handlers.transactionBatch(state, caller, input);
        default:
            (0, utils_1.exhaustive)(input);
            throw new externals_1.ContractError(`No function supplied or function not recognised: "${input.function}".`);
    }
}
exports.handle = handle;
