// Entrada de prerender (build SSR de Vite). La usa scripts/prerender.mjs.
import React from "react";
import { renderToString } from "react-dom/server";
import App from "./App.jsx";

export { ROUTES, NOT_FOUND } from "./routes.js";
export { buildHead, OG_IMAGES } from "./seo/head.js";
export { SITE_URL } from "./content/site.js";

export function render(route) {
  return renderToString(<App route={route} />);
}
