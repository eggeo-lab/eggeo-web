import React from "react";
import { hydrateRoot, createRoot } from "react-dom/client";
import App from "./App.jsx";
import { matchRoute } from "./routes.js";
import { pageMeta } from "./seo/head.js";
import "./styles.css";

const route = matchRoute(window.location.pathname);
const root = document.getElementById("root");
const app = (
  <React.StrictMode>
    <App route={route} />
  </React.StrictMode>
);

if (import.meta.env.DEV) {
  // En desarrollo no hay prerender: se renderiza en el cliente y se completa el <head> mínimo.
  document.documentElement.lang = route.lang;
  document.title = pageMeta(route).title;
  createRoot(root).render(app);
} else {
  hydrateRoot(root, app);
}

// Guarda el punto de clic para que la página siguiente abra el egg-wipe desde ahí.
document.addEventListener("click", (e) => {
  const a = e.target.closest && e.target.closest("a[href^='/']");
  if (!a || a.target === "_blank" || e.metaKey || e.ctrlKey) return;
  try {
    sessionStorage.setItem("eggeo-vt", `${Math.round(e.clientX)},${Math.round(e.clientY)}`);
  } catch (_) {}
});
