import { ContractError } from "?/ContractTestingEnv";
import test from "?/erc1155/context";
import { generateAddress } from "?/utils";
import { TransferInput } from "@/handlers";

test("transfer 1 pty", async (t) => {
    const { apiAddress } = t.context;
    const contract = t.context.createContract();

    const randomUser = await generateAddress();

    await contract.interact(apiAddress, {
        function: "transfer",
        target: randomUser,
        qty: 1,
    });

    const balance = contract.readState().tokens.PTY.balances[randomUser];

    t.assert(balance === 1);
});

test("wrongly typed input field should throw", async (t) => {
    await t.throwsAsync(
        async () => {
            const { apiAddress } = t.context;
            const contract = t.context.createContract();

            const randomUser = await generateAddress();

            await contract.interact(apiAddress, {
                function: "transfer",
                target: randomUser,
                qty: "a",
            } as unknown as TransferInput);
        },
        { instanceOf: ContractError },
    );
});

// test("royalties", async (t) => {
//     const { apiAddress } = t.context;
//     const contract = t.context.createContract();
//
//     const randomUser = await generateAddress();
//
//     await contract.interact(apiAddress, {
//         function: "transfer",
//         target: randomUser,
//         qty: 1,
//     });
//
//     await contract.interact(apiAddress, {
//         function: "royalties",
//     });
//
//     t.assert(contract.readState().tokens.PTY.balances[randomUser] === 1);
// });
