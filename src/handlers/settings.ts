import * as io from "io-ts";

import { isLeft } from "fp-ts/lib/Either";
import { PathReporter } from "io-ts/lib/PathReporter";
import { ContractAssert } from "@/externals";
import { State, Settings, WriteResult, SettingsCodec, SettingsKnownProps } from "@/contractTypes";
import { checkInput, hasOwnProperty } from "@/utils";

export const SettingsInputCodec = io.intersection([
    io.type({
        function: io.literal("settings"),
        settings: io.partial(SettingsKnownProps),
    }),
    io.record(io.string, io.unknown),
]);
export type SettingsInput = io.TypeOf<typeof SettingsInputCodec>;

export function settings(state: State, caller: string, input: SettingsInput): WriteResult {
    const { settings: untrustedSettings } = checkInput(SettingsInputCodec, input);
    const { contractSuperOwners, contractOwners } = state.settings;

    ContractAssert(untrustedSettings, "settings: No settings specified");

    ContractAssert(
        contractSuperOwners.includes(caller) || contractOwners.includes(caller),
        "settings: Caller is not authorized to edit contract settings",
    );

    ContractAssert(
        contractSuperOwners.includes(caller) ||
            !(
                contractOwners.includes(caller) &&
                (untrustedSettings.contractSuperOwners || untrustedSettings.contractOwners)
            ),
        "settings: Caller is not Super Owner",
    );

    // TODO: is io-ts able to replace this 100%?
    // sanitizeSettings(state.settings, untrustedSettings);

    ContractAssert(
        !untrustedSettings.contractSuperOwners || untrustedSettings.contractSuperOwners.length > 0,
        "settings: Can't delete all the Super Owners",
    );

    state.settings = { ...state.settings, ...untrustedSettings };

    return { state };
}

// function sanitizeSettings(settings: Settings, untrustedSettings: Settings) {
//     const untrustedAny = untrustedSettings as any;
//
//     for (const key of Object.keys(untrustedAny)) {
//         const untrustedType = typeof untrustedAny[key];
//         const stateType = typeof settings[key as keyof Settings];
//         const settingsHasKey = hasOwnProperty(settings, key);
//
//         ContractAssert(
//             !settingsHasKey || (settingsHasKey && untrustedType === stateType),
//             `Type of ${key} (${untrustedType}) doesn't match with ${stateType}`,
//         );
//     }
// }
