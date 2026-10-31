-- Tipos de gasto: "mensual" (suscripción con desde/hasta) o "unica" (un solo mes).
-- Los gastos que ya existen pasan a suscripción mensual activa desde 2026-10.
-- Solo toca gastos sin "tipo": no borra, no duplica y correrla de nuevo no cambia nada.
UPDATE records
SET data = json_patch(data, '{"tipo":"mensual","desde":"2026-10","hasta":"","mes":""}'),
    updated_at = CAST(unixepoch('subsec') * 1000 AS INTEGER),
    updated_by = 'migracion-0001'
WHERE collection = 'expenses' AND json_extract(data, '$.tipo') IS NULL;
