// Tokens visuales de la web de EGGEO (src/styles.css del sitio), compartidos por el login y el dashboard.
// La tipografía y el favicon se sirven desde la web (mismo dominio). El tema usa la misma clave que la
// web ("eggeo-theme"), así el backoffice se ve claro u oscuro según lo que eligieron allá.

const FONT_LATIN = "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD";
const FONT_LATIN_EXT = "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF";

const TOKENS = `
@font-face{font-family:"Plus Jakarta Sans";font-style:normal;font-weight:400 800;font-display:swap;src:url("/fonts/plus-jakarta-sans-latin.woff2") format("woff2");unicode-range:${FONT_LATIN}}
@font-face{font-family:"Plus Jakarta Sans";font-style:normal;font-weight:400 800;font-display:swap;src:url("/fonts/plus-jakarta-sans-latin-ext.woff2") format("woff2");unicode-range:${FONT_LATIN_EXT}}
:root{
  --egg-yellow:#ffd600; --egg-blue:#003d99;
  --bg:#f9f9f4; --surface:#fff; --raised:#f4f4f5; --hover:rgba(0,0,0,.025);
  --line:rgba(0,0,0,.18); --line-soft:rgba(0,0,0,.08);
  --fg:#121212; --muted:#555; --faint:#8a8a8a;
  --accent:var(--egg-blue); --accent-ink:#fff;
  --hd-bg:var(--egg-yellow); --hd-fg:var(--egg-blue);
  --manu:#1f6fd6; --elias:#7b4fd8; --nico:#d2492f;
  --good:#146c2e; --warn:#8a5300; --bad:#b3261e; --sub:#0d7480;
  --chart:#2a5fc4; --chart-hi:#1f4fa8;
  --shadow:0 10px 24px rgba(0,0,0,.08);
  --ease:cubic-bezier(.16,1,.3,1);
  --font:"Plus Jakarta Sans","Helvetica Neue",Arial,sans-serif;
  color-scheme:light;
}
[data-theme="dark"]{
  --bg:#050505; --surface:#121212; --raised:#18181b; --hover:rgba(255,255,255,.03);
  --line:rgba(255,255,255,.24); --line-soft:rgba(255,255,255,.11);
  --fg:#f4f4f5; --muted:#a1a1aa; --faint:#71717a;
  --accent:var(--egg-yellow); --accent-ink:var(--egg-blue);
  --hd-bg:var(--egg-blue); --hd-fg:#fff;
  --manu:#6cb8ff; --elias:#b79cff; --nico:#ff8f7a;
  --good:#5fd4a0; --warn:#f2b84b; --bad:#ff6b6b; --sub:#5cc8d6;
  --chart:#a68d00; --chart-hi:#c2a500;
  --shadow:0 25px 50px -12px rgba(0,0,0,.7);
  color-scheme:dark;
}`;

// Va en el <head>: favicon, fuente, tokens y el tema elegido antes de pintar (sin parpadeo).
export const THEME_HEAD = `<link rel="icon" href="/brand/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/fonts/plus-jakarta-sans-latin.woff2" as="font" type="font/woff2" crossorigin>
<script>(function(){var d=document.documentElement;try{var t=localStorage.getItem("eggeo-theme");if(!t)t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";d.setAttribute("data-theme",t)}catch(e){}})();</script>
<style>${TOKENS}</style>`;
