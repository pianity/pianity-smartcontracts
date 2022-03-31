"use strict";
// NOTE: this code has been copied and corrected from
// https://github.com/gillchristian/io-ts-reporters/tree/a14de2174ef0c5a4a72e93f49f4e18f431b5378c
//
// MIT License
//
// Copyright (c) 2017 Oliver Joseph Ash
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
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
exports.formatValidationErrors = exports.formatValidationError = exports.TYPE_MAX_LEN = void 0;
const A = __importStar(require("fp-ts/Array"));
const E = __importStar(require("fp-ts/Either"));
const NEA = __importStar(require("fp-ts/NonEmptyArray"));
const O = __importStar(require("fp-ts/Option"));
const R = __importStar(require("fp-ts/Record"));
const function_1 = require("fp-ts/function");
const t = __importStar(require("io-ts"));
const takeUntil = (predicate) => (as) => {
    const init = [];
    for (let i = 0; i < as.length; i++) {
        init[i] = as[i];
        if (predicate(as[i])) {
            return init;
        }
    }
    return init;
};
const isUnionType = ({ type }) => type instanceof t.UnionType;
const jsToString = (value) => (value === undefined ? "undefined" : JSON.stringify(value));
const keyPath = (ctx) => 
// The context entry with an empty key is the original
// type ("default context"), not a type error.
ctx
    .map((c) => c.key)
    .filter(Boolean)
    .join(".");
// The actual error is last in context
const getErrorFromCtx = (validation) => 
// https://github.com/gcanti/fp-ts/pull/544/files
A.last(validation.context);
const getValidationContext = (validation) => 
// https://github.com/gcanti/fp-ts/pull/544/files
validation.context;
exports.TYPE_MAX_LEN = 160; // Two lines of 80-col text
const truncateType = (type, options = {}) => {
    const { truncateLongTypes = true } = options;
    if (truncateLongTypes && type.length > exports.TYPE_MAX_LEN) {
        return `${type.slice(0, exports.TYPE_MAX_LEN - 3)}...`;
    }
    return type;
};
const errorMessageSimple = (expectedType, path, error, options) => 
// https://github.com/elm-lang/core/blob/18c9e84e975ed22649888bfad15d1efdb0128ab2/src/Native/Json.js#L199
[
    `Expecting ${truncateType(expectedType, options)}`,
    path === "" ? "" : `at ${path}`,
    `but instead got: ${jsToString(error.value)}`,
    error.message ? `(${error.message})` : "",
]
    .filter(Boolean)
    .join(" ");
const errorMessageUnion = (expectedTypes, path, value, options) => 
// https://github.com/elm-lang/core/blob/18c9e84e975ed22649888bfad15d1efdb0128ab2/src/Native/Json.js#L199
[
    "Expecting one of:\n",
    expectedTypes.map((type) => `    ${truncateType(type, options)}`).join("\n"),
    path === "" ? "\n" : `\nat ${path} `,
    `but instead got: ${jsToString(value)}`,
]
    .filter(Boolean)
    .join("");
// Find the union type in the list of ContextEntry
// The next ContextEntry should be the type of this branch of the union
const findExpectedType = (ctx) => (0, function_1.pipe)(ctx, A.findIndex(isUnionType), O.chain((n) => A.lookup(n + 1, ctx)));
const formatValidationErrorOfUnion = (path, errors, options) => {
    const expectedTypes = (0, function_1.pipe)(errors, A.map(getValidationContext), A.map(findExpectedType), A.compact);
    const value = (0, function_1.pipe)(expectedTypes, A.head, O.map((v) => v.actual), O.getOrElse(() => undefined));
    const expected = expectedTypes.map(({ type }) => type.name);
    return expected.length > 0 ? O.some(errorMessageUnion(expected, path, value, options)) : O.none;
};
const formatValidationCommonError = (path, error, options) => (0, function_1.pipe)(error, getErrorFromCtx, O.map((errorContext) => errorMessageSimple(errorContext.type.name, path, error, options)));
const groupByKey = NEA.groupBy((error) => (0, function_1.pipe)(error.context, takeUntil(isUnionType), keyPath));
const format = (path, errors, options) => NEA.tail(errors).length > 0
    ? formatValidationErrorOfUnion(path, errors, options)
    : formatValidationCommonError(path, NEA.head(errors), options);
/**
 * Format a single validation error.
 */
const formatValidationError = (error, options) => formatValidationCommonError(keyPath(error.context), error, options);
exports.formatValidationError = formatValidationError;
/**
 * Format validation errors (`t.Errors`).
 *
 * @example
 * import * as E from 'fp-ts/Either'
 * import * as t from 'io-ts'
 * import \{ formatValidationErrors \} from 'io-ts-reporters'
 *
 * const result = t.string.decode(123)
 *
 * assert.deepEqual(
 *   E.mapLeft(formatValidationErrors)(result),
 *   E.left(['Expecting string but instead got: 123'])
 * )
 */
const formatValidationErrors = (errors, options) => (0, function_1.pipe)(errors, groupByKey, R.mapWithIndex((path, errors) => format(path, errors, options)), R.compact, R.toArray, A.map(([_key, error]) => error));
exports.formatValidationErrors = formatValidationErrors;
const reporter = (validation, options) => (0, function_1.pipe)(validation, E.mapLeft((errors) => (0, exports.formatValidationErrors)(errors, options)), E.fold((errors) => errors, () => []));
const prettyReporter = { report: reporter };
exports.default = prettyReporter;
