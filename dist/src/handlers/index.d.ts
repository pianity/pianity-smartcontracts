import * as io from "io-ts";
import { BalanceResult, NameResult, OwnerResult, RoyaltiesResult, TickerResult } from "@/handlers/readonlys";
import { IsApprovedForallResult } from "@/handlers/approval";
export * from "@/handlers/readonlys";
export * from "@/handlers/approval";
export * from "@/handlers/transfer";
export * from "@/handlers/mint";
export * from "@/handlers/settings";
export * from "@/handlers/foreignInvoke";
export declare const InputCodec: io.UnionC<[io.TypeC<{
    function: io.LiteralC<"name">;
}>, io.IntersectionC<[io.TypeC<{
    function: io.LiteralC<"ticker">;
}>, io.PartialC<{
    tokenId: io.StringC;
}>]>, io.IntersectionC<[io.TypeC<{
    function: io.LiteralC<"balance">;
}>, io.PartialC<{
    target: io.StringC;
    tokenId: io.StringC;
}>]>, io.TypeC<{
    function: io.LiteralC<"royalties">;
    target: io.StringC;
    tokenId: io.StringC;
}>, io.TypeC<{
    function: io.UnionC<[io.LiteralC<"owner">, io.LiteralC<"owners">]>;
    tokenId: io.StringC;
}>, io.TypeC<{
    function: io.LiteralC<"isApprovedForAll">;
    target: io.StringC;
    owner: io.StringC;
}>, io.TypeC<{
    function: io.LiteralC<"setApprovalForAll">;
    target: io.StringC;
    approved: io.BooleanC;
}>, io.IntersectionC<[io.TypeC<{
    function: io.LiteralC<"transfer">;
    target: io.StringC;
}>, io.PartialC<{
    from: io.StringC;
    tokenId: io.StringC;
    qty: io.StringC;
    no: io.NumberC;
    price: io.StringC;
}>]>, io.IntersectionC<[io.TypeC<{
    function: io.LiteralC<"transferBatch">;
    targets: io.ArrayC<io.StringC>;
    froms: io.ArrayC<io.StringC>;
    tokenIds: io.ArrayC<io.StringC>;
}>, io.PartialC<{
    qtys: io.ArrayC<io.StringC>;
    prices: io.ArrayC<io.StringC>;
    nos: io.ArrayC<io.NumberC>;
}>]>, io.TypeC<{
    function: io.LiteralC<"transferRoyalties">;
    target: io.StringC;
    tokenId: io.StringC;
    qty: io.NumberC;
}>, io.IntersectionC<[io.TypeC<{
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
}>]>]>, io.TypeC<{
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
}>, io.TypeC<{
    function: io.LiteralC<"burn">;
    tokenId: io.StringC;
}>, io.IntersectionC<[io.TypeC<{
    function: io.LiteralC<"settings">;
    settings: io.PartialC<{
        allowFreeTransfer: io.BooleanC;
        paused: io.BooleanC;
        communityChest: io.StringC;
        contractOwners: io.ArrayC<io.StringC>;
        contractSuperOwners: io.ArrayC<io.StringC>;
        foreignContracts: io.ArrayC<io.StringC>;
    }>;
}>, io.RecordC<io.StringC, io.UnknownC>]>, io.TypeC<{
    function: io.LiteralC<"foreignInvoke">;
    target: io.StringC;
    invocationId: io.StringC;
}>]>;
export declare type Input = io.TypeOf<typeof InputCodec>;
export declare type ReadonlysResult = NameResult | TickerResult | BalanceResult | RoyaltiesResult | OwnerResult | IsApprovedForallResult;
