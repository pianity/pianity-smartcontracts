import * as io from "io-ts";
import { State, WriteResult } from "../contractTypes";
export declare const LockInputCodec: io.TypeC<{
    function: io.LiteralC<"lock">;
    tokenId: io.StringC;
    qty: io.StringC;
    lockLength: io.NumberC;
}>;
export declare type LockInput = io.TypeOf<typeof LockInputCodec>;
export declare function lock(state: State, caller: string, input: LockInput): WriteResult;
export declare const UnlockInputCodec: io.TypeC<{
    function: io.LiteralC<"unlock">;
}>;
export declare type UnlockInput = io.TypeOf<typeof UnlockInputCodec>;
export declare function unlock(state: State, caller: string, input: UnlockInput): WriteResult;
export declare const IncreaseVaultInputCodec: io.TypeC<{
    function: io.LiteralC<"increaseVault">;
    id: io.NumberC;
    lockLength: io.NumberC;
}>;
export declare type IncreaseVaultInput = io.TypeOf<typeof IncreaseVaultInputCodec>;
export declare function increaseVault(state: State, caller: string, input: IncreaseVaultInput): WriteResult;
export declare const TransferLockedInputCodec: io.TypeC<{
    function: io.LiteralC<"transferLocked">;
    target: io.StringC;
    tokenId: io.StringC;
    qty: io.StringC;
    lockLength: io.NumberC;
}>;
export declare type TransferLockedInput = io.TypeOf<typeof TransferLockedInputCodec>;
export declare function transferLocked(state: State, caller: string, input: TransferLockedInput): WriteResult;
