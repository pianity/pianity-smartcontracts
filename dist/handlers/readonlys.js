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
exports.balanceOf = exports.owner = exports.OwnerInputCodec = exports.royalties = exports.RoyaltiesInputCodec = exports.totalBalance = exports.TotalBalanceInputCodec = exports.vaultBalance = exports.VaultBalanceInputCodec = exports.balance = exports.BalanceInputCodec = exports.ticker = exports.TickerInputCodec = exports.name = exports.NameInputCodec = void 0;
const io = __importStar(require("io-ts"));
const consts_1 = require("../consts");
const externals_1 = require("../externals");
const utils_1 = require("../utils");
exports.NameInputCodec = io.type({ function: io.literal("name") });
function name(state, caller, input) {
    (0, utils_1.checkInput)(exports.NameInputCodec, input);
    return { result: { name: "Pianity" } };
}
exports.name = name;
exports.TickerInputCodec = io.intersection([
    io.type({
        function: io.literal("ticker"),
    }),
    io.partial({
        tokenId: io.string,
    }),
]);
function ticker(state, caller, input) {
    const { tokenId } = (0, utils_1.checkInput)(exports.TickerInputCodec, input);
    const ticker = tickerOf(state, tokenId || consts_1.PST);
    return { result: { ticker } };
}
exports.ticker = ticker;
exports.BalanceInputCodec = io.intersection([
    io.type({
        function: io.literal("balance"),
    }),
    io.partial({
        target: io.string,
        tokenId: io.string,
    }),
]);
/**
 * Returns the unlocked balance of `target` or caller
 */
function balance(state, caller, input) {
    const { target = caller, tokenId = consts_1.PST } = (0, utils_1.checkInput)(exports.BalanceInputCodec, input);
    const balance = balanceOf(state, tokenId || consts_1.PST, target);
    return { result: { target, balance: balance.toString() } };
}
exports.balance = balance;
exports.VaultBalanceInputCodec = io.intersection([
    io.type({
        function: io.literal("vaultBalance"),
    }),
    io.partial({
        target: io.string,
        tokenId: io.string,
    }),
]);
function vaultBalance(state, caller, input) {
    const { target = caller, tokenId = consts_1.PST } = (0, utils_1.checkInput)(exports.VaultBalanceInputCodec, input);
    const vault = state.vaults[target];
    let balance = new externals_1.BigNumber(0);
    if (vault) {
        const blockHeight = externals_1.SmartWeave.block.height;
        for (const vaultItem of vault) {
            if (vaultItem.tokenId === tokenId && blockHeight < vaultItem.end) {
                balance = balance.plus(new externals_1.BigNumber(vaultItem.balance));
            }
        }
    }
    return { result: { target, balance: balance.toString() } };
}
exports.vaultBalance = vaultBalance;
exports.TotalBalanceInputCodec = io.intersection([
    io.type({
        function: io.literal("totalBalance"),
    }),
    io.partial({
        target: io.string,
        tokenId: io.string,
    }),
]);
/**
 * Returns the unlocked + locked balance of `target` or caller
 */
function totalBalance(state, caller, input) {
    const { target = caller, tokenId = consts_1.PST } = (0, utils_1.checkInput)(exports.TotalBalanceInputCodec, input);
    const token = state.tokens[tokenId];
    (0, externals_1.ContractAssert)(token, "totalBalanceOf: Token not found");
    let balance = new externals_1.BigNumber(token.balances[target] || 0);
    const vaults = state.vaults[target];
    if (vaults) {
        for (const vault of vaults) {
            if (vault.tokenId === tokenId) {
                balance = balance.plus(vault.balance);
            }
        }
    }
    return { result: { target, balance: balance.toString() } };
}
exports.totalBalance = totalBalance;
exports.RoyaltiesInputCodec = io.type({
    function: io.literal("royalties"),
    target: io.string,
    tokenId: io.string,
});
function royalties(state, caller, input) {
    const { target, tokenId } = (0, utils_1.checkInput)(exports.RoyaltiesInputCodec, input);
    (0, externals_1.ContractAssert)(tokenId, consts_1.ERR_NOTOKENID);
    (0, externals_1.ContractAssert)(target, consts_1.ERR_NOTARGET);
    const royalties = royaltiesOf(state, tokenId, target);
    return { result: { royalties } };
}
exports.royalties = royalties;
exports.OwnerInputCodec = io.type({
    function: io.union([io.literal("owner"), io.literal("owners")]),
    tokenId: io.string,
});
function owner(state, caller, input) {
    const { tokenId } = (0, utils_1.checkInput)(exports.OwnerInputCodec, input);
    (0, externals_1.ContractAssert)(tokenId, consts_1.ERR_NOTOKENID);
    const owners = ownersOf(state, tokenId);
    return { result: { owners } };
}
exports.owner = owner;
function balanceOf(state, tokenId, target) {
    const token = state.tokens[tokenId];
    (0, externals_1.ContractAssert)(token, "balanceOf: Token not found");
    return new externals_1.BigNumber(token.balances[target] || 0);
}
exports.balanceOf = balanceOf;
function royaltiesOf(state, tokenId, target) {
    const token = state.tokens[tokenId];
    (0, externals_1.ContractAssert)(token, consts_1.ERR_404TOKENID);
    return token.royalties?.[target] ?? 0;
}
function tickerOf(state, tokenId) {
    const token = state.tokens[tokenId];
    (0, externals_1.ContractAssert)(token, consts_1.ERR_404TOKENID);
    const { ticker } = token;
    return ticker;
}
function ownersOf(state, tokenId) {
    const token = state.tokens[tokenId];
    (0, externals_1.ContractAssert)(token, consts_1.ERR_404TOKENID);
    return Object.keys(token.balances);
}
