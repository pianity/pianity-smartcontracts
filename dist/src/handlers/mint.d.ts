import * as io from "io-ts";
import { State, WriteResult } from "@/contractTypes";
export declare const SingleMintCodec: io.IntersectionC<[io.TypeC<{
    primaryRate: io.NumberC;
    secondaryRate: io.NumberC;
    royaltyRate: io.NumberC;
}>, io.PartialC<{
    royalties: io.RecordC<io.StringC, io.NumberC>;
    qty: io.StringC;
    no: io.NumberC;
    suffix: io.StringC;
}>]>;
export declare const MintInputCodec: io.IntersectionC<[io.TypeC<{
    function: io.LiteralC<"mint">;
}>, io.IntersectionC<[io.TypeC<{
    primaryRate: io.NumberC;
    secondaryRate: io.NumberC;
    royaltyRate: io.NumberC;
}>, io.PartialC<{
    royalties: io.RecordC<io.StringC, io.NumberC>;
    qty: io.StringC;
    no: io.NumberC;
    suffix: io.StringC;
}>]>]>;
export declare type MintInput = io.TypeOf<typeof MintInputCodec>;
export declare function mint(state: State, caller: string, input: MintInput): WriteResult;
export declare const MintBatchInputCodec: io.TypeC<{
    function: io.LiteralC<"mintBatch">;
    mints: io.ArrayC<io.IntersectionC<[io.IntersectionC<[io.TypeC<{
        primaryRate: io.NumberC;
        secondaryRate: io.NumberC;
        royaltyRate: io.NumberC;
    }>, io.PartialC<{
        royalties: io.RecordC<io.StringC, io.NumberC>;
        qty: io.StringC;
        no: io.NumberC;
        suffix: io.StringC;
    }>]>, io.TypeC<{
        suffix: io.StringC;
    }>]>>;
}>;
export declare type MintBatchInput = io.TypeOf<typeof MintBatchInputCodec>;
export declare function mintBatch(state: State, caller: string, input: MintBatchInput): WriteResult;
export declare const BurnInputCodec: io.TypeC<{
    function: io.LiteralC<"burn">;
    tokenId: io.StringC;
}>;
export declare type BurnInput = io.TypeOf<typeof BurnInputCodec>;
export declare function burn(state: State, caller: string, input: BurnInput): WriteResult;
