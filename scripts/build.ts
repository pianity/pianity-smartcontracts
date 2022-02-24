import { build, Plugin } from "esbuild";
import { readFile, writeFile } from "node:fs/promises";
import { normalizeContractSource as normalizeContractSourceRedstone } from "redstone-smartweave";
import { normalizeContractSource as normalizeContractSourceV1 } from "smartweave/lib/utils";

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
