import * as io from "io-ts";

import { ERR_INTEGER, ERR_NOTOKENID, PST } from "@/consts";
import { State, Token, WriteResult } from "@/contractTypes";
import { ContractAssert, SmartWeave, BigNumber } from "@/externals";
import { checkRoyalties, addTokenTo } from "@/handlers/transfer";
import { checkInput } from "@/utils";

export const SingleMintCodec = io.intersection([
    io.type({
        royaltyRate: io.number,
    }),
    io.partial({
        royalties: io.record(io.string, io.number),
        qty: io.string,
        no: io.number,
        suffix: io.string,
    }),
]);

export const MintInputCodec = io.intersection([
    io.type({ function: io.literal("mint") }),
    SingleMintCodec,
]);
export type MintInput = io.TypeOf<typeof MintInputCodec>;

export function mint(state: State, caller: string, input: MintInput): WriteResult {
    const { royalties, royaltyRate, qty, no, suffix } = checkInput(MintInputCodec, input);
    const { contractOwners } = state.settings;

    ContractAssert(contractOwners.includes(caller), "mint: `caller` is not authorized to mint");
    ContractAssert(
        (qty && !no) || (!qty && no),
        "mint: Either `qty` or `no` must be set (not simultaneously)",
    );
    ContractAssert(!suffix || !qty, "mint: `suffix` and `qty` cannot be set simuntaneously");

    const tokenId = getTokenId(suffix);

    ContractAssert(!(tokenId in state.tokens), `mint: \`tokenId\` already exists: "${tokenId}".`);

    if (royalties) {
        checkRoyalties(royalties);
    }

    const token: Token = {
        ticker: `${PST}${state.nonce}`,
        royalties,
        balances: {},
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

export const MintBatchInputCodec = io.type({
    function: io.literal("mintBatch"),
    mints: io.array(
        io.intersection([
            SingleMintCodec,
            io.type({ suffix: SingleMintCodec.types[1].props.suffix }),
        ]),
    ),
});
export type MintBatchInput = io.TypeOf<typeof MintBatchInputCodec>;

export function mintBatch(state: State, caller: string, input: MintBatchInput): WriteResult {
    const { mints } = checkInput(MintBatchInputCodec, input);

    for (const mintInput of mints) {
        mint(state, caller, { function: "mint", ...mintInput });
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

function getTokenId(suffix?: string): string {
    let tokenId = SmartWeave.transaction.id;

    ContractAssert(tokenId, "mint: Couldn't get the transaction id via SmartWeave global");

    const effectiveSuffix = suffix?.trim();

    if (effectiveSuffix && effectiveSuffix.length > 0) {
        tokenId = `${suffix}${tokenId}`;
    }

    return tokenId;
}
