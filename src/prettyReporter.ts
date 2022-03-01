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

import * as A from "fp-ts/Array";
import * as E from "fp-ts/Either";
import * as NEA from "fp-ts/NonEmptyArray";
import * as O from "fp-ts/Option";
import * as R from "fp-ts/Record";
import { pipe } from "fp-ts/function";
import { Predicate } from "fp-ts/Predicate";
import * as t from "io-ts";
import { Reporter } from "io-ts/lib/Reporter";

const takeUntil =
    <A = unknown>(predicate: Predicate<A>) =>
    (as: ReadonlyArray<A>): ReadonlyArray<A> => {
        const init = [];

        for (let i = 0; i < as.length; i++) {
            init[i] = as[i];
            if (predicate(as[i])) {
                return init;
            }
        }

        return init;
    };

export interface ReporterOptions {
    truncateLongTypes?: boolean;
}

const isUnionType = ({ type }: t.ContextEntry) => type instanceof t.UnionType;

const jsToString = (value: unknown) => (value === undefined ? "undefined" : JSON.stringify(value));

const keyPath = (ctx: t.Context) =>
    // The context entry with an empty key is the original
    // type ("default context"), not a type error.
    ctx
        .map((c) => c.key)
        .filter(Boolean)
        .join(".");

// The actual error is last in context
const getErrorFromCtx = (validation: t.ValidationError) =>
    // https://github.com/gcanti/fp-ts/pull/544/files
    A.last(validation.context as t.ContextEntry[]);

const getValidationContext = (validation: t.ValidationError) =>
    // https://github.com/gcanti/fp-ts/pull/544/files
    validation.context as t.ContextEntry[];

export const TYPE_MAX_LEN = 160; // Two lines of 80-col text
const truncateType = (type: string, options: ReporterOptions = {}): string => {
    const { truncateLongTypes = true } = options;

    if (truncateLongTypes && type.length > TYPE_MAX_LEN) {
        return `${type.slice(0, TYPE_MAX_LEN - 3)}...`;
    }

    return type;
};

const errorMessageSimple = (
    expectedType: string,
    path: string,
    error: t.ValidationError,
    options?: ReporterOptions,
) =>
    // https://github.com/elm-lang/core/blob/18c9e84e975ed22649888bfad15d1efdb0128ab2/src/Native/Json.js#L199
    [
        `Expecting ${truncateType(expectedType, options)}`,
        path === "" ? "" : `at ${path}`,
        `but instead got: ${jsToString(error.value)}`,
        error.message ? `(${error.message})` : "",
    ]
        .filter(Boolean)
        .join(" ");

const errorMessageUnion = (
    expectedTypes: string[],
    path: string,
    value: unknown,
    options?: ReporterOptions,
) =>
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
const findExpectedType = (ctx: t.ContextEntry[]) =>
    pipe(
        ctx,
        A.findIndex(isUnionType),
        O.chain((n) => A.lookup(n + 1, ctx)),
    );

const formatValidationErrorOfUnion = (
    path: string,
    errors: NEA.NonEmptyArray<t.ValidationError>,
    options?: ReporterOptions,
) => {
    const expectedTypes = pipe(
        errors,
        A.map(getValidationContext),
        A.map(findExpectedType),
        A.compact,
    );

    const value = pipe(
        expectedTypes,
        A.head,
        O.map((v) => v.actual),
        O.getOrElse((): unknown => undefined),
    );

    const expected = expectedTypes.map(({ type }) => type.name);

    return expected.length > 0 ? O.some(errorMessageUnion(expected, path, value, options)) : O.none;
};

const formatValidationCommonError = (
    path: string,
    error: t.ValidationError,
    options?: ReporterOptions,
) =>
    pipe(
        error,
        getErrorFromCtx,
        O.map((errorContext) => errorMessageSimple(errorContext.type.name, path, error, options)),
    );

const groupByKey = NEA.groupBy((error: t.ValidationError) =>
    pipe(error.context, takeUntil(isUnionType), keyPath),
);

const format = (
    path: string,
    errors: NEA.NonEmptyArray<t.ValidationError>,
    options?: ReporterOptions,
) =>
    NEA.tail(errors).length > 0
        ? formatValidationErrorOfUnion(path, errors, options)
        : formatValidationCommonError(path, NEA.head(errors), options);

/**
 * Format a single validation error.
 */
export const formatValidationError = (error: t.ValidationError, options?: ReporterOptions) =>
    formatValidationCommonError(keyPath(error.context), error, options);

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
export const formatValidationErrors = (errors: t.Errors, options?: ReporterOptions) =>
    pipe(
        errors,
        groupByKey,
        R.mapWithIndex((path, errors) => format(path, errors, options)),
        R.compact,
        R.toArray,
        A.map(([_key, error]) => error),
    );

const reporter = <T>(validation: t.Validation<T>, options?: ReporterOptions) =>
    pipe(
        validation,
        E.mapLeft((errors) => formatValidationErrors(errors, options)),
        E.fold(
            (errors) => errors,
            () => [],
        ),
    );

interface PrettyReporter extends Reporter<string[]> {
    report: <T>(validation: t.Validation<T>, options?: ReporterOptions) => string[];
}

const prettyReporter: PrettyReporter = { report: reporter };
export default prettyReporter;
