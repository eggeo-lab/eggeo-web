// Login, límite de intentos y sesiones (D1).
import { verifyPassword, toB64url } from "./password.js";

// usuario → nombre visible. El hash de cada uno está en el secreto HV_PASS_<USUARIO>.
export const USERS = { manu: "Manu", elias: "Elias", nico: "Nico" };

const COOKIE = "__Secure-hv_session";
const COOKIE_ATTRS = "Path=/hueveados; HttpOnly; Secure; SameSite=Lax";
const DAY_MS = 24 * 60 * 60 * 1000;
// "Mantener sesión iniciada": cookie de 90 días que se renueva con el uso (como mucho una vez
// por día, para no escribir en D1 en cada pedido). Sin marcar: cookie de sesión del navegador,
// y en D1 vence a los 7 días aunque el navegador no se cierre.
const PERSISTENT_MS = 90 * DAY_MS;
const BROWSER_SESSION_MS = 7 * DAY_MS;
const RENEW_EVERY_MS = DAY_MS;

// 5 fallos por usuario o 10 por IP dentro de 15 minutos bloquean el login 15 minutos.
const WINDOW_MS = 15 * 60 * 1000;
const LOCK_MS = 15 * 60 * 1000;
const LIMIT_USER = 5;
const LIMIT_IP = 10;

async function sha256hex(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Devuelve { ok, user } o { locked, minutes }.
export async function verifyLogin(env, user, password, ip) {
  const db = env.DB;
  const now = Date.now();
  const known = Object.hasOwn(USERS, user);
  const keys = [[`ip:${ip}`, LIMIT_IP]];
  if (known) keys.push([`user:${user}`, LIMIT_USER]);

  const locked = await db
    .prepare(`SELECT MAX(locked_until) AS until FROM login_attempts WHERE key IN (${keys.map(() => "?").join(",")})`)
    .bind(...keys.map(([k]) => k))
    .first("until");
  if (locked && locked > now) return { locked: true, minutes: Math.ceil((locked - now) / 60000) };

  // Un usuario inexistente se verifica igual contra algún hash cargado (y se rechaza), así tarda lo mismo.
  const stored = known ? env[`HV_PASS_${user.toUpperCase()}`] : undefined;
  const anyHash = Object.keys(USERS).map((u) => env[`HV_PASS_${u.toUpperCase()}`]).find(Boolean);
  const valid = await verifyPassword(password, stored || anyHash);
  if (!valid || !stored) {
    await db.batch(
      keys.map(([key, limit]) =>
        db
          .prepare(
            `INSERT INTO login_attempts (key, fails, window_start, locked_until) VALUES (?1, 1, ?2, 0)
             ON CONFLICT(key) DO UPDATE SET
               fails = CASE WHEN window_start <= ?2 - ?3 THEN 1 ELSE fails + 1 END,
               window_start = CASE WHEN window_start <= ?2 - ?3 THEN ?2 ELSE window_start END,
               locked_until = CASE WHEN (CASE WHEN window_start <= ?2 - ?3 THEN 1 ELSE fails + 1 END) >= ?4
                                   THEN ?2 + ?5 ELSE locked_until END`,
          )
          .bind(key, now, WINDOW_MS, limit, LOCK_MS),
      ),
    );
    return { ok: false };
  }

  await db.batch([
    ...keys.map(([key]) => db.prepare("DELETE FROM login_attempts WHERE key = ?1").bind(key)),
    db.prepare("DELETE FROM login_attempts WHERE window_start <= ?1 AND locked_until <= ?2").bind(now - WINDOW_MS, now),
    db.prepare("DELETE FROM sessions WHERE expires_at <= ?1").bind(now),
  ]);
  return { ok: true, user };
}

const sessionCookie = (token, persistent) =>
  `${COOKIE}=${token}; ${persistent ? `Max-Age=${PERSISTENT_MS / 1000}; ` : ""}${COOKIE_ATTRS}`;

// Crea la sesión y devuelve el header Set-Cookie.
export async function createSession(db, user, persistent) {
  const token = toB64url(crypto.getRandomValues(new Uint8Array(32)));
  await db
    .prepare("INSERT INTO sessions (token_hash, user, persistent, expires_at) VALUES (?1, ?2, ?3, ?4)")
    .bind(await sha256hex(token), user, persistent ? 1 : 0, Date.now() + (persistent ? PERSISTENT_MS : BROWSER_SESSION_MS))
    .run();
  return sessionCookie(token, persistent);
}

export const clearSessionCookie = () => `${COOKIE}=; Max-Age=0; ${COOKIE_ATTRS}`;

function readToken(request) {
  const header = request.headers.get("Cookie") || "";
  for (const part of header.split(";")) {
    const [name, ...rest] = part.trim().split("=");
    if (name === COOKIE) return rest.join("=");
  }
  return null;
}

// { user, name, tokenHash, renewCookie } o null. renewCookie (si viene) va en la respuesta.
export async function getSession(request, db) {
  const token = readToken(request);
  if (!token || token.length > 100) return null;
  const tokenHash = await sha256hex(token);
  const now = Date.now();
  const row = await db
    .prepare("SELECT user, persistent, expires_at FROM sessions WHERE token_hash = ?1 AND expires_at > ?2")
    .bind(tokenHash, now)
    .first();
  if (!row || !Object.hasOwn(USERS, row.user)) return null;

  let renewCookie = null;
  if (row.persistent && row.expires_at - now < PERSISTENT_MS - RENEW_EVERY_MS) {
    await db.prepare("UPDATE sessions SET expires_at = ?1 WHERE token_hash = ?2").bind(now + PERSISTENT_MS, tokenHash).run();
    renewCookie = sessionCookie(token, true);
  }
  return { user: row.user, name: USERS[row.user], tokenHash, renewCookie };
}

export async function deleteSession(db, session) {
  await db.prepare("DELETE FROM sessions WHERE token_hash = ?1").bind(session.tokenHash).run();
}
