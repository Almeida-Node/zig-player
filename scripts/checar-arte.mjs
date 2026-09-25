// Lista quais artes oficiais já estão em public/arte e quais ainda faltam.
// Uso: npm run arte
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { ASSETS } from "../src/content/assets.ts";

const root = fileURLToPath(new URL("../public/arte/", import.meta.url));
const rows = Object.entries(ASSETS).map(([id, a]) => ({ id, ...a, ok: existsSync(root + a.file) }));
const missing = rows.filter((r) => !r.ok);

for (const r of rows) console.log(`${r.ok ? "✅" : "⬜"} ${r.file.padEnd(34)} ${r.source}`);
console.log(`\n${rows.length - missing.length}/${rows.length} artes prontas.`);
