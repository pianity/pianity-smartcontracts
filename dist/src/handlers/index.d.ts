import { BalanceInput, OwnerInput, RoyaltiesInput, TickerInput } from "./readonlys";
import { IsApprovedForAllInput, SetApprovalForAllInput } from "./approval";
import { TransferBatchInput, TransferInput, TransferRoyaltiesInput } from "./transfer";
import { BurnInput, MintBatchInput, MintInput } from "./mint";
import { SettingsInput } from "./settings";
import { ForeignInvokeInput } from "./foreignInvoke";
export * from "./readonlys";
export * from "./approval";
export * from "./transfer";
export * from "./mint";
export * from "./settings";
export * from "./foreignInvoke";
export declare type Input = {
    function: "name";
} | TickerInput | BalanceInput | RoyaltiesInput | OwnerInput | IsApprovedForAllInput | SetApprovalForAllInput | TransferInput | TransferBatchInput | TransferRoyaltiesInput | MintInput | MintBatchInput | BurnInput | SettingsInput | ForeignInvokeInput;
