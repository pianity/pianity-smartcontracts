import { build, Plugin } from "esbuild";
import { readFile, writeFile } from "node:fs/promises";
import { normalizeContractSource as normalizeContractSourceRedstone } from "redstone-smartweave";
import { normalizeContractSource as normalizeContractSourceV1 } from "smartweave/lib/utils";
import { replaceInFile } from "replace-in-file";

// TODO: Shouldn't be needed as it should be taken care of by redstone-smartweave and smartweaveV1.
// They don't do it well though, see `normalizeContract();` below
async function unIifeBundle(path: string) {
    const result = await replaceInFile({
        files: path,
        from: [/\(\(\) => {/g, /}\)\(\);/g],
        to: "",
        countMatches: true,
    });

    if (result[0].numMatches !== 2 || result[0].numReplacements !== 2) {
        throw new Error(
            `Something went wrong when un-iifeing "${path}" bundle.` +
                ` Found ${result[0].numMatches} and did ${result[0].numReplacements} instead of 2 and 2`,
        );
    }
}

// TODO: Publish an issue on redstone-smartweave and smartweaveV1 repo to adopt this function
// instead of theirs version
function normalizeContract(src: string) {
    const srcSplit = src.split("\n");

    const firstLine = srcSplit.findIndex((value) => value.trim().length !== 0);
    const lastLine = (() => {
        let index = srcSplit.length - 1;
        for (index; index > 0; index--) {
            if (srcSplit[index].trim().length !== 0) {
                return index;
            }
        }
        return -1;
    })();

    if (firstLine > -1 && lastLine > -1) {
        console.log("hello");
        if (
            (/\(\s*\(\)\s*=>\s*{/g.test(srcSplit[firstLine]) ||
                /\s*\(\s*function\s*\(\)\s*{/g.test(srcSplit[firstLine])) &&
            /}\s*\)\s*\(\)\s*;/g.test(srcSplit[lastLine])
        ) {
            srcSplit.splice(firstLine, 1);
            srcSplit.splice(lastLine - 1, 1);
        }
    }

    src = srcSplit
        .join("\n")
        .replace(/export\s+async\s+function\s+handle/gmu, "async function handle")
        .replace(/export\s+function\s+handle/gmu, "function handle");

    return `
    const [SmartWeave, BigNumber, clarity, logger] = arguments;
    clarity.SmartWeave = SmartWeave;
    class ContractError extends Error { constructor(message) { super(message); this.name = 'ContractError' } };
    function ContractAssert(cond, message) { if (!cond) throw new ContractError(message) };
    ${src};
    return handle;
  `;
}

const removeExternalsImports: Plugin = {
    name: "remove-externals-imports",
    setup({ onLoad }) {
        onLoad({ filter: /\.ts$/ }, async (args) => {
            let code = (await readFile(args.path)).toString();
            code = code.replace(/^import .*".\/externals"/gm, "/* erased */");

            return { contents: code, loader: "default" };
        });
    },
};

(async () => {
    await build({
        entryPoints: ["src/erc1155.ts"],
        outfile: "build/erc1155.js",
        bundle: true,
        minify: false,
        format: "iife",
        plugins: [removeExternalsImports],
    });
})();
