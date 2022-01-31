import { BalanceInput, OwnerInput, RoyaltiesInput, TickerInput } from "@/handlers/readonlys";
import { IsApprovedForAllInput, SetApprovalForAllInput } from "@/handlers/approval";
import { TransferBatchInput, TransferInput, TransferRoyaltiesInput } from "@/handlers/transfer";
import { MintInput } from "@/handlers/mint";
import { SettingsInput } from "@/handlers/settings";
import { ForeignInvokeInput } from "@/handlers/foreignInvoke";

export type Input =
    | { function: "name" }
    | TickerInput
    | BalanceInput
    | RoyaltiesInput
    | OwnerInput
    | IsApprovedForAllInput
    | SetApprovalForAllInput
    | TransferInput
    | TransferBatchInput
    | TransferRoyaltiesInput
    | TransferRoyaltiesInput
    | MintInput
    | SettingsInput
    | ForeignInvokeInput;

export {
    BalanceInput,
    balance,
    TickerInput,
    ticker,
    OwnerInput,
    owner,
    royalties,
    RoyaltiesInput,
} from "@/handlers/readonlys";
export {
    isApprovedForAll,
    IsApprovedForAllInput,
    setApprovalForAll,
    SetApprovalForAllInput,
} from "@/handlers/approval";
export {
    transfer,
    transferBatch,
    transferRoyalties,
    TransferRoyaltiesInput,
    TransferBatchInput,
    TransferInput,
} from "@/handlers/transfer";
export { mint, MintInput } from "@/handlers/mint";
export { settings, SettingsInput } from "@/handlers/settings";
export { foreignInvoke, ForeignInvokeInput } from "@/handlers/foreignInvoke";

// export type HandlerName = Pick<Input, "function">["function"];
