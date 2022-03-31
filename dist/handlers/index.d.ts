import * as io from "io-ts";
import { BalanceResult, NameResult, OwnerResult, RoyaltiesResult, TickerResult } from "../handlers/readonlys";
import { IsApprovedForallResult } from "../handlers/approval";
export * from "../handlers/readonlys";
export * from "../handlers/approval";
export * from "../handlers/transfer";
export * from "../handlers/mint";
export * from "../handlers/settings";
export * from "../handlers/foreignInvoke";
export * from "../handlers/transactionBatch";
/**
 * The codec for every Input except TransactionBatchInput. This is done because it is forbidden to
 * nest TransactionBatch calls.
 */
export declare const InputWOTxBatchCodec: io.UnionC<[io.TypeC<{
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
}>, io.IntersectionC<[io.TypeC<{
    target: io.StringC;
}>, io.PartialC<{
    from: io.StringC;
    tokenId: io.StringC;
    qty: io.StringC;
    no: io.NumberC;
    price: io.StringC;
}>]>]>, io.TypeC<{
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
}>, io.TypeC<{
    function: io.LiteralC<"transferRoyalties">;
    target: io.StringC;
    tokenId: io.StringC;
    qty: io.NumberC;
}>, io.IntersectionC<[io.TypeC<{
    function: io.LiteralC<"mint">;
}>, io.PartialC<{
    royaltyRate: io.NumberC;
    royalties: io.RecordC<io.StringC, io.NumberC>;
    no: io.NumberC;
    qty: io.StringC;
    suffix: io.StringC;
}>]>, io.TypeC<{
    function: io.LiteralC<"mintBatch">;
    mints: io.ArrayC<io.IntersectionC<[io.PartialC<{
        royaltyRate: io.NumberC;
        royalties: io.RecordC<io.StringC, io.NumberC>;
        no: io.NumberC;
        qty: io.StringC;
        suffix: io.StringC;
    }>, io.TypeC<{
        suffix: io.StringC;
    }>]>>;
}>, io.TypeC<{
    function: io.LiteralC<"burn">;
    tokenId: io.StringC;
}>, io.TypeC<{
    function: io.LiteralC<"settings">;
    settings: io.IntersectionC<[io.PartialC<{
        allowFreeTransfer: io.BooleanC;
        paused: io.BooleanC;
        communityChest: io.StringC;
        contractOwners: io.ArrayC<io.StringC>;
        contractSuperOwners: io.ArrayC<io.StringC>;
        settingsOwnersPermissions: io.ArrayC<io.StringC>;
        foreignContracts: io.ArrayC<io.StringC>;
    }>, io.RecordC<io.StringC, io.UnknownC>]>;
}>, io.TypeC<{
    function: io.LiteralC<"foreignInvoke">;
    target: io.StringC;
    invocationId: io.StringC;
}>]>;
export declare type InputWOTxBatchCodec = io.TypeOf<typeof InputWOTxBatchCodec>;
export declare const TransactionBatchInputCodec: io.TypeC<{
    function: io.LiteralC<"transactionBatch">;
    inputs: io.ArrayC<io.UnionC<[io.TypeC<{
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
    }>, io.IntersectionC<[io.TypeC<{
        target: io.StringC;
    }>, io.PartialC<{
        from: io.StringC;
        tokenId: io.StringC;
        qty: io.StringC;
        no: io.NumberC;
        price: io.StringC;
    }>]>]>, io.TypeC<{
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
    }>, io.TypeC<{
        function: io.LiteralC<"transferRoyalties">;
        target: io.StringC;
        tokenId: io.StringC;
        qty: io.NumberC;
    }>, io.IntersectionC<[io.TypeC<{
        function: io.LiteralC<"mint">;
    }>, io.PartialC<{
        royaltyRate: io.NumberC;
        royalties: io.RecordC<io.StringC, io.NumberC>;
        no: io.NumberC;
        qty: io.StringC;
        suffix: io.StringC;
    }>]>, io.TypeC<{
        function: io.LiteralC<"mintBatch">;
        mints: io.ArrayC<io.IntersectionC<[io.PartialC<{
            royaltyRate: io.NumberC;
            royalties: io.RecordC<io.StringC, io.NumberC>;
            no: io.NumberC;
            qty: io.StringC;
            suffix: io.StringC;
        }>, io.TypeC<{
            suffix: io.StringC;
        }>]>>;
    }>, io.TypeC<{
        function: io.LiteralC<"burn">;
        tokenId: io.StringC;
    }>, io.TypeC<{
        function: io.LiteralC<"settings">;
        settings: io.IntersectionC<[io.PartialC<{
            allowFreeTransfer: io.BooleanC;
            paused: io.BooleanC;
            communityChest: io.StringC;
            contractOwners: io.ArrayC<io.StringC>;
            contractSuperOwners: io.ArrayC<io.StringC>;
            settingsOwnersPermissions: io.ArrayC<io.StringC>;
            foreignContracts: io.ArrayC<io.StringC>;
        }>, io.RecordC<io.StringC, io.UnknownC>]>;
    }>, io.TypeC<{
        function: io.LiteralC<"foreignInvoke">;
        target: io.StringC;
        invocationId: io.StringC;
    }>]>>;
}>;
export declare const InputCodec: io.UnionC<[io.UnionC<[io.TypeC<{
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
}>, io.IntersectionC<[io.TypeC<{
    target: io.StringC;
}>, io.PartialC<{
    from: io.StringC;
    tokenId: io.StringC;
    qty: io.StringC;
    no: io.NumberC;
    price: io.StringC;
}>]>]>, io.TypeC<{
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
}>, io.TypeC<{
    function: io.LiteralC<"transferRoyalties">;
    target: io.StringC;
    tokenId: io.StringC;
    qty: io.NumberC;
}>, io.IntersectionC<[io.TypeC<{
    function: io.LiteralC<"mint">;
}>, io.PartialC<{
    royaltyRate: io.NumberC;
    royalties: io.RecordC<io.StringC, io.NumberC>;
    no: io.NumberC;
    qty: io.StringC;
    suffix: io.StringC;
}>]>, io.TypeC<{
    function: io.LiteralC<"mintBatch">;
    mints: io.ArrayC<io.IntersectionC<[io.PartialC<{
        royaltyRate: io.NumberC;
        royalties: io.RecordC<io.StringC, io.NumberC>;
        no: io.NumberC;
        qty: io.StringC;
        suffix: io.StringC;
    }>, io.TypeC<{
        suffix: io.StringC;
    }>]>>;
}>, io.TypeC<{
    function: io.LiteralC<"burn">;
    tokenId: io.StringC;
}>, io.TypeC<{
    function: io.LiteralC<"settings">;
    settings: io.IntersectionC<[io.PartialC<{
        allowFreeTransfer: io.BooleanC;
        paused: io.BooleanC;
        communityChest: io.StringC;
        contractOwners: io.ArrayC<io.StringC>;
        contractSuperOwners: io.ArrayC<io.StringC>;
        settingsOwnersPermissions: io.ArrayC<io.StringC>;
        foreignContracts: io.ArrayC<io.StringC>;
    }>, io.RecordC<io.StringC, io.UnknownC>]>;
}>, io.TypeC<{
    function: io.LiteralC<"foreignInvoke">;
    target: io.StringC;
    invocationId: io.StringC;
}>]>, io.TypeC<{
    function: io.LiteralC<"transactionBatch">;
    inputs: io.ArrayC<io.UnionC<[io.TypeC<{
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
    }>, io.IntersectionC<[io.TypeC<{
        target: io.StringC;
    }>, io.PartialC<{
        from: io.StringC;
        tokenId: io.StringC;
        qty: io.StringC;
        no: io.NumberC;
        price: io.StringC;
    }>]>]>, io.TypeC<{
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
    }>, io.TypeC<{
        function: io.LiteralC<"transferRoyalties">;
        target: io.StringC;
        tokenId: io.StringC;
        qty: io.NumberC;
    }>, io.IntersectionC<[io.TypeC<{
        function: io.LiteralC<"mint">;
    }>, io.PartialC<{
        royaltyRate: io.NumberC;
        royalties: io.RecordC<io.StringC, io.NumberC>;
        no: io.NumberC;
        qty: io.StringC;
        suffix: io.StringC;
    }>]>, io.TypeC<{
        function: io.LiteralC<"mintBatch">;
        mints: io.ArrayC<io.IntersectionC<[io.PartialC<{
            royaltyRate: io.NumberC;
            royalties: io.RecordC<io.StringC, io.NumberC>;
            no: io.NumberC;
            qty: io.StringC;
            suffix: io.StringC;
        }>, io.TypeC<{
            suffix: io.StringC;
        }>]>>;
    }>, io.TypeC<{
        function: io.LiteralC<"burn">;
        tokenId: io.StringC;
    }>, io.TypeC<{
        function: io.LiteralC<"settings">;
        settings: io.IntersectionC<[io.PartialC<{
            allowFreeTransfer: io.BooleanC;
            paused: io.BooleanC;
            communityChest: io.StringC;
            contractOwners: io.ArrayC<io.StringC>;
            contractSuperOwners: io.ArrayC<io.StringC>;
            settingsOwnersPermissions: io.ArrayC<io.StringC>;
            foreignContracts: io.ArrayC<io.StringC>;
        }>, io.RecordC<io.StringC, io.UnknownC>]>;
    }>, io.TypeC<{
        function: io.LiteralC<"foreignInvoke">;
        target: io.StringC;
        invocationId: io.StringC;
    }>]>>;
}>]>;
export declare type Input = io.TypeOf<typeof InputCodec>;
export declare type ReadonlysResult = NameResult | TickerResult | BalanceResult | RoyaltiesResult | OwnerResult | IsApprovedForallResult;
