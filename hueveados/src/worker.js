// Backoffice privado en www.eggeo.com.ar/hueveados.
// Cloudflare manda a este Worker solo /hueveados*; el resto del sitio sigue saliendo de GitHub Pages.
// Nada de /hueveados existe como archivo estático: sin sesión, la API responde 401 y todo lo
// demás redirige al login.
import DASHBOARD from "./dashboard.html";
import { loginPage } from "./login.js";
import { verifyLogin, createSession, clearSessionCookie, getSession, deleteSession } from "./auth.js";
import { readState, parseChanges, applyChanges, InvalidChanges } from "./data.js";
import { listCredentials, saveCredential, revealPassword, InvalidRequest, MissingKey, NotFound } from "./vault.js";

const BASE = "/hueveados";
const CANONICAL_HOST = "www.eggeo.com.ar";
const MAX_BODY = 256 * 1024;

const SECURITY_HEADERS = {
  "X-Robots-Tag": "noindex, nofollow",
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "same-origin",
};

function respond(body, status, headers = {}) {
  return new Response(body, { status, headers: { ...SECURITY_HEADERS, ...headers } });
}
const html = (body, status = 200, headers = {}) => respond(body, status, { "Content-Type": "text/html; charset=utf-8", ...headers });
const json = (data, status = 200) => respond(JSON.stringify(data), status, { "Content-Type": "application/json; charset=utf-8" });
const redirect = (location, status = 302, headers = {}) => respond(null, status, { Location: location, ...headers });

// Los navegadores mandan Origin en todo POST; si no coincide, es otro sitio intentando actuar en nombre del socio.
const sameOrigin = (request, url) => request.headers.get("Origin") === url.origin;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // La ruta "hueveados*" también captura cosas como /hueveadosx: esas siguen a GitHub Pages.
    if (path !== BASE && !path.startsWith(`${BASE}/`)) return fetch(request);

    // Una sola cookie y un solo origen: eggeo.com.ar/hueveados → www.eggeo.com.ar/hueveados
    if (url.hostname === "eggeo.com.ar") {
      url.hostname = CANONICAL_HOST;
      return redirect(url.toString(), 301);
    }

    const session = await getSession(request, env.DB);
    const response = await route(request, env, url, session);
    // Sesión con "Mantener sesión iniciada": cada uso extiende la cookie otros 90 días.
    if (session?.renewCookie && !response.headers.has("Set-Cookie")) response.headers.append("Set-Cookie", session.renewCookie);
    return response;
  },
};

async function route(request, env, url, session) {
  const path = url.pathname;

  if (path === `${BASE}/login`) {
    if (request.method === "POST") return login(request, env, url);
    if (request.method === "GET" || request.method === "HEAD") return session ? redirect(`${BASE}/`) : html(loginPage());
    return respond(null, 405, { Allow: "GET, POST" });
  }

  if (!session) {
    return path.startsWith(`${BASE}/api/`) ? json({ error: "No autenticado" }, 401) : redirect(`${BASE}/login`);
  }

  if (path === `${BASE}/logout` && request.method === "POST") {
    if (!sameOrigin(request, url)) return respond("Origen inválido", 403);
    await deleteSession(env.DB, session);
    return redirect(`${BASE}/login`, 303, { "Set-Cookie": clearSessionCookie() });
  }

  if (path === BASE) return redirect(`${BASE}/`, 301);
  if (path === `${BASE}/` && (request.method === "GET" || request.method === "HEAD")) return html(DASHBOARD);

  if (path === `${BASE}/api/data` && request.method === "GET") {
    return json({ user: session.name, ...(await readState(env.DB)) });
  }
  if (path === `${BASE}/api/sync` && request.method === "POST") return sync(request, env, url, session);

  if (path === `${BASE}/api/cuentas` && request.method === "GET") return json({ cuentas: await listCredentials(env.DB) });
  if (path === `${BASE}/api/cuentas/guardar` && request.method === "POST") {
    return vault(request, url, async (body) => {
      await saveCredential(env.DB, env, body, session.user);
      return { cuentas: await listCredentials(env.DB) };
    });
  }
  if (path === `${BASE}/api/cuentas/revelar` && request.method === "POST") {
    return vault(request, url, async (body) => ({ password: await revealPassword(env.DB, env, body, session.user) }));
  }

  return path.startsWith(`${BASE}/api/`) ? json({ error: "No encontrado" }, 404) : respond("No encontrado", 404);
}

async function login(request, env, url) {
  if (!sameOrigin(request, url)) return html(loginPage({ error: "Solicitud inválida. Recargá la página." }), 403);
  if (Number(request.headers.get("Content-Length") || 0) > 4096) return respond(null, 413);

  const form = await request.formData().catch(() => null);
  const usuario = String(form?.get("usuario") ?? "").trim().toLowerCase().slice(0, 32);
  const password = String(form?.get("password") ?? "").slice(0, 256);
  const recordar = form?.get("recordar") === "1";
  const ip = request.headers.get("CF-Connecting-IP") || "local";

  const result = await verifyLogin(env, usuario, password, ip);
  if (result.locked) {
    const error = `Demasiados intentos fallidos. Probá de nuevo en ${result.minutes} minuto${result.minutes === 1 ? "" : "s"}.`;
    return html(loginPage({ usuario, recordar, error }), 429);
  }
  if (!result.ok) return html(loginPage({ usuario, recordar, error: "Usuario o contraseña incorrectos." }), 401);

  return redirect(`${BASE}/`, 303, { "Set-Cookie": await createSession(env.DB, result.user, recordar) });
}

// POST con JSON del mismo origen: devuelve el cuerpo ya parseado o la respuesta de error.
async function readJsonPost(request, url) {
  if (!sameOrigin(request, url)) return json({ error: "Origen inválido" }, 403);
  if (!(request.headers.get("Content-Type") || "").startsWith("application/json")) return json({ error: "Se espera JSON" }, 415);
  const text = await request.text();
  if (text.length > MAX_BODY) return json({ error: "Demasiado grande" }, 413);
  try {
    return { body: JSON.parse(text) };
  } catch (err) {
    return json({ error: err.message }, 400);
  }
}

async function sync(request, env, url, session) {
  const parsed = await readJsonPost(request, url);
  if (parsed instanceof Response) return parsed;
  try {
    await applyChanges(env.DB, parseChanges(parsed.body), session.user);
  } catch (err) {
    if (err instanceof InvalidChanges) return json({ error: err.message }, 400);
    throw err;
  }
  return json({ user: session.name, ...(await readState(env.DB)) });
}

async function vault(request, url, handler) {
  const parsed = await readJsonPost(request, url);
  if (parsed instanceof Response) return parsed;
  try {
    return json(await handler(parsed.body));
  } catch (err) {
    if (err instanceof InvalidRequest) return json({ error: err.message }, 400);
    if (err instanceof NotFound) return json({ error: err.message }, 404);
    if (err instanceof MissingKey) return json({ error: err.message }, 503);
    throw err;
  }
}
