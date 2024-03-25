import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ['src/index.ts'],
    splitting: false,
    sourcemap: true,
    // clean: true,
    bundle: true,
    shims: true,
    cjsInterop: true,
    // dts: true,
    // watch: ["src", "tsup.config.ts"],
    onSuccess: "node dist/index.js",
    format: "esm",
    external: ["mongodb-memory-server"]

})