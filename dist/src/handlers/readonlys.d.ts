import * as io from "io-ts";
import { ReadResult, State } from "@/contractTypes";
import { BigNumber } from "@/externals";
export declare const NameInputCodec: io.TypeC<{
    function: io.LiteralC<"name">;
}>;
export declare type NameInput = io.TypeOf<typeof NameInputCodec>;
export declare type NameResult = {
    name: "Pianity";
};
export declare function name(state: State, caller: string, input: NameInput): ReadResult<NameResult>;
export declare const TickerInputCodec: io.IntersectionC<[io.TypeC<{
    function: io.LiteralC<"ticker">;
}>, io.PartialC<{
    tokenId: io.StringC;
}>]>;
export declare type TickerInput = io.TypeOf<typeof TickerInputCodec>;
export declare type TickerResult = {
    ticker: string;
};
export declare function ticker(state: State, caller: string, input: TickerInput): ReadResult<TickerResult>;
export declare const BalanceInputCodec: io.IntersectionC<[io.TypeC<{
    function: io.LiteralC<"balance">;
}>, io.PartialC<{
    target: io.StringC;
    tokenId: io.StringC;
}>]>;
export declare type BalanceInput = io.TypeOf<typeof BalanceInputCodec>;
export declare type BalanceResult = {
    target: string;
    balance: string;
};
export declare function balance(state: State, caller: string, input: BalanceInput): ReadResult<BalanceResult>;
export declare const RoyaltiesInputCodec: io.TypeC<{
    function: io.LiteralC<"royalties">;
    target: io.StringC;
    tokenId: io.StringC;
}>;
export declare type RoyaltiesInput = io.TypeOf<typeof RoyaltiesInputCodec>;
export declare type RoyaltiesResult = {
    royalties: number;
};
export declare function royalties(state: State, caller: string, input: RoyaltiesInput): ReadResult<RoyaltiesResult>;
export declare const OwnerInputCodec: io.TypeC<{
    function: io.UnionC<[io.LiteralC<"owner">, io.LiteralC<"owners">]>;
    tokenId: io.StringC;
}>;
export declare type OwnerInput = io.TypeOf<typeof OwnerInputCodec>;
export declare type OwnerResult = {
    owners: string[];
};
export declare function owner(state: State, caller: string, input: OwnerInput): ReadResult<OwnerResult>;
export declare function balanceOf(state: State, tokenId: string, target: string): BigNumber;
