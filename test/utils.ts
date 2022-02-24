import Arweave from "arweave";

import { UNIT } from "@/consts";

const arweave = Arweave.init({});

export async function generateAddress(): Promise<string> {
    return await arweave.wallets.getAddress(await arweave.wallets.generate());
}

export function divideShare(count: number): number[] {
    const shareInt = Math.floor(UNIT / count);
    const shares = Array(count).fill(shareInt);
    shares[shares.length - 1] = UNIT - shareInt * (count - 1);

    return shares;
}
