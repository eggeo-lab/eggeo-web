// Construye el <head> SEO de cada ruta en el prerender: title, description, canonical,
// hreflang, Open Graph / Twitter y JSON-LD. Solo datos verdaderos (sin reseñas ni ratings).
import { SITE_URL, ORG } from "../content/site.js";
import { PAGES, TEAM } from "../content/pages.js";
import { serviceById } from "../content/services.js";
import { CASES, caseById } from "../content/work.js";
import { RESULTS_TEXT } from "../content/results.js";
import { href } from "../routes.js";
import MEDIA from "../content/media.json";

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const abs = (p) => SITE_URL + p;

/** JPEG más grande disponible de un medio (poster si es video). */
export function coverJpg(id) {
  const m = MEDIA[id];
  return m.video ? `/media/${id}-poster.jpg` : `/media/${id}-${m.sizes[m.sizes.length - 1]}.jpg`;
}

export function pageMeta(route) {
  const { page, lang, param } = route;
  const P = PAGES[lang];
  switch (page) {
    case "service": {
      const t = serviceById(param).text[lang];
      return { title: t.metaTitle, description: t.metaDescription, name: t.name, og: "og/services" };
    }
    case "case": {
      const t = caseById(param).text[lang];
      return { title: t.metaTitle, description: t.metaDescription, name: t.name, og: `og/case-${param}` };
    }
    case "results": {
      const t = RESULTS_TEXT[lang];
      return { title: t.metaTitle, description: t.metaDescription, name: lang === "es" ? "Resultados" : "Results", og: "og/results" };
    }
    case "notFound":
      return { title: P.notFound.metaTitle, description: P.notFound.metaDescription, og: "og/home" };
    default: {
      const t = P[page];
      return { title: t.metaTitle, description: t.metaDescription, name: t.h1, og: page === "home" ? "og/home" : `og/${page}` };
    }
  }
}

export function breadcrumbs(route) {
  if (route.page === "home" || route.page === "notFound") return [];
  const { lang } = route;
  const P = PAGES[lang];
  const items = [{ name: lang === "es" ? "Inicio" : "Home", path: href("home", lang) }];
  if (route.parent) items.push({ name: P[route.parent].h1, path: href(route.parent, lang) });
  items.push({ name: pageMeta(route).name, path: route.path });
  return items;
}

function jsonLd(route, meta) {
  const { lang } = route;
  const orgId = `${SITE_URL}/#organization`;
  const graph = [
    {
      "@type": "Organization",
      "@id": orgId,
      name: ORG.name,
      url: `${SITE_URL}/`,
      logo: { "@type": "ImageObject", url: abs("/brand/icon-512.png"), width: 512, height: 512 },
      slogan: ORG.tagline[lang],
      description:
        lang === "es"
          ? "Agencia creativa de branding, contenido para redes, publicidad digital, producción audiovisual con IA y desarrollo web."
          : "Creative agency for branding, social media content, paid social, AI video production and web development.",
      address: { "@type": "PostalAddress", addressLocality: ORG.city, addressCountry: ORG.country },
      founder: TEAM.map((m) => ({ "@type": "Person", name: m.name })),
      sameAs: ORG.social.map((s) => s.url),
      knowsLanguage: ["es", "en"],
    },
  ];
  if (route.page === "home") {
    graph.push({
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: ORG.name,
      inLanguage: ["es", "en"],
      publisher: { "@id": orgId },
    });
  }
  const crumbs = breadcrumbs(route);
  if (crumbs.length) {
    graph.push({
      "@type": "BreadcrumbList",
      itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: abs(c.path) })),
    });
  }
  if (route.page === "service") {
    const s = serviceById(route.param);
    graph.push({
      "@type": "Service",
      name: s.text[lang].name,
      serviceType: s.text[lang].name,
      description: s.text[lang].metaDescription,
      url: abs(route.path),
      provider: { "@id": orgId },
      inLanguage: lang,
    });
  }
  if (route.page === "case") {
    const c = caseById(route.param);
    graph.push({
      "@type": "CreativeWork",
      name: c.text[lang].h1,
      headline: c.text[lang].h1,
      description: c.text[lang].metaDescription,
      url: abs(route.path),
      image: abs(coverJpg(c.cover)),
      creator: { "@id": orgId },
      about: c.client,
      inLanguage: lang,
    });
  }
  return { "@context": "https://schema.org", "@graph": graph };
}

export function buildHead(route) {
  const meta = pageMeta(route);
  const { lang } = route;
  const canonical = route.alternates ? abs(route.path) : null;
  const ogImage = abs(`/${meta.og}-${lang}.jpg`);
  const tags = [
    `<title>${esc(meta.title)}</title>`,
    `<meta name="description" content="${esc(meta.description)}" />`,
  ];
  if (route.page === "notFound") {
    tags.push(`<meta name="robots" content="noindex" />`);
  } else {
    tags.push(`<link rel="canonical" href="${canonical}" />`);
    tags.push(`<link rel="alternate" hreflang="es" href="${abs(route.alternates.es)}" />`);
    tags.push(`<link rel="alternate" hreflang="en" href="${abs(route.alternates.en)}" />`);
    tags.push(`<link rel="alternate" hreflang="x-default" href="${abs(route.alternates.es)}" />`);
  }
  tags.push(
    `<meta property="og:type" content="${route.page === "case" ? "article" : "website"}" />`,
    `<meta property="og:site_name" content="EGGEO" />`,
    `<meta property="og:title" content="${esc(meta.title)}" />`,
    `<meta property="og:description" content="${esc(meta.description)}" />`,
    `<meta property="og:locale" content="${lang === "es" ? "es_AR" : "en_US"}" />`,
    `<meta property="og:locale:alternate" content="${lang === "es" ? "en_US" : "es_AR"}" />`,
    `<meta property="og:image" content="${ogImage}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${esc(meta.title)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(meta.title)}" />`,
    `<meta name="twitter:description" content="${esc(meta.description)}" />`,
    `<meta name="twitter:image" content="${ogImage}" />`,
  );
  if (canonical) tags.push(`<meta property="og:url" content="${canonical}" />`);
  tags.push(`<script type="application/ld+json">${JSON.stringify(jsonLd(route, meta)).replace(/</g, "\\u003c")}</script>`);
  return { lang, html: tags.join("\n    "), title: meta.title };
}

export const OG_IMAGES = [
  "og/home",
  "og/services",
  "og/work",
  "og/results",
  "og/agency",
  "og/contact",
  ...CASES.map((c) => `og/case-${c.id}`),
];
