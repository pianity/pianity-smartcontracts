import * as io from "io-ts";
import { ReadonlyResult, State } from "../contractTypes";
import { BigNumber } from "../externals";
export declare const TickerInputCodec: io.IntersectionC<[io.TypeC<{
    function: io.LiteralC<"ticker">;
}>, io.PartialC<{
    tokenId: io.StringC;
}>]>;
export declare type TickerInput = io.TypeOf<typeof TickerInputCodec>;
export declare function ticker(state: State, caller: string, input: TickerInput): ReadonlyResult<{
    ticker: string;
}>;
export declare const BalanceInputCodec: io.IntersectionC<[io.TypeC<{
    function: io.LiteralC<"balance">;
}>, io.PartialC<{
    target: io.StringC;
    tokenId: io.StringC;
}>]>;
export declare type BalanceInput = io.TypeOf<typeof BalanceInputCodec>;
export declare function balance(state: State, caller: string, input: BalanceInput): ReadonlyResult<{
    target: string;
    balance: string;
}>;
export declare const RoyaltiesInputCodec: io.TypeC<{
    function: io.LiteralC<"royalties">;
    target: io.StringC;
    tokenId: io.StringC;
}>;
export declare type RoyaltiesInput = io.TypeOf<typeof RoyaltiesInputCodec>;
export declare function royalties(state: State, caller: string, input: RoyaltiesInput): ReadonlyResult<{
    royalties: number;
}>;
export declare const OwnerInputCodec: io.TypeC<{
    function: io.UnionC<[io.LiteralC<"owner">, io.LiteralC<"owners">]>;
    tokenId: io.StringC;
}>;
export declare type OwnerInput = io.TypeOf<typeof OwnerInputCodec>;
export declare function owner(state: State, caller: string, input: OwnerInput): ReadonlyResult<{
    owners: string[];
}>;
export declare function balanceOf(state: State, tokenId: string, target: string): BigNumber;
