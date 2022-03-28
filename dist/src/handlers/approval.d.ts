import * as io from "io-ts";
import { ReadResult, State, WriteResult } from "../contractTypes";
export declare const IsApprovedForAllInputCodec: io.TypeC<{
    function: io.LiteralC<"isApprovedForAll">;
    target: io.StringC;
    owner: io.StringC;
}>;
export declare type IsApprovedForAllInput = io.TypeOf<typeof IsApprovedForAllInputCodec>;
export declare type IsApprovedForallResult = {
    approved: boolean;
};
export declare function isApprovedForAll(state: State, caller: string, input: IsApprovedForAllInput): ReadResult<IsApprovedForallResult>;
export declare const SetApprovalForAllInputCodec: io.TypeC<{
    function: io.LiteralC<"setApprovalForAll">;
    target: io.StringC;
    approved: io.BooleanC;
}>;
export declare type SetApprovalForAllInput = io.TypeOf<typeof SetApprovalForAllInputCodec>;
export declare function setApprovalForAll(state: State, caller: string, input: SetApprovalForAllInput): WriteResult;
export declare function isApprovedForAllHelper(state: State, caller: string, target: string): boolean;
export declare function isApprovedOrOwner(state: State, caller: string, target: string): boolean;
