-- Pagos y cuentas de redes.
-- Los pagos van en "records" (colección "payments") y no necesitan tablas nuevas.

-- Clientes existentes: cobran a mes corriente y todavía no tienen redes elegidas.
-- Solo toca clientes sin "modalidad": no borra, no duplica y correrla de nuevo no cambia nada.
UPDATE records
SET data = json_patch(data, '{"modalidad":"corriente","tiktok":false,"facebook":false,"instagram":false,"googleAds":false}'),
    updated_at = CAST(unixepoch('subsec') * 1000 AS INTEGER),
    updated_by = 'migracion-0002'
WHERE collection = 'clients' AND json_extract(data, '$.modalidad') IS NULL;

-- Usuario y contraseña de cada red de cada cliente. La contraseña va cifrada (AES-GCM, clave HV_VAULT_KEY).
CREATE TABLE IF NOT EXISTS credentials (
  cliente      TEXT NOT NULL,
  red          TEXT NOT NULL,
  usuario      TEXT NOT NULL DEFAULT '',
  password_enc TEXT,
  nota         TEXT NOT NULL DEFAULT '',
  updated_at   INTEGER NOT NULL,
  updated_by   TEXT,
  PRIMARY KEY (cliente, red)
);

-- Quién vio, copió, cambió o borró cada contraseña.
CREATE TABLE IF NOT EXISTS credential_log (
  id      INTEGER PRIMARY KEY AUTOINCREMENT,
  at      INTEGER NOT NULL,
  user    TEXT NOT NULL,
  cliente TEXT NOT NULL,
  red     TEXT NOT NULL,
  accion  TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS credential_log_cuenta ON credential_log (cliente, red, at);
