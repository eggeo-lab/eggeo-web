// Hash de contraseñas con PBKDF2-SHA256 (WebCrypto). Lo usan el Worker y scripts/hash-password.mjs.
// Formato: pbkdf2-sha256:<iteraciones>:<salt base64url>:<hash base64url>
//
// 25.000 iteraciones: con 100.000 el login pasa los 10 ms de CPU del plan gratis de Workers
// (~17 ms medido). Las iteraciones viajan dentro de cada hash, así que se pueden cambiar
// regenerando los hashes, sin tocar código.
export const PBKDF2_ITERATIONS = 25000;
const MIN_ITERATIONS = 1000;
const MAX_ITERATIONS = 100000; // tope de PBKDF2 en Workers

const enc = new TextEncoder();

export const toB64url = (bytes) =>
  btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const fromB64url = (s) => Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0));

async function derive(password, salt, iterations) {
  const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations }, key, 256);
  return new Uint8Array(bits);
}

export async function hashPassword(password, iterations = PBKDF2_ITERATIONS) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await derive(password, salt, iterations);
  return `pbkdf2-sha256:${iterations}:${toB64url(salt)}:${toB64url(hash)}`;
}

export async function verifyPassword(password, stored) {
  const parts = String(stored || "").trim().split(":");
  if (parts.length !== 4 || parts[0] !== "pbkdf2-sha256") return false;
  const iterations = Number(parts[1]);
  if (!Number.isInteger(iterations) || iterations < MIN_ITERATIONS || iterations > MAX_ITERATIONS) return false;
  let salt, expected;
  try {
    salt = fromB64url(parts[2]);
    expected = fromB64url(parts[3]);
  } catch {
    return false;
  }
  const actual = await derive(password, salt, iterations);
  if (actual.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < actual.length; i++) diff |= actual[i] ^ expected[i];
  return diff === 0;
}
