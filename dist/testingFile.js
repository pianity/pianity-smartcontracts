"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UNIT = 1e6;
function shareRoyaltiesRandomly(shareholders) {
    const royalties = {};
    let shared = 0;
    for (let i = 0; i < shareholders; i++) {
        let share;
        if (i < shareholders - 1) {
            share = (UNIT - shared) * Math.random();
        }
        else {
            share = UNIT - shared;
        }
        share = Math.floor(share);
        shared += share;
        royalties[`shareholder-${i}`] = share;
    }
    return royalties;
}
function computeSum(array) {
    return array.reduce((a, b) => a + b, 0);
}
// function checkSum(royalties: number[]) {
//     const sum = sum(royalties);
//
//     console.log("sum:", sum);
//
//     if (sum !== UNIT) {
//         throw new Error(`Royalties are not valid: ${sum}`);
//     }
// }
// function diluteRoyalties(royalties: number[], dilution: number) {
//     for (let i = 0; i < royalties.length; i++) {
//         royalties[i] = Math.round(royalties[i] * dilution);
//     }
// }
//
// function addPianityRoyalties(royalties: number[]) {
//     const pianity1 = UNIT * 0.1;
//     const pianity2 = UNIT * 0.1;
//
//     royalties.push(pianity1, pianity2);
//
//     const sumDiff = UNIT - computeSum(royalties);
//
//     if (Math.abs(sumDiff) < 10) {
//         royalties[0] += sumDiff;
//     } else {
//         throw new Error(`Royalties are not valid: ${sumDiff}`);
//     }
// }
function diluteRoyalties(royalties, dilution) {
    for (const [key, value] of Object.entries(royalties)) {
        royalties[key] = Math.round(value * dilution);
    }
}
function addPianityRoyalties(royalties) {
    royalties.pianity = UNIT * 0.1;
    royalties.treasury = UNIT * 0.1;
    const sumDiff = UNIT - computeSum(Object.values(royalties));
    if (Math.abs(sumDiff) < 10) {
        royalties.treasury += sumDiff;
    }
    else {
        throw new Error(`Royalties are not valid: ${sumDiff}`);
    }
}
for (let i = 0; i < 1; i++) {
    const royalties = shareRoyaltiesRandomly(10);
    console.log(royalties);
    diluteRoyalties(royalties, 0.8);
    addPianityRoyalties(royalties);
    console.log(royalties);
    const sum = computeSum(Object.values(royalties));
    if (sum !== UNIT) {
        throw new Error(`Royalties are not valid: ${sum}`);
    }
}
// const royalties = shareRoyaltiesRandomly(5);
// console.log("royalties sum:", computeSum(royalties));
// const diluted = diluteRoyalties(royalties, 0.8);
// diluted.push(UNIT * 0.1);
// diluted.push(UNIT * 0.1);
// console.log("diluted sum:", computeSum(diluted));
// const royalties = [1000000
// // eslint-disable-next-line
// import getHandle from "./../build/erc1155.norm";
// // import getHandle from "./../build/erc1155.norm.wotx";
//
// const arweave = Arweave.init({});
// const handle = getHandle([
//     new SmartWeaveGlobal(arweave, { id: "", owner: "" }),
//     BigNumber,
//     null,
//     console.log,
// ]);
// ----------------
// type Test = {
//     a?: boolean;
//     b?: string;
// };
//
// // const test= {
// //     sdgf: "a"
// // } as Test;
// const settings: SettingsInput = {
//     function: "settings",
//     settings: {
//         b: "a",
//     },
// } as SettingsInput;
//
// checkInput(SettingsInputCodec, settings);
// 00000000000000000000000
// type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void
//     ? I
//     : never;
//
// function fill<T, B>(descriminant: keyof T, keys: Partial<T & UnionToIntersection<B>>, input: T) {
//     const base: Partial<T> = {};
//     const keysEntries = Object.entries<any>(keys);
//     // const inputEntries = Object.entries<any>(keys);
//
//     for (const [key, value] of keysEntries) {
//         const keyy = key as keyof T;
//         base[keyy] = value;
//     }
//
//     return base;
// }
//
// type unioned = UnionToIntersection<TransferInput>;
//
// const input: TransferInput = {
//     function: "transfer",
//     no: 1,
//     price: "123",
//     tokenId: "abc",
//     target: "target",
// };
//
// const test = fill<typeof input, TransferInput>(
//     "tokenId",
//     { no: 123, price: "123", qty: "1" },
//     input,
// );
//
// console.log(test);
// const arweave = Arweave.init({});
// (async () => {
//     for (let i = 0; i < 10; i++) {
//         console.log(await arweave.wallets.getAddress(await arweave.wallets.generate()));
//     }
// })();
// const uniqueAmount = 1;
// const legendaryAmount = 10;
// const epicAmount = 100;
// const rareAmount = 1000;
//
// const unique = 0;
// const legendary = unique + 10;
// const epic = legendary + 100;
// const rare = epic + 1000;
//
// const total = unique + legendary + epic + rare;
//
// const edition = legendary;
// const editionIndex = 2;
// const nftIndex = total + editionIndex - total;
//
// if (nftIndex < edition || nftIndex > total - edition) {
//     throw new Error("editionIndex cannot exceed edition");
// }
//
// console.log(nftIndex);
// -----------------------------------------------
// const test: a.contractTypes.Settings = {};
// const no: BigNumber = new BigNumber("1000000009999999991293192399123");
// const nb = new BigNumber("");
// console.log(no.lt(nb), no < nb);
// const noSer = JSON.stringify(no);
// console.log(noSer);
// const noDeser = JSON.parse(noSer);
// console.log(noDeser);
// import { isLeft, isRight } from "fp-ts/lib/Either";
// import * as io from "io-ts";
// import { PathReporter } from "io-ts/PathReporter";
// import { checkInput } from "./utils";
//
// const SettingsCodec = io.type({
//     function: io.literal("settings"),
//     settings: io.intersection([
//         io.type({
//             primaryRate: io.number,
//             secondaryRate: io.number,
//             royaltyRate: io.number,
//
//             allowFreeTransfer: io.boolean,
//             paused: io.boolean,
//
//             communityChest: io.string,
//
//             contractOwners: io.array(io.string),
//             contractSuperOwners: io.array(io.string),
//             foreignContracts: io.array(io.string),
//         }),
//         io.record(io.string, io.unknown),
//     ]),
// });
//
// const inputDecoded = SettingsCodec.decode({
//     function: "settings",
//     settings: {
//         primaryRate: 1,
//         secondaryRate: 1,
//         royaltyRate: 1,
//
//         allowFreeTransfer: false,
//         paused: false,
//
//         // communityChest: "a",
//
//         contractOwners: [],
//         contractSuperOwners: [],
//         foreignContracts: [],
//     },
// });
// if (isLeft(inputDecoded)) {
//     console.log(PathReporter.report(inputDecoded).join("\n"));
// }
//
// // const OptionalTransferInput = t.partial({
// //     from: t.string,
// //     tokenId: t.string,
// //     qty: t.number,
// //     no: t.number,
// //     price: t.number,
// // });
// //
// // const TransferInput3 = t.intersection([RequiredTransferInput, OptionalTransferInput]);
// //
// // type TransferInput2 = t.TypeOf<typeof TransferInput3>;
// //
// // const test = {
// //     function: "transfer",
// //     target: "123",
// // };
// // // console.log(TransferInput3.is(test));
// // const testDecoded = TransferInput3.decode(test);
// // if (isLeft(testDecoded)) {
// //     for (const msg of PathReporter.report(testDecoded)) {
// //         console.log(msg);
// //     }
// // } else {
// //     console.log("decoded:", testDecoded);
// // }
