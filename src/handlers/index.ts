import { BalanceInput, OwnerInput, RoyaltiesInput, TickerInput } from "@/handlers/readonlys";
import { IsApprovedForAllInput, SetApprovalForAllInput } from "@/handlers/approval";
import { TransferBatchInput, TransferInput, TransferRoyaltiesInput } from "@/handlers/transfer";
import { BurnInput, MintBatchInput, MintInput } from "@/handlers/mint";
import { SettingsInput } from "@/handlers/settings";
import { ForeignInvokeInput } from "@/handlers/foreignInvoke";

export * from "@/handlers/readonlys";
export * from "@/handlers/approval";
export * from "@/handlers/transfer";
export * from "@/handlers/mint";
export * from "@/handlers/settings";
export * from "@/handlers/foreignInvoke";

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
    | MintInput
    | MintBatchInput
    | BurnInput
    | SettingsInput
    | ForeignInvokeInput;
