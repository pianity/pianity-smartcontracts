import * as io from "io-ts";
import { SmartcontractResult, State } from "../contractTypes";
export declare const ForeignInvokeInputCodec: io.TypeC<{
    function: io.LiteralC<"foreignInvoke">;
    target: io.StringC;
    invocationId: io.StringC;
}>;
export declare type ForeignInvokeInput = io.TypeOf<typeof ForeignInvokeInputCodec>;
export declare function foreignInvoke(state: State, caller: string, input: ForeignInvokeInput): Promise<SmartcontractResult>;
