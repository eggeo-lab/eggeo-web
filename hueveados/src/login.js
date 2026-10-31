// Página de login (mismo tema que el dashboard).
const escape = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

export function loginPage({ usuario = "", recordar = true, error = "" } = {}) {
  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Ingresar · Finanzas de la agencia</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700&family=Manrope:wght@400;600;700&display=swap">
<style>
:root{--bg:#0d1016;--surface:#141922;--raised:#1a2130;--line:#252d3d;--fg:#e7eaf0;--muted:#8b93a6;--accent:#f2b84b;--accent-ink:#1a1305;--bad:#ff6b6b;color-scheme:dark}
*{box-sizing:border-box}
body{margin:0;min-height:100vh;display:grid;place-items:center;padding:24px;background:var(--bg);color:var(--fg);font:14px/1.5 "Manrope","Segoe UI",system-ui,sans-serif;-webkit-font-smoothing:antialiased}
form{width:100%;max-width:360px;background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:28px;display:flex;flex-direction:column;gap:16px}
h1{margin:0;font:700 26px/1.1 "Bricolage Grotesque","Segoe UI",system-ui,sans-serif;letter-spacing:-.01em}
.eyebrow{font-size:11px;letter-spacing:.09em;text-transform:uppercase;color:var(--muted);font-weight:600}
label{display:flex;flex-direction:column;gap:6px;font-weight:600;font-size:13px}
input{background:var(--raised);border:1px solid var(--line);border-radius:10px;padding:10px 12px;color:var(--fg);font:inherit;outline:none}
input:focus{border-color:var(--accent)}
label.check{flex-direction:row;align-items:center;gap:8px;font-weight:500;color:var(--muted);cursor:pointer}
input[type=checkbox]{width:16px;height:16px;margin:0;accent-color:var(--accent);cursor:pointer}
button{border:none;border-radius:10px;padding:11px 14px;font:inherit;font-weight:700;background:var(--accent);color:var(--accent-ink);cursor:pointer}
button:hover{background:#f7c766}
button:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.error{margin:0;padding:10px 12px;border-radius:10px;background:rgba(255,107,107,.12);color:var(--bad);font-weight:600}
</style>
</head>
<body>
<form method="post" action="/hueveados/login">
  <div>
    <div class="eyebrow">Backoffice EGGEO</div>
    <h1>Finanzas de la agencia</h1>
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
</body>
</html>
`;
}
