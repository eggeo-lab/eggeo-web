// Arma seed.sql con los clientes, gastos y criterio de reparto del SEED de dashboard.html.
//
//   node scripts/build-seed.mjs [ruta/a/dashboard.html]     (por defecto ../dashboard.html)
//
// seed.sql está en .gitignore: tiene datos reales y el repo es público.
// Usa INSERT OR IGNORE con ids fijos: correrlo de nuevo no duplica ni pisa nada de lo que ya se editó.
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const here = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.resolve(process.argv[2] || path.join(here, "..", "dashboard.html"));
if (!fs.existsSync(source)) {
  console.error(`No encontré ${source}. Pasá la ruta a dashboard.html como argumento.`);
  process.exit(1);
}

// Toma solo el literal `const SEED = { ... };` y lo evalúa aislado (sin acceso a nada más que uid()).
const html = fs.readFileSync(source, "utf8");
const match = html.match(/const SEED = (\{[\s\S]*?\n\});/);
if (!match) {
  console.error("No encontré `const SEED = {...};` en dashboard.html.");
  process.exit(1);
}
const seed = vm.runInNewContext(`(${match[1]})`, { uid: () => "" }, { timeout: 1000 });

const sql = (v) => (typeof v === "number" ? String(v) : `'${String(v).replace(/'/g, "''")}'`);
const rows = [];
let order = 1;
const add = (collection, id, data) => rows.push([collection, id, JSON.stringify(data), order++]);

// Igual que migrations/0002: mes corriente y sin redes elegidas.
const CLIENT_DEFAULTS = { modalidad: "corriente", tiktok: false, facebook: false, instagram: false, googleAds: false };
seed.clients.forEach(({ id, ...data }, i) => add("clients", `seed-c-${String(i + 1).padStart(2, "0")}`, { ...CLIENT_DEFAULTS, ...data }));
// Los gastos del SEED son suscripciones mensuales activas desde 2026-10 (igual que migrations/0001).
seed.expenses.forEach(({ id, ...data }, i) =>
  add("expenses", `seed-e-${String(i + 1).padStart(2, "0")}`, { tipo: "mensual", desde: "2026-10", hasta: "", mes: "", ...data }),
);
if (seed.reparto) add("settings", "main", { reparto: seed.reparto });

const out = [
  "-- Generado por scripts/build-seed.mjs desde dashboard.html. No commitear.",
  ...rows.map(
    ([collection, id, data, created]) =>
      `INSERT OR IGNORE INTO records (collection, id, data, deleted, created_at, updated_at, updated_by) VALUES (${[collection, id, data, 0, created, created, "seed"].map(sql).join(", ")});`,
  ),
  "",
].join("\n");

const target = path.join(here, "seed.sql");
fs.writeFileSync(target, out);
console.log(`seed.sql: ${seed.clients.length} clientes, ${seed.expenses.length} gastos, reparto "${seed.reparto}".`);
