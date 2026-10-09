# EGGEO — Web (React + Vite, prerenderizada)

Sitio de **EGGEO**, agencia creativa de Córdoba, Argentina — «Ideas absurdas, resultados serios».
Español e inglés (`/` y `/en/`), una página HTML estática por ruta, desplegado en GitHub Pages
(`www.eggeo.com.ar`).

## Requisitos
- Node.js 20+ y npm
- macOS solo para regenerar medios (`npm run media`, `npm run og`)

## Scripts
```bash
npm install
npm run dev       # desarrollo en http://localhost:5173 (render en el cliente)
npm run build     # build + prerender de todas las rutas → dist/
npm run preview   # sirve dist/ en http://localhost:4173 (igual que producción)
npm run check     # valida SEO y enlaces del build (titles, canonical, hreflang, sitemap, JSON-LD, alt)
npm run media     # regenera public/media desde ../eggeo-material y media-src (macOS)
npm run og        # regenera las imágenes Open Graph de public/og (macOS)
```

## Estructura
```
index.html              plantilla (el prerender completa <!--lang-->, <!--head--> y <!--app-->)
src/
  entry-client.jsx      hidratación en el navegador
  entry-server.jsx      render para el prerender
  routes.js             mapa de rutas ES/EN (fuente de sitemap, hreflang y enlaces)
  App.jsx               layout + selección de página
  pages/Pages.jsx       inicio, servicios, servicio, proyectos, caso, agencia, contacto, 404
  components/           header/footer, hero, secciones, formularios, marca, íconos
  content/              textos ES/EN, casos, servicios, packs y media.json (generado)
  seo/head.js           title, description, canonical, hreflang, Open Graph y JSON-LD
  lib/                  medios responsivos, hooks, eventos
  styles.css            tokens del Design System + estilos
scripts/
  prerender.mjs         genera dist/<ruta>/index.html, 404.html, sitemap.xml y robots.txt
  check.mjs             verificación SEO y de enlaces
  media/                pipeline de imágenes, video, logo e imágenes OG (sips + Swift)
media-src/              originales del repo usados por el pipeline (no se publican)
public/                 media optimizada, fuentes, íconos y OG (se publica tal cual)
```

## Contenido
- Textos: `src/content/*.js`. Cada caso y servicio tiene versión `es` y `en`.
- Cifras: solo datos verificados con fuente y período (ver comentarios en `work.js`).
- Formulario: Formspree (`ORG.formspree` en `src/content/site.js`).
- Eventos de conversión: `track()` en `src/lib/track.js` escribe en `window.dataLayer` si existe;
  no hay trackers instalados.
