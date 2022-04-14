import BigNumber from "bignumber.js";

import { ExecutionContext } from "ava";
import ContractTestingEnv, { InteractionError } from "?/ContractTestingEnv";
import test, { Context } from "?/erc1155/context";
import * as m from "?/erc1155/mocks";
import { divideShare } from "?/utils";

import { BalanceResult, Input, TransferInput } from "@/handlers";
import { UNIT } from "@/consts";
import { State } from "@/contractTypes";

async function getBalance(
    contract: ContractTestingEnv<State, Input>,
    balanceMethod: "balance" | "totalBalance" | "vaultBalance",
    target: string,
): Promise<string> {
    const { balance } = (
        await contract.interact(target, {
            function: balanceMethod,
        })
    ).result as BalanceResult;

    return balance;
}

function dbg<E extends ExecutionContext<unknown>, T>(log: E["log"], value: T): T {
    log("DEBUG", value);
    return value;
}

test("lock and unlock some pty", async (t) => {
    const { owner: apiAddress, createContract } = t.context;
    const contract = createContract(t);

    const user = m.USER1;

    await contract.interact(apiAddress, {
        function: "transfer",
        target: user,
        qty: "10",
    });

    t.assert((await getBalance(contract, "balance", user)) === "10");

    await contract.interact(user, {
        function: "lock",
        tokenId: "PTY",
        qty: "5",
        lockLength: 6,
    });

    t.assert((await getBalance(contract, "vaultBalance", user)) === "5");
    t.assert((await getBalance(contract, "totalBalance", user)) === "10");
    t.assert((await getBalance(contract, "balance", user)) === "5");

    await contract.interact(user, { function: "unlock" });

    t.assert((await getBalance(contract, "balance", user)) === "5");

    await contract.interact(user, { function: "unlock" });

    t.assert((await getBalance(contract, "balance", user)) === "10");
    t.assert((await getBalance(contract, "vaultBalance", user)) === "0");
});

test("transferLocked some pty", async (t) => {
    const { owner: apiAddress, createContract } = t.context;
    const contract = createContract(t);

    const user = m.USER1;

    await contract.interact(apiAddress, {
        function: "transferLocked",
        tokenId: "PTY",
        target: user,
        qty: "10",
        lockLength: 6,
    });

    t.assert((await getBalance(contract, "balance", user)) === "0");
    t.assert((await getBalance(contract, "vaultBalance", user)) === "10");
    t.assert((await getBalance(contract, "totalBalance", user)) === "10");

    await contract.interact(user, { function: "unlock" });

    t.assert((await getBalance(contract, "balance", user)) === "0");

    await contract.interact(user, { function: "unlock" });

    t.assert((await getBalance(contract, "balance", user)) === "10");
    t.assert((await getBalance(contract, "vaultBalance", user)) === "0");
});

test("transferLocked with increaseVault", async (t) => {
    const { owner: apiAddress, createContract } = t.context;
    const contract = createContract(t);

    const user = m.USER1;

    await contract.interact(apiAddress, {
        function: "transferLocked",
        tokenId: "PTY",
        target: user,
        qty: "10",
        lockLength: 2,
    });

    await contract.interact(user, {
        function: "increaseVault",
        id: 0,
        lockLength: 6,
    });

    t.assert((await getBalance(contract, "balance", user)) === "0");
    t.assert((await getBalance(contract, "vaultBalance", user)) === "10");
    t.assert((await getBalance(contract, "totalBalance", user)) === "10");

    await contract.interact(user, { function: "unlock" });

    t.assert((await getBalance(contract, "balance", user)) === "0");

    await contract.interact(user, { function: "unlock" });

    t.assert((await getBalance(contract, "balance", user)) === "10");
    t.assert((await getBalance(contract, "vaultBalance", user)) === "0");
});
