"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionBatch = void 0;
const handlers_1 = require("../handlers");
const utils_1 = require("../utils");
const erc1155_1 = require("../erc1155");
async function transactionBatch(state, caller, input) {
    const { inputs } = (0, utils_1.checkInput)(handlers_1.TransactionBatchInputCodec, input);
    const results = [];
    // We deep clone the state to avoid side effects from failed batch
    let newState = JSON.parse(JSON.stringify(state));
    for (const input of inputs) {
        const res = await (0, erc1155_1.handle)(newState, { caller, input });
        if ("state" in res) {
            newState = res.state;
        }
        results.push(res.result);
    }
    state = { ...state, ...newState };
    return { state, result: { results } };
}
exports.transactionBatch = transactionBatch;
