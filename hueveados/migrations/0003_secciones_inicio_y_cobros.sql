-- Secciones de gastos, inicio del sistema en noviembre 2026, clientes con período y cobros por mes de cobro.
-- Solo toca lo que todavía no tiene los campos nuevos: correrla de nuevo no cambia nada.

-- 1) Gastos: la sección sale de la categoría. Editor/CM van a "Editores y CM" con ese rol y Cuenta = General.
UPDATE records
SET data = json_set(data,
      '$.seccion', CASE WHEN json_extract(data, '$.categoria') IN ('Editor', 'CM') THEN 'editores' ELSE 'plataformas' END,
      '$.rol',     CASE WHEN json_extract(data, '$.categoria') IN ('Editor', 'CM') THEN json_extract(data, '$.categoria') ELSE '' END,
      '$.cuenta',  CASE WHEN json_extract(data, '$.categoria') IN ('Editor', 'CM') THEN 'general' ELSE '' END),
    updated_at = CAST(unixepoch('subsec') * 1000 AS INTEGER),
    updated_by = 'migracion-0003'
WHERE collection = 'expenses' AND json_extract(data, '$.seccion') IS NULL;

-- 2) Nada empieza antes de noviembre 2026.
UPDATE records
SET data = json_set(data, '$.desde', '2026-11'), updated_at = CAST(unixepoch('subsec') * 1000 AS INTEGER), updated_by = 'migracion-0003'
WHERE collection = 'expenses' AND json_extract(data, '$.desde') <> '' AND json_extract(data, '$.desde') < '2026-11';
UPDATE records
SET data = json_set(data, '$.mes', '2026-11'), updated_at = CAST(unixepoch('subsec') * 1000 AS INTEGER), updated_by = 'migracion-0003'
WHERE collection = 'expenses' AND json_extract(data, '$.mes') <> '' AND json_extract(data, '$.mes') < '2026-11';

-- 3) Clientes: activos desde noviembre 2026, sin fecha de fin.
UPDATE records
SET data = json_patch(data, '{"activoDesde":"2026-11","activoHasta":""}'),
    updated_at = CAST(unixepoch('subsec') * 1000 AS INTEGER),
    updated_by = 'migracion-0003'
WHERE collection = 'clients' AND json_extract(data, '$.activoDesde') IS NULL;

-- 4) Pagos: el mes pasa a ser el de cobro (cuando entra la plata), no el del servicio. Todo lo cobrado
--    antes del inicio se cobró en noviembre. Si el cliente ya tiene un cobro en noviembre, el de octubre
--    era un doble registro: se marca borrado, no se elimina.
UPDATE records
SET deleted = 1, updated_at = CAST(unixepoch('subsec') * 1000 AS INTEGER), updated_by = 'migracion-0003'
WHERE collection = 'payments' AND deleted = 0 AND json_extract(data, '$.mes') < '2026-11'
  AND EXISTS (
    SELECT 1 FROM records n
    WHERE n.collection = 'payments' AND n.deleted = 0 AND n.id = json_extract(records.data, '$.cliente') || '_2026-11'
  );
UPDATE records
SET id = json_extract(data, '$.cliente') || '_2026-11',
    data = json_set(data, '$.servicio', json_extract(data, '$.mes'), '$.mes', '2026-11'),
    updated_at = CAST(unixepoch('subsec') * 1000 AS INTEGER),
    updated_by = 'migracion-0003'
WHERE collection = 'payments' AND deleted = 0 AND json_extract(data, '$.mes') < '2026-11'
  AND NOT EXISTS (
    SELECT 1 FROM records n
    WHERE n.collection = 'payments' AND n.id = json_extract(records.data, '$.cliente') || '_2026-11'
  );
