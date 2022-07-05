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
exports.SettingsCodec = exports.SettingsKnownProps = void 0;
const io = __importStar(require("io-ts"));
/**
 * Props present in the initial state settings.
 *
 * This is separated from the SettingsCodec definition because it's also used in {@link settings}
 * to make the input codec, which requires a partial version of these props
 */
exports.SettingsKnownProps = {
    allowFreeTransfer: io.boolean,
    paused: io.boolean,
    communityChest: io.string,
    contractOwners: io.array(io.string),
    contractSuperOwners: io.array(io.string),
    settingsOwnersPermissions: io.array(io.string),
    foreignContracts: io.array(io.string),
};
exports.SettingsCodec = io.intersection([
    io.type(exports.SettingsKnownProps),
    io.record(io.string, io.unknown),
]);
