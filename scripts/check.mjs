// Verificación SEO / enlaces del sitio generado en dist/ (correr después de `npm run build`).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const SITE = "https://www.eggeo.com.ar";
const errors = [];
const warns = [];
const err = (f, m) => errors.push(`${f}: ${m}`);

if (!fs.existsSync(dist)) {
  console.error("No existe dist/. Corré `npm run build` primero.");
  process.exit(1);
}

const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
const htmlFiles = walk(dist).filter((f) => f.endsWith(".html"));
const urlOf = (f) => {
  const rel = "/" + path.relative(dist, f).replace(/\\/g, "/");
  return rel.endsWith("/index.html") ? rel.slice(0, -10) : rel;
};
const exists = (p) => {
  const clean = decodeURI(p.split("#")[0].split("?")[0]);
  const fp = path.join(dist, clean);
  return fs.existsSync(fp) && (fs.statSync(fp).isFile() || fs.existsSync(path.join(fp, "index.html")));
};
const attr = (html, re) => [...html.matchAll(re)].map((m) => m[1]);

const titles = new Map();
const descs = new Map();
const canonicals = new Map();
const alternates = new Map();

for (const f of htmlFiles) {
  const html = fs.readFileSync(f, "utf8");
  const url = urlOf(f);
  const is404 = url === "/404.html";
  const name = url;

  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1];
  if (!title) err(name, "sin <title>");
  else {
    if (titles.has(title)) err(name, `title duplicado con ${titles.get(title)}`);
    titles.set(title, name);
    if (title.length > 70) warns.push(`${name}: title de ${title.length} caracteres`);
  }
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1];
  if (!desc) err(name, "sin meta description");
  else {
    if (descs.has(desc)) err(name, `description duplicada con ${descs.get(desc)}`);
    descs.set(desc, name);
    if (desc.length < 50 || desc.length > 170) warns.push(`${name}: description de ${desc.length} caracteres`);
  }
  const lang = (html.match(/<html lang="([^"]+)"/) || [])[1];
  if (!lang || lang.includes("<!--")) err(name, "atributo lang ausente");
  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  if (h1s !== 1) err(name, `${h1s} elementos <h1>`);

  if (!is404) {
    const canonical = (html.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
    if (canonical !== SITE + url) err(name, `canonical ${canonical} ≠ ${SITE + url}`);
    canonicals.set(SITE + url, name);
    const alts = Object.fromEntries([...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)].map((m) => [m[1], m[2]]));
    for (const k of ["es", "en", "x-default"]) if (!alts[k]) err(name, `falta hreflang ${k}`);
    if (alts[lang] !== SITE + url) err(name, `hreflang ${lang} no apunta a sí misma`);
    alternates.set(SITE + url, alts);
  } else if (!html.includes('name="robots" content="noindex"')) err(name, "404 sin noindex");

  for (const block of attr(html, /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const ld = JSON.stringify(JSON.parse(block));
      for (const u of ld.match(/https:\/\/www\.eggeo\.com\.ar\/[^"]+\.(?:jpg|png)/g) || []) {
        if (!exists(u.replace(SITE, ""))) err(name, `imagen de JSON-LD inexistente: ${u}`);
      }
    } catch (e) {
      err(name, "JSON-LD inválido");
    }
  }
  const og = (html.match(/<meta property="og:image" content="([^"]+)"/) || [])[1];
  if (!og) err(name, "sin og:image");
  else if (!exists(og.replace(SITE, ""))) err(name, `og:image inexistente ${og}`);

  for (const tag of html.match(/<img\b[^>]*>/g) || []) {
    if (!/\balt="/.test(tag)) err(name, `img sin alt: ${tag.slice(0, 80)}`);
    if (!/\bwidth="/.test(tag) || !/\bheight="/.test(tag)) warns.push(`${name}: img sin width/height`);
  }
  const refs = [
    ...attr(html, /\shref="(\/[^"]*)"/g),
    ...attr(html, /\ssrc="(\/[^"]*)"/g),
    ...attr(html, /\sposter="(\/[^"]*)"/g),
    ...attr(html, /\ssrcset="([^"]*)"/gi).flatMap((s) => s.split(",").map((x) => x.trim().split(" ")[0])),
  ].filter((r) => r.startsWith("/") && !r.startsWith("//"));
  for (const r of new Set(refs)) if (!exists(r)) err(name, `recurso o enlace roto: ${r}`);
}

// Reciprocidad hreflang
for (const [url, alts] of alternates) {
  for (const k of ["es", "en"]) {
    const back = alternates.get(alts[k]);
    if (!back) err(url, `la alternativa ${k} (${alts[k]}) no existe`);
    else if (back[k] !== alts[k] || Object.values(back).indexOf(url) === -1) err(url, `hreflang no recíproco con ${alts[k]}`);
  }
}

// Sitemap y robots
const sitemap = fs.existsSync(path.join(dist, "sitemap.xml")) ? fs.readFileSync(path.join(dist, "sitemap.xml"), "utf8") : "";
const locs = new Set(attr(sitemap, /<loc>([^<]+)<\/loc>/g));
for (const c of canonicals.keys()) if (!locs.has(c)) err("sitemap.xml", `falta ${c}`);
for (const l of locs) if (!canonicals.has(l)) err("sitemap.xml", `URL sin página: ${l}`);
const robots = fs.existsSync(path.join(dist, "robots.txt")) ? fs.readFileSync(path.join(dist, "robots.txt"), "utf8") : "";
if (!robots.includes(`Sitemap: ${SITE}/sitemap.xml`)) err("robots.txt", "sin referencia al sitemap");
if (/Disallow:\s*\/\s*$/m.test(robots)) err("robots.txt", "bloquea todo el sitio");

console.log(`check: ${htmlFiles.length} HTML, ${locs.size} URLs en sitemap`);
warns.forEach((w) => console.log("  aviso:", w));
if (errors.length) {
  errors.forEach((e) => console.log("  ERROR:", e));
  console.log(`\n${errors.length} errores`);
  process.exit(1);
}
console.log("OK: sin errores");
