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
exports.checkRoyalties = exports.removeTokenFrom = exports.addTokenTo = exports.transferRoyalties = exports.TransferRoyaltiesInputCodec = exports.transferBatch = exports.TransferBatchInputCodec = exports.transfer = exports.TransferInputCodec = exports.SingleTransferCodec = void 0;
const io = __importStar(require("io-ts"));
const consts_1 = require("../consts");
const externals_1 = require("../externals");
const approval_1 = require("../handlers/approval");
const utils_1 = require("../utils");
const readonlys_1 = require("../handlers/readonlys");
exports.SingleTransferCodec = io.intersection([
    io.type({
        target: io.string,
    }),
    io.partial({
        from: io.string,
        tokenId: io.string,
        qty: io.string,
        no: io.number,
        price: io.string,
    }),
]);
exports.TransferInputCodec = io.intersection([
    io.type({ function: io.literal("transfer") }),
    exports.SingleTransferCodec,
]);
function transfer(state, caller, input) {
    const { target, qty, no, price, from = caller, tokenId = consts_1.PST, } = (0, utils_1.checkInput)(exports.TransferInputCodec, input);
    const token = state.tokens[tokenId];
    (0, externals_1.ContractAssert)(from !== target, "transfer: `from` cannot be equal to `target`");
    (0, externals_1.ContractAssert)(token, "transfer: `tokenId` doesn't exist");
    (0, externals_1.ContractAssert)(!token.owners || (no && !qty), "transfer: `no` must be set and `qty` unset for NFTs");
    (0, externals_1.ContractAssert)(token.owners || (!no && qty), "transfer: `qty` must be set and `no` unset for tokens");
    (0, externals_1.ContractAssert)((0, approval_1.isApprovedOrOwner)(state, caller, from), "transfer: Sender is not approved nor the owner of the token");
    if (token.royalties) {
        const { contractOwners } = state.settings;
        (0, externals_1.ContractAssert)(state.settings.allowFreeTransfer || contractOwners.includes(caller), "transfer: Free transfers are not allowed");
        (0, externals_1.ContractAssert)(!price || (0, approval_1.isApprovedForAllHelper)(state, caller, target), "transfer: Receiver is not approved");
        removeTokenFrom(state, target, consts_1.PST, new externals_1.BigNumber(price || 0));
        pay(state, token, from, new externals_1.BigNumber(price || 0));
    }
    removeTokenFrom(state, from, tokenId, new externals_1.BigNumber(qty || 1), no);
    addTokenTo(state, target, tokenId, new externals_1.BigNumber(qty || 1), no);
    return { state };
}
exports.transfer = transfer;
exports.TransferBatchInputCodec = io.type({
    function: io.literal("transferBatch"),
    transfers: io.array(exports.SingleTransferCodec),
});
function transferBatch(state, caller, input) {
    const { transfers } = (0, utils_1.checkInput)(exports.TransferBatchInputCodec, input);
    for (const transferInput of transfers) {
        transfer(state, caller, { function: "transfer", ...transferInput });
    }
    return { state };
}
exports.transferBatch = transferBatch;
exports.TransferRoyaltiesInputCodec = io.type({
    function: io.literal("transferRoyalties"),
    target: io.string,
    tokenId: io.string,
    qty: io.number,
});
function transferRoyalties(state, caller, input) {
    const { target, tokenId, qty } = (0, utils_1.checkInput)(exports.TransferRoyaltiesInputCodec, input);
    const token = state.tokens[tokenId];
    (0, externals_1.ContractAssert)(target !== caller, "transferRoyalties: `target` must be different from the caller");
    (0, externals_1.ContractAssert)(qty > 0, "transferRoyalties: `qty` must be positive");
    (0, externals_1.ContractAssert)(token, "transferRoyalties: `tokenId` doesn't exist");
    (0, externals_1.ContractAssert)(token.royalties, "transferRoyalties: Royalties are not set for this token");
    removeRoyaltiesFrom(token, caller, qty);
    addRoyaltiesTo(token, target, qty);
    checkRoyalties(token.royalties);
    return { state };
}
exports.transferRoyalties = transferRoyalties;
function addTokenTo(state, target, tokenId, qty, no) {
    (0, externals_1.ContractAssert)(qty.isInteger(), "addTokenTo: `qty` must be an integer");
    (0, externals_1.ContractAssert)(qty.gte(0), "addTokenTo: `qty` must be positive");
    if (qty.eq(0))
        return;
    const token = state.tokens[tokenId];
    (0, externals_1.ContractAssert)(token, "addTokenTo: `tokenId` does not exist");
    if (!(target in token.balances)) {
        token.balances[target] = "0";
    }
    token.balances[target] = new externals_1.BigNumber(token.balances[target]).plus(qty).toString();
    if (token.owners && no) {
        (0, externals_1.ContractAssert)(Number.isInteger(no), "addTokenTo: `no` must be an integer");
        (0, externals_1.ContractAssert)(no > 0, "Invalid value for no. Must be strictly positive");
        (0, externals_1.ContractAssert)(qty.eq(1), "Amount must be 1 for NFTs");
        (0, externals_1.ContractAssert)(token.owners[no - 1] === "", "Token no. is already attributed");
        token.owners[no - 1] = target;
    }
}
exports.addTokenTo = addTokenTo;
function removeTokenFrom(state, from, tokenId, qty, no) {
    const fromBalance = (0, readonlys_1.balanceOf)(state, tokenId, from);
    (0, externals_1.ContractAssert)(fromBalance.gt(0), "removeTokenFrom: Sender does not own the token");
    (0, externals_1.ContractAssert)(qty.gte(0), "removeTokenFrom: Invalid value for qty. Must be positive");
    (0, externals_1.ContractAssert)(fromBalance.gte(qty), "removeTokenFrom: Insufficient balance");
    if (qty.eq(0)) {
        return;
    }
    (0, externals_1.ContractAssert)(state.tokens[tokenId], "removeTokenFrom: `tokenId` does not exist");
    const token = state.tokens[tokenId];
    const newBalance = new externals_1.BigNumber(token.balances[from]).minus(qty).toString();
    if (token.owners) {
        (0, externals_1.ContractAssert)(no, "removeTokenFrom: No no. specified");
        (0, externals_1.ContractAssert)(Number.isInteger(no), consts_1.ERR_INTEGER);
        (0, externals_1.ContractAssert)(no > 0, "removeTokenFrom: Invalid value for no. Must be strictly positive");
        (0, externals_1.ContractAssert)(qty.eq(1), "removeTokenFrom: Amount must be 1 for NFTs");
        (0, externals_1.ContractAssert)(token.owners[no - 1] === from, "removeTokenFrom: Token no. is not owned by caller");
        token.owners[no - 1] = "";
    }
    if (newBalance === "0") {
        delete token.balances[from];
    }
    else {
        token.balances[from] = newBalance;
    }
}
exports.removeTokenFrom = removeTokenFrom;
function pay(state, token, from, price) {
    (0, externals_1.ContractAssert)(token.royalties && token.royaltyRate, "pay: Token doesn't have any fees");
    (0, externals_1.ContractAssert)(price.isInteger(), `pay: ${consts_1.ERR_INTEGER}`);
    (0, externals_1.ContractAssert)(price.gte(0), "pay: `price` must be positive");
    (0, externals_1.ContractAssert)(price.mod(1000000).eq(0), "pay: `price` must be a multiple of 1_000_000");
    if (price.eq(0)) {
        return;
    }
    if (from.length === 0) {
        // primary sales
        for (const [target, split] of Object.entries(token.royalties)) {
            addTokenTo(state, target, consts_1.PST, price.multipliedBy(split).dividedBy(consts_1.UNIT));
        }
    }
    else {
        // secondary sales
        const netValue = price.multipliedBy(1 - token.royaltyRate);
        addTokenTo(state, from, consts_1.PST, netValue);
        for (const [target, split] of Object.entries(token.royalties)) {
            addTokenTo(state, target, consts_1.PST, price.multipliedBy(token.royaltyRate * split).dividedBy(consts_1.UNIT));
        }
    }
}
function checkRoyalties(royalties) {
    const sum = Object.values(royalties).reduce((acc, val) => {
        (0, externals_1.ContractAssert)(Number.isInteger(val), `checkRoyalties: Royalties must be integers`);
        (0, externals_1.ContractAssert)(val > 0, "checkRoyalties: Royalties must be strictly positive");
        return acc + val;
    }, 0);
    (0, externals_1.ContractAssert)(sum === consts_1.UNIT, `checkRoyalties: Sum of royalties shares must be ${consts_1.UNIT}; was ${sum}`);
}
exports.checkRoyalties = checkRoyalties;
function addRoyaltiesTo(token, target, qty) {
    (0, externals_1.ContractAssert)(token.royalties, "addRoyaltiesTo: Token doesn't have any royalties");
    if (!(target in token.royalties)) {
        token.royalties[target] = 0;
    }
    token.royalties[target] += qty;
}
function removeRoyaltiesFrom(token, from, qty) {
    (0, externals_1.ContractAssert)(token.royalties, "removeRoyaltiesFrom: Token doesn't have any royalties");
    (0, externals_1.ContractAssert)(Number.isInteger(qty), "removeRoyaltiesFrom: Royalties must be integers");
    const fromRoyalties = token.royalties[from] || 0;
    (0, externals_1.ContractAssert)(fromRoyalties > 0, "Sender does not own royalties on the token");
    (0, externals_1.ContractAssert)(fromRoyalties >= qty, "Insufficient royalties' balance");
    const newBalance = token.royalties[from] - qty;
    if (newBalance === 0) {
        delete token.royalties[from];
    }
    else {
        token.royalties[from] = newBalance;
    }
}
