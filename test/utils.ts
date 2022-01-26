import Arweave from "arweave";

const arweave = Arweave.init({});

export async function generateAddress(): Promise<string> {
    return await arweave.wallets.getAddress(await arweave.wallets.generate());
}
