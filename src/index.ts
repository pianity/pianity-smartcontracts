import "module-alias/register";

import { strict as assert } from "node:assert";

import { hasOwnProperty } from "@/utils";

type Settings = {
    primaryRate: number;
    secondaryRate: number;
    royaltyRate: number;

    allowFreeTransfer: boolean;
    paused: boolean;

    communityChest: string;

    contractOwners: string[];
    contractSuperOwners: string[];
    foreignContracts: string[];
};

const stateSettings: Settings = {
    primaryRate: 0,
    secondaryRate: 0,
    royaltyRate: 0,

    allowFreeTransfer: false,
    paused: false,

    communityChest: "",

    contractOwners: [],
    contractSuperOwners: [],
    foreignContracts: [],
};

const bogusAnyBuilding = { ...stateSettings } as any;
bogusAnyBuilding.test = 1;
bogusAnyBuilding.allowFreeTransfer = 1;

const bogusSettings = bogusAnyBuilding as Settings;

function sanitizeSettings(untrustedSettings: Settings) {
    const bogusAny = untrustedSettings as any;

    for (const key of Object.keys(bogusAny)) {
        if (
            !(key in stateSettings) ||
            typeof bogusAny[key] !== typeof stateSettings[key as keyof Settings]
        ) {
            delete bogusAny[key];
        }
    }
}

function sanitizeSettings2(settings: Settings, untrustedSettings: Settings) {
    const untrustedAny = untrustedSettings as any;

    for (const key of Object.keys(untrustedAny)) {
        const untrustedType = typeof untrustedAny[key];
        const realType = typeof settings[key as keyof Settings];

        Object.prototype.hasOwnProperty.call({ test: "a" }, "a");

        assert(
            !hasOwnProperty(settings, key) ||
                (hasOwnProperty(settings, key) && untrustedType === realType),
            `Type of ${key} (${untrustedType}) doesn't match with ${realType}`,
        );
    }
}

sanitizeSettings2(stateSettings, bogusSettings);

const newSettings = { ...stateSettings, ...bogusSettings };

console.log(newSettings);

// type Keys = keyof Settings;
//
// console.log("a" in Keys);
//
// function fun(settings: Settings, name: string) {
//     name = "bobjour";
//     settings.foreignContracts = [];
//
//     for (const key in settings) {
//         console.log(settings[key as keyof Settings]);
//
//         // settings[key as keyof Settings] = ";
//     }
// }

// const key = "primaryRat";
//
// const b = `${key}e`;
//
// console.log("bonjour", settings[b]);
