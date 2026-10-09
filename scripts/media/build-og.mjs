// Genera public/og/*.jpg (1200×630) a partir del contenido. Requiere macOS (swiftc).
// Uso: node scripts/media/build-og.mjs
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { PAGES } from "../../src/content/pages.js";
import { CASES } from "../../src/content/work.js";
const MEDIA = JSON.parse(fs.readFileSync(new URL("../../src/content/media.json", import.meta.url), "utf8"));

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const pub = path.join(root, "public");
const YELLOW = "#FFD600", BLUE = "#003D99";
const specs = [];

for (const lang of ["es", "en"]) {
  const P = PAGES[lang];
  const page = (id, lines, kicker) => specs.push({ out: `og/${id}-${lang}.jpg`, lines, kicker, bg: YELLOW, fg: BLUE, accent: BLUE });
  page("home", P.home.hero, lang === "es" ? "Agencia creativa · Córdoba, Argentina" : "Creative agency · Córdoba, Argentina");
  page("services", [P.services.h1.toUpperCase()], lang === "es" ? "Branding · Contenido · Pauta · Video e IA · Web" : "Branding · Content · Paid social · Video & AI · Web");
  page("work", [P.work.h1.toUpperCase()], "La Gorgona · Heybon · AGPNYC · Egran · Risata · Gata Maula");
  page("results", lang === "es" ? ["5 VIRALES", "EN MENOS", "DE UN AÑO"] : ["5 VIRAL HITS", "IN UNDER", "A YEAR"], lang === "es" ? "Sin comprar seguidores · Sin influencers" : "No bought followers · No influencers");
  page("agency", P.agency.h1.toUpperCase().split(" ").length > 2 ? [P.agency.h1.toUpperCase()] : P.agency.h1.toUpperCase().split(" "), lang === "es" ? "Quiénes somos" : "Who we are");
  page("contact", [P.contact.h1.toUpperCase()], lang === "es" ? "Contanos tu proyecto" : "Tell us about your project");
  for (const c of CASES) {
    const t = c.text[lang];
    const m = MEDIA[c.cover];
    const img = m.video ? `media/${c.cover}-poster.jpg` : `media/${c.cover}-${m.sizes[m.sizes.length - 1]}.jpg`;
    specs.push({ out: `og/case-${c.id}-${lang}.jpg`, lines: [t.name.toUpperCase()], kicker: t.role, image: img, bg: c.tone.bg, fg: c.tone.fg, accent: YELLOW });
  }
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "og-"));
const specFile = path.join(pub, ".og-spec.json");
fs.writeFileSync(specFile, JSON.stringify(specs));
const bin = path.join(tmp, "og");
execFileSync("swiftc", ["-O", path.join(root, "scripts/media/og.swift"), "-o", bin], { stdio: ["ignore", "ignore", "inherit"] });
try {
  execFileSync(bin, [specFile, path.join(pub, "fonts/plus-jakarta-sans-latin.woff2"), path.join(root, "src/brand/paths.js")], { stdio: "inherit" });
} finally {
  fs.rmSync(specFile);
  fs.rmSync(tmp, { recursive: true, force: true });
}
