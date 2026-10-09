// Mapa de rutas ES / EN. Fuente única para el prerender, el sitemap, hreflang y los enlaces.
import { CASES } from "./content/work.js";
import { SERVICES } from "./content/services.js";

const BASE = {
  home: { es: "/", en: "/en/" },
  services: { es: "/servicios/", en: "/en/services/" },
  work: { es: "/proyectos/", en: "/en/work/" },
  results: { es: "/resultados/", en: "/en/results/" },
  agency: { es: "/agencia/", en: "/en/agency/" },
  contact: { es: "/contacto/", en: "/en/contact/" },
};

const pages = [
  { key: "home", page: "home" },
  { key: "services", page: "services" },
  ...SERVICES.map((s) => ({
    key: `service:${s.id}`,
    page: "service",
    param: s.id,
    paths: { es: `${BASE.services.es}${s.slug.es}/`, en: `${BASE.services.en}${s.slug.en}/` },
    parent: "services",
  })),
  { key: "work", page: "work" },
  ...CASES.map((c) => ({
    key: `case:${c.id}`,
    page: "case",
    param: c.id,
    paths: { es: `${BASE.work.es}${c.slug}/`, en: `${BASE.work.en}${c.slug}/` },
    parent: "work",
  })),
  { key: "results", page: "results" },
  { key: "agency", page: "agency" },
  { key: "contact", page: "contact" },
];

export const ROUTES = pages.flatMap((p) =>
  ["es", "en"].map((lang) => {
    const paths = p.paths || BASE[p.key];
    return {
      key: p.key,
      page: p.page,
      param: p.param,
      parent: p.parent,
      lang,
      path: paths[lang],
      alternates: paths,
    };
  }),
);

export const NOT_FOUND = { key: "404", page: "notFound", lang: "es", path: "/404.html", alternates: null };

/** Ruta absoluta de una página por clave e idioma: href("case:risata", "en"). */
export function href(key, lang) {
  const r = ROUTES.find((x) => x.key === key && x.lang === lang);
  if (!r) throw new Error(`Ruta inexistente: ${key} (${lang})`);
  return r.path;
}

export function matchRoute(pathname) {
  let p = decodeURI(pathname || "/");
  if (!p.endsWith("/") && !p.endsWith(".html")) p += "/";
  // GitHub Pages sirve un único 404.html para cualquier ruta: su contenido es bilingüe.
  return ROUTES.find((r) => r.path === p) || NOT_FOUND;
}
