"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exhaustive = exports.hasOwnProperty = exports.isPositiveIntBn = exports.isPositiveInt = exports.checkInput = void 0;
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
function isPositiveInt(value) {
    return Number.isInteger(value) && value > 0;
}
exports.isPositiveInt = isPositiveInt;
function isPositiveIntBn(value) {
    return value.isInteger() && value.gte(0);
}
exports.isPositiveIntBn = isPositiveIntBn;
function hasOwnProperty(object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
}
exports.hasOwnProperty = hasOwnProperty;
function exhaustive(_) {
    throw new Error("Check wasn't exhaustive");
}
exports.exhaustive = exhaustive;
