"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.settings = exports.SettingsInputCodec = void 0;
const io = __importStar(require("io-ts"));
const externals_1 = require("../externals");
const contractTypes_1 = require("../contractTypes");
const utils_1 = require("../utils");
exports.SettingsInputCodec = io.type({
    function: io.literal("settings"),
    settings: io.intersection([io.partial(contractTypes_1.SettingsKnownProps), io.record(io.string, io.unknown)]),
});
function findUnallowedChange(permissions, inputSettings) {
    for (const key of Object.keys(inputSettings)) {
        if (!permissions.includes(key)) {
            return key;
        }
    }
    return null;
}
function settings(state, caller, input) {
    const { settings: inputSettings } = (0, utils_1.checkInput)(exports.SettingsInputCodec, input);
    const { contractSuperOwners, contractOwners } = state.settings;
    const callerIsSuper = contractSuperOwners.includes(caller);
    const callerIsOwner = contractOwners.includes(caller);
    (0, externals_1.ContractAssert)(inputSettings, "settings: No settings specified");
    (0, externals_1.ContractAssert)(callerIsSuper || callerIsOwner, "settings: Only Super Owners and Owners are allowed to edit contract settings");
    (0, externals_1.ContractAssert)(callerIsSuper ||
        !(inputSettings.contractSuperOwners ||
            inputSettings.contractOwners ||
            inputSettings.settingsOwnersPermissions), "settings: Only Super Owners are allowed to edit `contractSuperOwners`, `contractOwners` " +
        "and `contractOwnersPermissions`");
    (0, externals_1.ContractAssert)(!inputSettings.contractSuperOwners || inputSettings.contractSuperOwners.length > 0, "settings: Can't delete all the Super Owners");
    if (!callerIsSuper) {
        const unallowedChange = findUnallowedChange(state.settings.settingsOwnersPermissions, inputSettings);
        (0, externals_1.ContractAssert)(unallowedChange === null, `settings: Owners are not allowed to change \`${unallowedChange}\``);
    }
    const newSettings = (0, utils_1.checkInput)(contractTypes_1.SettingsCodec, { ...state.settings, ...inputSettings });
    state.settings = newSettings;
    return { state };
}
exports.settings = settings;
