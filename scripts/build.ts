import { build, Plugin } from "esbuild";
import { readFile } from "node:fs/promises";
import { replaceInFile } from "replace-in-file";

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
    await unIifeBundle("build/erc1155.js");
})();
