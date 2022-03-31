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
exports.isApprovedOrOwner = exports.isApprovedForAllHelper = exports.setApprovalForAll = exports.SetApprovalForAllInputCodec = exports.isApprovedForAll = exports.IsApprovedForAllInputCodec = void 0;
const io = __importStar(require("io-ts"));
const externals_1 = require("../externals");
const utils_1 = require("../utils");
exports.IsApprovedForAllInputCodec = io.type({
    function: io.literal("isApprovedForAll"),
    target: io.string,
    owner: io.string,
});
function isApprovedForAll(state, caller, input) {
    const { target, owner } = (0, utils_1.checkInput)(exports.IsApprovedForAllInputCodec, input);
    const approved = isApprovedForAllHelper(state, owner, target);
    return { result: { approved } };
}
exports.isApprovedForAll = isApprovedForAll;
exports.SetApprovalForAllInputCodec = io.type({
    function: io.literal("setApprovalForAll"),
    target: io.string,
    approved: io.boolean,
});
function setApprovalForAll(state, caller, input) {
    const { approved, target } = (0, utils_1.checkInput)(exports.SetApprovalForAllInputCodec, input);
    (0, externals_1.ContractAssert)(target !== caller, "Target must be different from the caller");
    if (!(caller in state.operatorApprovals)) {
        state.operatorApprovals[caller] = {};
    }
    state.operatorApprovals[caller][target] = approved;
    return { state };
}
exports.setApprovalForAll = setApprovalForAll;
// TODO: Find a better name (isApprovedForAll is already taken by the handler)
// Is caller allowed to move owners tokens?
function isApprovedForAllHelper(state, caller, target) {
    if (target.length === 0 && state.settings.contractOwners.includes(caller)) {
        return true;
    }
    if (!(target in state.operatorApprovals))
        return false;
    if (!(caller in state.operatorApprovals[target]))
        return false;
    return state.operatorApprovals[target][caller];
}
exports.isApprovedForAllHelper = isApprovedForAllHelper;
function isApprovedOrOwner(state, caller, target) {
    if (caller === target) {
        return true;
    }
    return isApprovedForAllHelper(state, caller, target);
}
exports.isApprovedOrOwner = isApprovedOrOwner;
