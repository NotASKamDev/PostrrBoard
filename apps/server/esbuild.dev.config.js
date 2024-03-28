import build from './esbuild.config.js'

const formatter = Intl.DateTimeFormat(Intl.DateTimeFormat().resolvedOptions().locale, {
    hour: "2-digit",
    hour12: true,
    minute: "2-digit",
    second:"2-digit",
    hourCycle:"h12"
})

console.log(`[esbuild][${formatter.format(Date.now())}] Running build...`)
console.time("build")
const result = await build()
console.timeEnd("build")
console.log(`[esbuild][${formatter.format(Date.now())}] Build operation completed with the following:`)
console.log(JSON.stringify(result, undefined, "    "))
console.log(`[server][${formatter.format(Date.now())}] Starting server...`)