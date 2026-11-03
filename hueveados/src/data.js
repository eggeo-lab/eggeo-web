// Datos del dashboard en D1: un registro por cliente, gasto, pago y ajuste.
//
// El dashboard manda solo los campos que cambió (upserts) y los registros que borró (deletes).
// Cada campo se fusiona con json_patch sobre lo que ya hay, así lo que otro socio agregó o
// editó en otros registros o campos nunca se pisa; en el mismo campo, gana el último en guardar.

const S = "string";
const N = "number";
const M = "month"; // "AAAA-MM" o vacío
const D = "date"; // "AAAA-MM-DD" o vacío
const B = "boolean";
const FIELDS = {
  clients: {
    cliente: S, servicio: S, cuenta: S, precio: N, contacto: S, frecuencia: S, contenido: S, feeAct: S, manu: N, elias: N, nico: N,
    modalidad: ["corriente", "vencido"], tiktok: B, facebook: B, instagram: B, googleAds: B,
  },
  expenses: { concepto: S, categoria: S, pagadoPor: S, monto: N, nota: S, tipo: ["mensual", "unica"], mes: M, desde: M, hasta: M },
  // Un pago por cliente y mes de servicio (id "<cliente>_<AAAA-MM>"). Guarda el nombre y el reparto
  // vigentes al cobrar, así el historial no cambia si después se edita o se borra el cliente.
  payments: { cliente: S, nombre: S, mes: M, monto: N, fecha: D, manu: N, elias: N, nico: N, marcadoPor: S },
  settings: { reparto: ["proporcional", "iguales"] },
};
const DEFAULT_SETTINGS = { reparto: "proporcional" };
const ID_RE = /^[A-Za-z0-9_-]{1,64}$/;
const MONTH_RE = /^\d{4}-(0[1-9]|1[0-2])$/;
const DATE_RE = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
const MAX_STRING = 500;
const MAX_OPS = 500;

export class InvalidChanges extends Error {}

export async function readState(db) {
  const { results } = await db
    .prepare("SELECT collection, id, data FROM records WHERE deleted = 0 ORDER BY created_at, id")
    .all();
  const state = { clients: [], expenses: [], payments: [], ...DEFAULT_SETTINGS };
  for (const row of results) {
    const data = JSON.parse(row.data);
    if (row.collection === "settings") {
      if (row.id === "main") for (const [k, v] of Object.entries(data)) if (validValue(FIELDS.settings[k], v)) state[k] = v;
    } else if (Object.hasOwn(FIELDS, row.collection)) {
      state[row.collection].push({ ...data, id: row.id });
    }
  }
  return state;
}

function validValue(type, value) {
  if (Array.isArray(type)) return type.includes(value);
  if (type === S) return typeof value === "string" && value.length <= MAX_STRING;
  if (type === N) return value === "" || (typeof value === "number" && Number.isFinite(value));
  if (type === M) return value === "" || (typeof value === "string" && MONTH_RE.test(value));
  if (type === D) return value === "" || (typeof value === "string" && DATE_RE.test(value));
  if (type === B) return typeof value === "boolean";
  return false;
}

function validTarget(op, allowSettings) {
  if (!op || typeof op !== "object") return false;
  if (op.collection === "settings") return allowSettings && op.id === "main";
  return Object.hasOwn(FIELDS, op.collection) && typeof op.id === "string" && ID_RE.test(op.id);
}

// Valida el cuerpo de /api/sync y devuelve { upserts, deletes } limpios.
export function parseChanges(body) {
  if (!body || typeof body !== "object") throw new InvalidChanges("Cuerpo inválido");
  const upserts = Array.isArray(body.upserts) ? body.upserts : [];
  const deletes = Array.isArray(body.deletes) ? body.deletes : [];
  if (upserts.length + deletes.length > MAX_OPS) throw new InvalidChanges("Demasiados cambios");

  const clean = { upserts: [], deletes: [] };
  for (const op of upserts) {
    if (!validTarget(op, true) || !op.data || typeof op.data !== "object" || Array.isArray(op.data)) {
      throw new InvalidChanges("Cambio inválido");
    }
    const fields = FIELDS[op.collection];
    const data = {};
    for (const [k, v] of Object.entries(op.data)) {
      if (!Object.hasOwn(fields, k) || !validValue(fields[k], v)) throw new InvalidChanges(`Campo inválido: ${op.collection}.${k}`);
      data[k] = v;
    }
    if (Object.keys(data).length) clean.upserts.push({ collection: op.collection, id: op.id, data });
  }
  for (const op of deletes) {
    if (!validTarget(op, false)) throw new InvalidChanges("Borrado inválido");
    clean.deletes.push({ collection: op.collection, id: op.id });
  }
  return clean;
}

export async function applyChanges(db, { upserts, deletes }, user) {
  const now = Date.now();
  const statements = [
    ...upserts.map((op) =>
      db
        .prepare(
          `INSERT INTO records (collection, id, data, deleted, created_at, updated_at, updated_by)
           VALUES (?1, ?2, ?3, 0, ?4, ?4, ?5)
           ON CONFLICT(collection, id) DO UPDATE SET
             data = json_patch(records.data, excluded.data),
             deleted = 0,
             updated_at = excluded.updated_at,
             updated_by = excluded.updated_by`,
        )
        .bind(op.collection, op.id, JSON.stringify(op.data), now, user),
    ),
    ...deletes.map((op) =>
      db
        .prepare("UPDATE records SET deleted = 1, updated_at = ?1, updated_by = ?2 WHERE collection = ?3 AND id = ?4")
        .bind(now, user, op.collection, op.id),
    ),
  ];
  if (statements.length) await db.batch(statements);
}
