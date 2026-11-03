// Cuentas de redes de cada cliente (usuario y contraseña), en tablas propias: nunca viajan con
// /api/data. Las contraseñas se guardan cifradas con AES-GCM (clave en el secreto HV_VAULT_KEY)
// y solo se descifran cuando un socio toca "Mostrar" o "Copiar". Cada acceso queda registrado.
import { toB64url, fromB64url } from "./password.js";

export const REDES = ["instagram", "facebook", "tiktok", "googleAds"];
const ACCIONES = ["ver", "copiar"];
const ID_RE = /^[A-Za-z0-9_-]{1,64}$/;
const MAX_STRING = 500;

export class InvalidRequest extends Error {}
export class MissingKey extends Error {}
export class NotFound extends Error {}

let cachedKey = null;
function vaultKey(env) {
  const raw = env.HV_VAULT_KEY;
  if (!raw) throw new MissingKey("Falta configurar el secreto HV_VAULT_KEY");
  if (cachedKey?.raw !== raw) {
    const bytes = fromB64url(raw.trim());
    if (bytes.length !== 32) throw new MissingKey("HV_VAULT_KEY tiene que ser de 32 bytes");
    cachedKey = { raw, key: crypto.subtle.importKey("raw", bytes, "AES-GCM", false, ["encrypt", "decrypt"]) };
  }
  return cachedKey.key;
}

// El cliente y la red van como datos asociados: un texto cifrado no se puede mover a otra cuenta.
const aad = (cliente, red) => new TextEncoder().encode(`${cliente}|${red}`);

async function encrypt(env, cliente, red, plaintext) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv, additionalData: aad(cliente, red) }, await vaultKey(env), new TextEncoder().encode(plaintext));
  return `v1:${toB64url(iv)}:${toB64url(new Uint8Array(ct))}`;
}

async function decrypt(env, cliente, red, stored) {
  const [version, iv, ct] = String(stored).split(":");
  if (version !== "v1" || !iv || !ct) throw new Error("Formato de contraseña cifrada desconocido");
  const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv: fromB64url(iv), additionalData: aad(cliente, red) }, await vaultKey(env), fromB64url(ct));
  return new TextDecoder().decode(pt);
}

function target(body) {
  if (!body || typeof body !== "object") throw new InvalidRequest("Cuerpo inválido");
  const { cliente, red } = body;
  if (typeof cliente !== "string" || !ID_RE.test(cliente) || !REDES.includes(red)) throw new InvalidRequest("Cuenta inválida");
  return { cliente, red };
}

function optionalString(body, key) {
  if (!Object.hasOwn(body, key)) return null;
  const v = body[key];
  if (typeof v !== "string" || v.length > MAX_STRING) throw new InvalidRequest(`Campo inválido: ${key}`);
  return v;
}

const quien = (por, at) => (at ? { por, at } : null);

// Lista sin contraseñas: solo si hay una cargada, quién la tocó y el último acceso.
export async function listCredentials(db) {
  const { results } = await db
    .prepare(
      `SELECT c.cliente, c.red, c.usuario, c.nota, c.password_enc IS NOT NULL AS tiene_password, c.updated_at, c.updated_by,
              l.user AS log_user, l.accion AS log_accion, l.at AS log_at
       FROM credentials c
       LEFT JOIN credential_log l ON l.id = (
         SELECT id FROM credential_log WHERE cliente = c.cliente AND red = c.red ORDER BY at DESC, id DESC LIMIT 1
       )`,
    )
    .all();
  return results.map((r) => ({
    cliente: r.cliente,
    red: r.red,
    usuario: r.usuario,
    nota: r.nota,
    tienePassword: Boolean(r.tiene_password),
    actualizado: quien(r.updated_by, r.updated_at),
    ultimoAcceso: r.log_at ? { por: r.log_user, accion: r.log_accion, at: r.log_at } : null,
  }));
}

// Guarda solo los campos que vienen (usuario, password, nota). password "" borra la contraseña.
// Si la cuenta queda sin nada, se elimina.
export async function saveCredential(db, env, body, user) {
  const { cliente, red } = target(body);
  const usuario = optionalString(body, "usuario");
  const password = optionalString(body, "password");
  const nota = optionalString(body, "nota");
  const passwordEnc = password ? await encrypt(env, cliente, red, password) : null;
  const now = Date.now();

  const statements = [
    db
      .prepare(
        `INSERT INTO credentials (cliente, red, usuario, password_enc, nota, updated_at, updated_by)
         VALUES (?1, ?2, COALESCE(?3, ''), ?4, COALESCE(?5, ''), ?6, ?7)
         ON CONFLICT(cliente, red) DO UPDATE SET
           usuario = COALESCE(?3, usuario),
           password_enc = CASE WHEN ?8 THEN ?4 ELSE password_enc END,
           nota = COALESCE(?5, nota),
           updated_at = ?6,
           updated_by = ?7`,
      )
      .bind(cliente, red, usuario, passwordEnc, nota, now, user, password !== null ? 1 : 0),
    db
      .prepare("DELETE FROM credentials WHERE cliente = ?1 AND red = ?2 AND usuario = '' AND nota = '' AND password_enc IS NULL")
      .bind(cliente, red),
  ];
  if (password !== null) {
    statements.push(
      db
        .prepare("INSERT INTO credential_log (at, user, cliente, red, accion) VALUES (?1, ?2, ?3, ?4, ?5)")
        .bind(now, user, cliente, red, password ? "cambiar" : "borrar"),
    );
  }
  await db.batch(statements);
}

export async function revealPassword(db, env, body, user) {
  const { cliente, red } = target(body);
  const accion = ACCIONES.includes(body.accion) ? body.accion : "ver";
  const row = await db.prepare("SELECT password_enc FROM credentials WHERE cliente = ?1 AND red = ?2").bind(cliente, red).first();
  if (!row?.password_enc) throw new NotFound("Esta cuenta no tiene contraseña cargada");
  const password = await decrypt(env, cliente, red, row.password_enc);
  await db
    .prepare("INSERT INTO credential_log (at, user, cliente, red, accion) VALUES (?1, ?2, ?3, ?4, ?5)")
    .bind(Date.now(), user, cliente, red, accion)
    .run();
  return password;
}
