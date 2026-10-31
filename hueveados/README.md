# Backoffice /hueveados

Dashboard de finanzas privado en `www.eggeo.com.ar/hueveados`. Es un Cloudflare Worker con base D1
que atiende solo esa ruta; el resto del sitio sigue en GitHub Pages sin cambios.

```
src/worker.js        rutas: login, logout, dashboard y API (todo exige sesión salvo el login)
src/auth.js          usuarios, límite de intentos y sesiones ("Mantener sesión iniciada": 90 días renovables)
src/password.js      hash PBKDF2-SHA256 (25.000 iteraciones, para entrar en el plan gratis)
src/data.js          lectura y guardado en D1 (fusión por campo)
src/login.js         página de login
src/dashboard.html   el dashboard (React UMD + Babel), sin datos adentro
schema.sql           tablas de D1
migrations/          cambios en los datos de D1 (se aplican con npm run db:migrate)
scripts/hash-password.mjs   genera contraseñas y sus hashes
scripts/build-seed.mjs      arma seed.sql desde el SEED de ../dashboard.html (no se commitea)
```

Secretos del Worker (nunca en el repo): `HV_PASS_MANU`, `HV_PASS_ELIAS`, `HV_PASS_NICO`.

## Primera instalación

Todo se corre en una terminal dentro de esta carpeta (`eggeo-ext/hueveados`).

1. `npm install`: instala wrangler, la herramienta de Cloudflare.
2. `npx wrangler login`: abre el navegador para autorizar la cuenta de Cloudflare.
3. `npx wrangler d1 create eggeo-hueveados`: crea la base. Copiar el `database_id` que muestra y
   pegarlo en `wrangler.toml` en lugar de `PEGAR_ACA_EL_DATABASE_ID`.
4. `npm run db:schema` y después `npm run db:migrate`: crean las tablas y aplican las migraciones.
5. `npm run db:seed`: carga los clientes y gastos del SEED (lee `../dashboard.html`). Se puede
   repetir sin duplicar nada.
6. `npx wrangler deploy`: publica el Worker.
7. `npm run hash` tres veces (una por socio), y por cada hash:
   `npx wrangler secret put HV_PASS_MANU` (después `HV_PASS_ELIAS` y `HV_PASS_NICO`) y pegar el hash.
8. En el panel de Cloudflare: SSL/TLS en **Full** y después proxy (nube naranja) en los registros
   DNS de `eggeo.com.ar` y `www`.

## Uso diario

- Publicar cambios de código: `npx wrangler deploy`.
- Si el cambio trae una migración nueva en `migrations/`: primero `npm run db:migrate`, después `npx wrangler deploy`.
- Cambiar una contraseña: `npm run hash` y `npx wrangler secret put HV_PASS_<SOCIO>`.
- Cerrar todas las sesiones abiertas:
  `npx wrangler d1 execute eggeo-hueveados --remote --command "DELETE FROM sessions"`.
- Desbloquear un login bloqueado por intentos fallidos:
  `npx wrangler d1 execute eggeo-hueveados --remote --command "DELETE FROM login_attempts"`.
- Si el login da "Error 1102" (límite de CPU), regenerar los hashes con menos iteraciones:
  `npm run hash -- --iter 15000`.

## Probar en local

```
npm run db:schema:local
npm run db:migrate:local
npm run db:seed:local
npm run hash -- "una-contraseña-de-prueba"   # pegar el hash en .dev.vars como HV_PASS_MANU=...
npm run dev                                  # http://localhost:8787/hueveados/
```
