import * as io from "io-ts";

import { ContractAssert, _log } from "@/externals";
import { State, Settings, WriteResult, SettingsCodec, SettingsKnownProps } from "@/contractTypes";
import { checkInput } from "@/utils";

export const SettingsInputCodec = io.type({
    function: io.literal("settings"),
    settings: io.intersection([io.partial(SettingsKnownProps), io.record(io.string, io.unknown)]),
});

export type SettingsInput = io.TypeOf<typeof SettingsInputCodec>;

function findUnallowedChange(
    permissions: Settings["settingsOwnersPermissions"],
    inputSettings: SettingsInput["settings"],
): string | null {
    for (const key of Object.keys(inputSettings)) {
        if (!permissions.includes(key)) {
            return key;
        }
    }

    return null;
}

export function settings(state: State, caller: string, input: SettingsInput): WriteResult {
    const { settings: inputSettings } = checkInput(SettingsInputCodec, input);
    const { contractSuperOwners, contractOwners } = state.settings;
    const callerIsSuper = contractSuperOwners.includes(caller);
    const callerIsOwner = contractOwners.includes(caller);

    ContractAssert(inputSettings, "settings: No settings specified");

    ContractAssert(
        callerIsSuper || callerIsOwner,
        "settings: Only Super Owners and Owners are allowed to edit contract settings",
    );

    ContractAssert(
        callerIsSuper ||
            !(
                inputSettings.contractSuperOwners ||
                inputSettings.contractOwners ||
                inputSettings.settingsOwnersPermissions
            ),
        "settings: Only Super Owners are allowed to edit `contractSuperOwners`, `contractOwners` " +
            "and `contractOwnersPermissions`",
    );

    ContractAssert(
        !inputSettings.contractSuperOwners || inputSettings.contractSuperOwners.length > 0,
        "settings: Can't delete all the Super Owners",
    );

    if (!callerIsSuper) {
        const unallowedChange = findUnallowedChange(
            state.settings.settingsOwnersPermissions,
            inputSettings,
        );

        ContractAssert(
            unallowedChange === null,
            `settings: Owners are not allowed to change \`${unallowedChange}\``,
        );
    }

    const newSettings = checkInput(SettingsCodec, { ...state.settings, ...inputSettings });

    state.settings = newSettings;

    return { state };
}
