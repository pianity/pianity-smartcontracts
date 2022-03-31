"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapHandler = exports.exhaustive = exports.wrapErrorAsync = exports.sleep = exports.hasOwnProperty = exports.checkInput = void 0;
const Either_1 = require("fp-ts/lib/Either");
const externals_1 = require("./externals");
const prettyReporter_1 = __importDefault(require("./prettyReporter"));
/**
 * Returns `input` if `input`'s type is correct according to `codec`; throws otherwise.
 */
function checkInput(codec, input) {
    const inputDecoded = codec.decode(input);
    if ((0, Either_1.isLeft)(inputDecoded)) {
        // const report = PathReporter.report(inputDecoded).join("\n");
        const report = prettyReporter_1.default.report(inputDecoded).join("\n");
        throw new externals_1.ContractError(report);
    }
    return input;
}
exports.checkInput = checkInput;
function hasOwnProperty(object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
}
exports.hasOwnProperty = hasOwnProperty;
function sleep(seconds) {
    return new Promise((resolve) => {
        setTimeout(resolve, seconds * 1000);
    });
}
exports.sleep = sleep;
function wrapErrorAsync(action, args, error) {
    try {
        return action(...args);
    }
    catch {
        throw error;
    }
}
exports.wrapErrorAsync = wrapErrorAsync;
function exhaustive(_) {
    throw new Error("Check wasn't exhaustive");
}
exports.exhaustive = exhaustive;
function wrapHandler(handler) {
    const wrappedHandler = function wrappedHandler(state, caller, input) {
        handler(state, caller, { ...input, function: handler.name });
    };
    return [handler, wrappedHandler];
}
exports.wrapHandler = wrapHandler;
