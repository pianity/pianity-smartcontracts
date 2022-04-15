import * as io from "io-ts";
import { State, WriteResult } from "../contractTypes";
import { BigNumber } from "../externals";
export declare const SingleTransferCodec: io.IntersectionC<[io.TypeC<{
    target: io.StringC;
}>, io.PartialC<{
    from: io.StringC;
    tokenId: io.StringC;
    qty: io.StringC;
    no: io.NumberC;
    price: io.StringC;
}>]>;
export declare const TransferInputCodec: io.IntersectionC<[io.TypeC<{
    function: io.LiteralC<"transfer">;
}>, io.IntersectionC<[io.TypeC<{
    target: io.StringC;
}>, io.PartialC<{
    from: io.StringC;
    tokenId: io.StringC;
    qty: io.StringC;
    no: io.NumberC;
    price: io.StringC;
}>]>]>;
export declare type TransferInput = io.TypeOf<typeof TransferInputCodec>;
export declare function transfer(state: State, caller: string, input: TransferInput): WriteResult;
export declare const TransferBatchInputCodec: io.TypeC<{
    function: io.LiteralC<"transferBatch">;
    transfers: io.ArrayC<io.IntersectionC<[io.TypeC<{
        target: io.StringC;
    }>, io.PartialC<{
        from: io.StringC;
        tokenId: io.StringC;
        qty: io.StringC;
        no: io.NumberC;
        price: io.StringC;
    }>]>>;
}>;
export declare type TransferBatchInput = io.TypeOf<typeof TransferBatchInputCodec>;
export declare function transferBatch(state: State, caller: string, input: TransferBatchInput): WriteResult;
export declare const TransferRoyaltiesInputCodec: io.TypeC<{
    function: io.LiteralC<"transferRoyalties">;
    target: io.StringC;
    tokenId: io.StringC;
    qty: io.NumberC;
}>;
export declare type TransferRoyaltiesInput = io.TypeOf<typeof TransferRoyaltiesInputCodec>;
export declare function transferRoyalties(state: State, caller: string, input: TransferRoyaltiesInput): WriteResult;
export declare function addTokenTo(state: State, target: string, tokenId: string, qty: BigNumber, no?: number): void;
export declare function removeTokenFrom(state: State, from: string, tokenId: string, qty: BigNumber, no?: number): void;
export declare function checkRoyalties(royalties: Record<string, number>): void;
