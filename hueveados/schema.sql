-- Esquema D1 del backoffice /hueveados. Se puede correr más de una vez.

-- Un registro por cliente, gasto o ajuste ("settings"/"main"). Los borrados quedan marcados
-- (deleted = 1) para que un socio con datos viejos no los vuelva a crear sin querer.
CREATE TABLE IF NOT EXISTS records (
  collection TEXT NOT NULL,
  id         TEXT NOT NULL,
  data       TEXT NOT NULL,
  deleted    INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  updated_by TEXT,
  PRIMARY KEY (collection, id)
);

-- Sesiones: se guarda el SHA-256 del token, nunca el token.
-- persistent = 1: "Mantener sesión iniciada" (90 días que se renuevan con el uso).
CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  user       TEXT NOT NULL,
  persistent INTEGER NOT NULL DEFAULT 0,
  expires_at INTEGER NOT NULL
);

-- Intentos fallidos de login por usuario ("user:elias") y por IP ("ip:1.2.3.4").
CREATE TABLE IF NOT EXISTS login_attempts (
  key          TEXT PRIMARY KEY,
  fails        INTEGER NOT NULL,
  window_start INTEGER NOT NULL,
  locked_until INTEGER NOT NULL DEFAULT 0
);
