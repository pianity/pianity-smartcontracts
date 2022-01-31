import { ContractAssert } from "@/externals";
import { State, Settings, WriteResult } from "@/erc1155";
import { hasOwnProperty } from "@/utils";

export type SettingsInput = {
    function: "settings";
    settings: Settings;
};

export function settings(state: State, caller: string, input: SettingsInput): WriteResult {
    const { settings: untrustedSettings } = input;
    const { contractSuperOwners, contractOwners } = state.settings;

    ContractAssert(untrustedSettings, "No settings specified");

    ContractAssert(
        contractSuperOwners.includes(caller) || contractOwners.includes(caller),
        "Caller is not authorized to edit contract settings",
    );

    ContractAssert(
        contractSuperOwners.includes(caller) ||
            !(
                contractOwners.includes(caller) &&
                (untrustedSettings.contractSuperOwners || untrustedSettings.contractOwners)
            ),
        "Caller is not Super Owner",
    );

    sanitizeSettings(state.settings, untrustedSettings);

    ContractAssert(
        untrustedSettings.contractSuperOwners.length > 0,
        "Can't delete all the Super Owners",
    );

    state.settings = { ...state.settings, ...untrustedSettings };

    return { state };
}

function sanitizeSettings(settings: Settings, untrustedSettings: Settings) {
    const untrustedAny = untrustedSettings as any;

    for (const key of Object.keys(untrustedAny)) {
        const untrustedType = typeof untrustedAny[key];
        const stateType = typeof settings[key as keyof Settings];
        const settingsHasKey = hasOwnProperty(settings, key);

        ContractAssert(
            !settingsHasKey || (settingsHasKey && untrustedType === stateType),
            `Type of ${key} (${untrustedType}) doesn't match with ${stateType}`,
        );
    }
}
