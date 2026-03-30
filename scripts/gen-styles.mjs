import { readFileSync, writeFileSync } from "node:fs"

const css = readFileSync("dist/fix-it-bot.css", "utf8")
const out = `// Auto-generated — do not edit\nexport const cssText = ${JSON.stringify(css)};\n`
writeFileSync("src/lib/__styles.generated.ts", out)
console.log("Generated src/lib/__styles.generated.ts")
