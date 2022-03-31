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
exports.foreignInvoke = exports.ForeignInvokeInputCodec = void 0;
const io = __importStar(require("io-ts"));
const consts_1 = require("../consts");
const erc1155_1 = require("../erc1155");
const externals_1 = require("../externals");
const utils_1 = require("../utils");
exports.ForeignInvokeInputCodec = io.type({
    function: io.literal("foreignInvoke"),
    target: io.string,
    invocationId: io.string,
});
async function foreignInvoke(state, caller, input) {
    const { target, invocationId } = (0, utils_1.checkInput)(exports.ForeignInvokeInputCodec, input);
    const { contractOwners } = state.settings;
    (0, externals_1.ContractAssert)(contractOwners.includes(caller), "Caller is not authorized to foreignInvoke");
    (0, externals_1.ContractAssert)(target, consts_1.ERR_NOTARGET);
    (0, externals_1.ContractAssert)(typeof invocationId !== "undefined", "No invocationId specified");
    (0, externals_1.ContractAssert)(state.settings.foreignContracts, "No foreignContracts specified");
    (0, externals_1.ContractAssert)(state.settings.foreignContracts.includes(target), "Invalid auction contract");
    const foreignState = await externals_1.SmartWeave.contracts.readContractState(target);
    (0, externals_1.ContractAssert)(foreignState.foreignCalls, "Contract is missing support for foreign calls");
    const invocation = foreignState.foreignCalls[invocationId];
    (0, externals_1.ContractAssert)(invocation, `Incorrect invocationId: invocation not found (${invocationId})`);
    (0, externals_1.ContractAssert)(!state.invocations.includes(target + invocationId), `Invocation already exists (${invocation})`);
    state.invocations.push(target + invocationId);
    const foreignAction = {
        input: invocation,
        caller,
    };
    return await (0, erc1155_1.handle)(state, foreignAction);
}
exports.foreignInvoke = foreignInvoke;
