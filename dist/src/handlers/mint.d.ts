import * as io from "io-ts";
import { State, WriteResult } from "../contractTypes";
export declare const MintInputCodec: io.IntersectionC<[io.TypeC<{
    function: io.LiteralC<"mint">;
    primaryRate: io.NumberC;
    secondaryRate: io.NumberC;
    royaltyRate: io.NumberC;
}>, io.PartialC<{
    royalties: io.RecordC<io.StringC, io.NumberC>;
    qty: io.StringC;
    no: io.NumberC;
}>]>;
export declare type MintInput = io.TypeOf<typeof MintInputCodec>;
export declare function mint(state: State, caller: string, input: MintInput): WriteResult;
export declare const BurnInputCodec: io.TypeC<{
    function: io.LiteralC<"burn">;
    tokenId: io.StringC;
}>;
export declare type BurnInput = io.TypeOf<typeof BurnInputCodec>;
export declare function burn(state: State, caller: string, input: BurnInput): WriteResult;
