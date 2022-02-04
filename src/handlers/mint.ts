import * as io from "io-ts";

import { ERR_INTEGER, ERR_NOTOKENID, PST } from "@/consts";
import { State, Token, WriteResult } from "@/contractTypes";
import { ContractAssert, Smartweave } from "@/externals";
import { checkRoyalties, addTokenTo } from "@/handlers/transfer";
import { checkInput } from "@/utils";

export const MintInputCodec = io.type({
    function: io.literal("mint"),
    royalties: io.record(io.string, io.number),
    qty: io.number,
    no: io.number,
});
export type MintInput = io.TypeOf<typeof MintInputCodec>;

export function mint(state: State, caller: string, input: MintInput): WriteResult {
    checkInput(MintInputCodec, input);

    const { royalties, qty, no } = input;
    const { contractOwners } = state.settings;

    const tokenId = Smartweave.transaction.id;

    ContractAssert(contractOwners.includes(caller), "Caller is not authorized to mint");
    ContractAssert(tokenId, ERR_NOTOKENID);
    ContractAssert((qty && !no) || (!qty && no), "qty and no can't be set simultaneously");

    mintToken(state, tokenId, royalties, qty, no);

    return { state };
}

function mintToken(
    state: State,
    tokenId: string,
    royalties?: Record<string, number>,
    qty?: number,
    no?: number,
) {
    ContractAssert(!(tokenId in state.tokens), `tokenId already exists: "${tokenId}".`);

    if (royalties) {
        checkRoyalties(royalties);
    }

    const token: Token = {
        ticker: `${PST}${state.nonce}`,
        royalties,
        balances: {},
    };
    state.nonce++;
    state.tokens[tokenId] = token;

    if (no) {
        // is an NFT
        ContractAssert(Number.isInteger(no), ERR_INTEGER);
        token.owners = Array(no).fill("");
        addTokenTo(state, "", tokenId, no);
    } else if (qty) {
        // is a token
        addTokenTo(state, "", tokenId, qty);
    }
}
