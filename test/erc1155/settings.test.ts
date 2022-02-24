import { InteractionError } from "?/ContractTestingEnv";
import test from "?/erc1155/context";

import { Input } from "@/handlers";

test("throws: setting a field with an invalid type", async (t) => {
    const { superOwner, createContract } = t.context;
    const contract = createContract(t);

    await t.throwsAsync(
        contract.interact(superOwner, {
            function: "settings",
            settings: {
                allowFreeTransfer: "wrong value",
            },
        } as unknown as Input),
        { instanceOf: InteractionError },
    );
});

test("changes the field: setting a field with a valid type", async (t) => {
    const { superOwner, createContract } = t.context;
    const contract = createContract(t);

    const newFieldValue = !contract.readState().settings.allowFreeTransfer;

    await contract.interact(superOwner, {
        function: "settings",
        settings: {
            allowFreeTransfer: newFieldValue,
        },
    });

    t.assert(contract.readState().settings.allowFreeTransfer === newFieldValue);
});

test("set a new field", async (t) => {
    const { superOwner, createContract } = t.context;
    const contract = createContract(t);

    const nonExistentField = Math.random().toString().slice(-5);

    await contract.interact(superOwner, {
        function: "settings",
        settings: {
            [nonExistentField]: true,
        },
    });

    t.assert(contract.readState().settings[nonExistentField] === true);
});

test("throws: try to change unallowed settings", async (t) => {
    const { owner, createContract } = t.context;
    const contract = createContract(t);

    const nonExistentField = Math.random().toString();

    await t.throwsAsync(
        contract.interact(owner, {
            function: "settings",
            settings: {
                [nonExistentField]: true,
            },
        }),
        { instanceOf: InteractionError },
    );
});

test("throws: set a known setting to `undefined`", async (t) => {
    const { superOwner, createContract } = t.context;
    const contract = createContract(t);

    await t.throwsAsync(
        contract.interact(superOwner, {
            function: "settings",
            settings: {
                allowFreeTransfer: undefined,
            },
        }),
        { instanceOf: InteractionError },
    );
});

test("change a permission", async (t) => {
    const { superOwner, owner, createContract } = t.context;
    const contract = createContract(t);

    await contract.interact(superOwner, {
        function: "settings",
        settings: {
            settingsOwnersPermissions: ["paused"],
        },
    });

    await contract.interact(owner, {
        function: "settings",
        settings: {
            paused: false,
        },
    });

    await contract.interact(superOwner, {
        function: "settings",
        settings: {
            settingsOwnersPermissions: [],
        },
    });

    await t.throwsAsync(
        contract.interact(owner, {
            function: "settings",
            settings: {
                paused: false,
            },
        }),
        { instanceOf: InteractionError },
    );
});

test("throws: set permission to `undefined`", async (t) => {
    const { superOwner, createContract } = t.context;
    const contract = createContract(t);

    await t.throwsAsync(
        contract.interact(superOwner, {
            function: "settings",
            settings: {
                settingsOwnersPermissions: undefined,
            },
        }),
        { instanceOf: InteractionError },
    );
});
