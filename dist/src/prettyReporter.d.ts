import * as O from "fp-ts/Option";
import * as t from "io-ts";
import { Reporter } from "io-ts/lib/Reporter";
export interface ReporterOptions {
    truncateLongTypes?: boolean;
}
export declare const TYPE_MAX_LEN = 160;
/**
 * Format a single validation error.
 */
export declare const formatValidationError: (error: t.ValidationError, options?: ReporterOptions | undefined) => O.Option<string>;
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
export declare const formatValidationErrors: (errors: t.Errors, options?: ReporterOptions | undefined) => string[];
interface PrettyReporter extends Reporter<string[]> {
    report: <T>(validation: t.Validation<T>, options?: ReporterOptions) => string[];
}
declare const prettyReporter: PrettyReporter;
export default prettyReporter;
