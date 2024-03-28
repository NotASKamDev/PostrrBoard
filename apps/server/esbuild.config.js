import { build as esbuild } from "esbuild";


export default async function build(){

    return await esbuild({
        entryPoints: ["src/index.ts"],
        outdir: "dist",
        color: true,
        format: "esm",
        bundle: true,
        platform: "node",
        tsconfig: "tsconfig.json",
        packages: "external",
        charset: "utf8",
        sourcemap: true,
    })
}
