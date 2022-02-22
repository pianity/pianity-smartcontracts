import { UNIT } from "@/consts";

export const USER1 = "afvYxWIWxvOhIgAxzVF36d1wsNwxoic4wXbjYUhdkyE";
export const USER2 = "gpBBxe2hM5uOMKwuKByfRxCmlH6n9yObboDVM3nfjFo";
export const USER3 = "eNedcFPLnilxCrRybgZD41-QwpkY-L4dSfjOl0kxar0";
export const USER4 = "90v4bGaC6x4l4PovDxCV2J7cpi0ENoPjpO0yXYuZoP8";
export const USER5 = "gbtFMPaMlmuV1mypA8q_17bBZ4oILP9zxvP-E0LImjg";
export const USER6 = "s3iu3trqX1EkgwzjW64P_ewjcdLK-4BonB47sYIRYRc";
export const USER7 = "QotCcUxr6xeX4GKLSfwxCwqSnb6z_aLEVJDOEQ9uv7M";
export const USER8 = "EZ81UE2MSbO1MewqCHC9YOzj__aEiD82Dr9PCwnJB9E";
export const USER9 = "PmorKX_oy2rvg9mc2GCUy-DJXIuaZznhkOFbUWww8Ao";

export const ROYALTIES_4 = {
    [USER1]: UNIT / 4,
    [USER2]: UNIT / 4,
    [USER3]: UNIT / 4,
    [USER4]: UNIT / 4,
};

export const DEFAULT_RATES = {
    primaryRate: 0.15,
    secondaryRate: 0.1,
    royaltyRate: 0.1,
};

export const UNIQUE_MINT = {
    no: 1,
    royalties: ROYALTIES_4,
    ...DEFAULT_RATES,
    suffix: "unique",
};

export const LEGENDARY_MINT = {
    no: 10,
    royalties: ROYALTIES_4,
    ...DEFAULT_RATES,
    suffix: "legendary",
};

export const EPIC_MINT = {
    no: 100,
    royalties: ROYALTIES_4,
    ...DEFAULT_RATES,
    suffix: "epic",
};

export const RARE_MINT = {
    no: 1000,
    royalties: ROYALTIES_4,
    ...DEFAULT_RATES,
    suffix: "rare",
};
