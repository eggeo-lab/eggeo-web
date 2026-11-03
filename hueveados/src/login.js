// Página de login, con la estética de la web: barra amarilla con el logo y formulario como el de contacto.
import { THEME_HEAD } from "./theme.js";
import { LOGO_SVG } from "./logo.js";

const escape = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

export function loginPage({ usuario = "", recordar = true, error = "" } = {}) {
  return `<!doctype html>
<html lang="es" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Ingresar · EGGEO</title>
${THEME_HEAD}
<style>
*{box-sizing:border-box}
body{margin:0;min-height:100vh;display:flex;flex-direction:column;background:var(--bg);color:var(--fg);font:16px/1.5 var(--font);-webkit-font-smoothing:antialiased}
.hd{background:var(--hd-bg);color:var(--hd-fg);padding:16px 24px;display:flex;align-items:center;gap:16px}
.hd a{display:flex;color:var(--hd-fg)}
.hd svg{height:32px;width:auto;display:block}
.hd-logo-checker{transition:transform .6s var(--ease)}
.hd a:hover .hd-logo-checker{transform:translateX(38px)}
.hd span{font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;opacity:.85}
main{flex:1;display:grid;place-items:center;padding:40px 20px}
form{width:100%;max-width:400px;display:flex;flex-direction:column;gap:20px}
.kicker{font-size:12px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:var(--accent)}
h1{margin:10px 0 0;font-size:clamp(40px,9vw,56px);font-weight:800;letter-spacing:-.045em;line-height:.95}
label{display:grid;gap:8px;font-size:14px;font-weight:700}
input{width:100%;min-height:54px;padding:14px 18px;border-radius:16px;border:1.5px solid var(--line);background:var(--surface);color:var(--fg);font:inherit;font-size:17px;outline:none;transition:border-color .2s}
input:focus{border-color:var(--accent)}
label.check{display:flex;align-items:center;gap:10px;font-weight:600;color:var(--muted);cursor:pointer}
input[type=checkbox]{width:18px;height:18px;min-height:0;margin:0;accent-color:var(--accent);cursor:pointer}
button{min-height:54px;border:none;border-radius:999px;padding:14px 30px;font:inherit;font-size:15px;font-weight:800;background:var(--accent);color:var(--accent-ink);cursor:pointer;transition:transform .3s var(--ease),box-shadow .3s var(--ease)}
button:hover{transform:translateY(-3px);box-shadow:0 15px 30px color-mix(in srgb,var(--accent) 30%,transparent)}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.hd :focus-visible{outline-color:var(--hd-fg)}
.error{margin:0;padding:12px 16px;border-radius:16px;background:color-mix(in srgb,var(--bad) 12%,transparent);color:var(--bad);font-weight:700}
</style>
</head>
<body>
<header class="hd">
  <a href="/" title="Ir a eggeo.com.ar">${LOGO_SVG}</a>
  <span>Backoffice</span>
</header>
<main>
<form method="post" action="/hueveados/login">
  <div>
    <div class="kicker">Finanzas de la agencia</div>
    <h1>Ingresar</h1>
  </div>
  ${error ? `<p class="error" role="alert">${escape(error)}</p>` : ""}
  <label>Usuario
    <input name="usuario" autocomplete="username" autocapitalize="none" spellcheck="false" required maxlength="32" value="${escape(usuario)}"${usuario ? "" : " autofocus"}>
  </label>
  <label>Contraseña
    <input name="password" type="password" autocomplete="current-password" required maxlength="256"${usuario ? " autofocus" : ""}>
  </label>
  <label class="check"><input type="checkbox" name="recordar" value="1"${recordar ? " checked" : ""}> Mantener sesión iniciada</label>
  <button type="submit">Entrar</button>
</form>
</main>
</body>
</html>
`;
}
