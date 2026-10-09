// Prerender: genera un HTML estático por ruta, más 404.html, sitemap.xml y robots.txt.
// Corre después de `vite build` (cliente) y `vite build --ssr src/entry-server.jsx`.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const ssrDir = path.join(root, "dist-ssr");
const ssrEntry = fs.readdirSync(ssrDir).find((f) => /^entry-server\.(m?js)$/.test(f));
const { render, ROUTES, NOT_FOUND, buildHead, SITE_URL } = await import(pathToFileURL(path.join(ssrDir, ssrEntry)).href);

const template = fs.readFileSync(path.join(dist, "index.html"), "utf8");
for (const mark of ["<!--lang-->", "<!--head-->", "<!--app-->"]) {
  if (!template.includes(mark)) throw new Error(`La plantilla no tiene ${mark}`);
}

function page(route) {
  const head = buildHead(route);
  return template
    .replace("<!--lang-->", head.lang)
    .replace("<!--head-->", head.html)
    .replace("<!--app-->", render(route));
}

let count = 0;
for (const route of ROUTES) {
  const file = path.join(dist, route.path, "index.html");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, page(route));
  count++;
}
fs.writeFileSync(path.join(dist, "404.html"), page(NOT_FOUND));

// sitemap.xml con alternativas de idioma (hreflang)
const today = new Date().toISOString().slice(0, 10);
const urls = ROUTES.map((r) => {
  const alts = ["es", "en"]
    .map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${SITE_URL}${r.alternates[l]}"/>`)
    .concat(`    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${r.alternates.es}"/>`)
    .join("\n");
  return `  <url>\n    <loc>${SITE_URL}${r.path}</loc>\n    <lastmod>${today}</lastmod>\n${alts}\n  </url>`;
});
fs.writeFileSync(
  path.join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join("\n")}\n</urlset>\n`,
);
fs.writeFileSync(path.join(dist, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);

fs.rmSync(ssrDir, { recursive: true, force: true });
console.log(`prerender: ${count} páginas + 404.html, sitemap.xml y robots.txt`);
