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
exports.burn = exports.BurnInputCodec = exports.mintBatch = exports.MintBatchInputCodec = exports.mint = exports.MintInputCodec = exports.SingleMintCodec = void 0;
const io = __importStar(require("io-ts"));
const consts_1 = require("../consts");
const externals_1 = require("../externals");
const transfer_1 = require("../handlers/transfer");
const utils_1 = require("../utils");
exports.SingleMintCodec = io.partial({
    royaltyRate: io.number,
    royalties: io.record(io.string, io.number),
    no: io.number,
    qty: io.string,
    suffix: io.string,
});
exports.MintInputCodec = io.intersection([
    io.type({ function: io.literal("mint") }),
    exports.SingleMintCodec,
]);
function mint(state, caller, input) {
    const { royalties, royaltyRate, no, qty, suffix } = (0, utils_1.checkInput)(exports.MintInputCodec, input);
    const { contractOwners } = state.settings;
    (0, externals_1.ContractAssert)(contractOwners.includes(caller), "mint: `caller` is not authorized to mint");
    (0, externals_1.ContractAssert)((qty && !no && !royalties && !royaltyRate) || (!qty && no && royaltyRate && royalties), "mint: Either `qty` or `no` must be set (not simultaneously). When `no` is set, `royalties` and `royaltyRate` must be set as well.");
    const tokenId = getTokenId(suffix);
    (0, externals_1.ContractAssert)(!(tokenId in state.tokens), `mint: \`tokenId\` already exists: "${tokenId}".`);
    if (royalties) {
        (0, transfer_1.checkRoyalties)(royalties);
    }
    const token = {
        ticker: `${consts_1.PST}${state.nonce}`,
        royalties,
        balances: {},
        royaltyRate,
    };
    state.nonce++;
    state.tokens[tokenId] = token;
    if (no) {
        // is an NFT
        (0, externals_1.ContractAssert)(Number.isInteger(no), consts_1.ERR_INTEGER);
        token.owners = Array(no).fill("");
        (0, transfer_1.addTokenTo)(state, "", tokenId, new externals_1.BigNumber(no));
    }
    else if (qty) {
        // is a token
        (0, transfer_1.addTokenTo)(state, "", tokenId, new externals_1.BigNumber(qty));
    }
    return { state };
}
exports.mint = mint;
exports.MintBatchInputCodec = io.type({
    function: io.literal("mintBatch"),
    mints: io.array(io.intersection([exports.SingleMintCodec, io.type({ suffix: exports.SingleMintCodec.props.suffix })])),
});
function mintBatch(state, caller, input) {
    const { mints } = (0, utils_1.checkInput)(exports.MintBatchInputCodec, input);
    for (const mintInput of mints) {
        mint(state, caller, { function: "mint", ...mintInput });
    }
    return { state };
}
exports.mintBatch = mintBatch;
exports.BurnInputCodec = io.type({
    function: io.literal("burn"),
    tokenId: io.string,
});
function burn(state, caller, input) {
    const { tokenId } = (0, utils_1.checkInput)(exports.BurnInputCodec, input);
    const { contractSuperOwners } = state.settings;
    (0, externals_1.ContractAssert)(state.tokens[tokenId], "burn: `tokenId` doesn't exist");
    (0, externals_1.ContractAssert)(contractSuperOwners.includes(caller), "burn: `caller` isn't a super owner");
    delete state.tokens[tokenId];
    return { state };
}
exports.burn = burn;
function getTokenId(suffix) {
    let tokenId = externals_1.SmartWeave.transaction.id;
    (0, externals_1.ContractAssert)(tokenId, "mint: Couldn't get the transaction id via SmartWeave global");
    const effectiveSuffix = suffix?.trim();
    if (effectiveSuffix && effectiveSuffix.length > 0) {
        tokenId = `${suffix}${tokenId}`;
    }
    return tokenId;
}
