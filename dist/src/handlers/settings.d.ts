import * as io from "io-ts";
import { State, WriteResult } from "@/contractTypes";
export declare const SettingsInputCodec: io.TypeC<{
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
}>;
export declare type SettingsInput = io.TypeOf<typeof SettingsInputCodec>;
export declare function settings(state: State, caller: string, input: SettingsInput): WriteResult;
