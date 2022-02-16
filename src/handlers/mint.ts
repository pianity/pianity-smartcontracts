import * as io from "io-ts";

import { ERR_INTEGER, ERR_NOTOKENID, PST } from "@/consts";
import { State, Token, WriteResult } from "@/contractTypes";
import { ContractAssert, SmartWeave, BigNumber } from "@/externals";
import { checkRoyalties, addTokenTo } from "@/handlers/transfer";
import { checkInput } from "@/utils";

export const MintInputCodec = io.intersection([
    io.type({
        function: io.literal("mint"),
        primaryRate: io.number,
        secondaryRate: io.number,
        royaltyRate: io.number,
    }),
    io.partial({
        royalties: io.record(io.string, io.number),
        qty: io.string,
        no: io.number,
    }),
]);
export type MintInput = io.TypeOf<typeof MintInputCodec>;

export function mint(state: State, caller: string, input: MintInput): WriteResult {
    const { royalties, primaryRate, secondaryRate, royaltyRate, qty, no } = checkInput(
        MintInputCodec,
        input,
    );
    const { contractOwners } = state.settings;

    const tokenId = SmartWeave.transaction.id;

    ContractAssert(contractOwners.includes(caller), "Caller is not authorized to mint");
    ContractAssert(tokenId, ERR_NOTOKENID);
    ContractAssert((qty && !no) || (!qty && no), "qty and no can't be set simultaneously");

    ContractAssert(!(tokenId in state.tokens), `tokenId already exists: "${tokenId}".`);

    if (royalties) {
        checkRoyalties(royalties);
    }

    const token: Token = {
        ticker: `${PST}${state.nonce}`,
        royalties,
        balances: {},
        primaryRate,
        secondaryRate,
        royaltyRate,
    };
    state.nonce++;
    state.tokens[tokenId] = token;

    if (no) {
        // is an NFT
        ContractAssert(Number.isInteger(no), ERR_INTEGER);
        token.owners = Array(no).fill("");
        addTokenTo(state, "", tokenId, new BigNumber(no));
    } else if (qty) {
        // is a token
        addTokenTo(state, "", tokenId, new BigNumber(qty));
    }

    return { state };
}

export const BurnInputCodec = io.type({
    function: io.literal("burn"),
    tokenId: io.string,
});
export type BurnInput = io.TypeOf<typeof BurnInputCodec>;

export function burn(state: State, caller: string, input: BurnInput): WriteResult {
    const { tokenId } = checkInput(BurnInputCodec, input);
    const { contractSuperOwners } = state.settings;

    ContractAssert(state.tokens[tokenId], "burn: `tokenId` doesn't exist");
    ContractAssert(contractSuperOwners.includes(caller), "burn: `caller` isn't a super owner");

    delete state.tokens[tokenId];

    return { state };
}
