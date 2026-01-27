# EGGEO — Landing (React + Vite)

Landing one‑page moderna para **EGGEO** (branding fijo, ES/EN, dark mode, overlay móvil, modales de packs y “egg‑wipe” para casos).

## Requisitos
- **Node.js 18+** (recomendado LTS)
- **npm** 9+ (o `pnpm`/`yarn`, ajustes de comandos abajo)

## Instalación
```bash
# 1) Entrá a la carpeta
cd eggeo-landing

# 2) Instalá dependencias
npm install
```

## Desarrollo
```bash
npm run dev
# Abre http://localhost:5173
```

## Build de producción
```bash
npm run build
npm run preview  # levanta un server local para testear el build
```

## Estructura
```
eggeo-landing/
  ├─ index.html
  ├─ package.json
  ├─ vite.config.js
  ├─ public/
  │   └─ logo.png          # (opcional, reemplazá por tu logo)
  └─ src/
      ├─ main.jsx          # bootstrap React
      ├─ App.jsx           # UI principal (componentes incluidos)
      └─ styles.css        # estilos globales
```

## Personalización rápida
- Idioma por defecto: editar `lang` en `App.jsx` (`es`/`en`).
- Modo: `theme` (`light`/`dark`), también desde el toggle del header.
- Logos de clientes: reemplazá la lista en `App.jsx` (componente `LogoWall`).
- Packs: editar `packData` (precios/items) en `App.jsx`.
- Métricas demo (Insights): en la sección `INSIGHTS` de `App.jsx`.

## Notas
- Accesible: traps de foco en modales/menu, `prefers-reduced-motion`, contrastes AA.
- Overlay móvil **opaco** (no transparente) + blur sutil.
- “Egg‑wipe” al abrir un caso (overlay con clip‑path elíptico).
- Micro‑animaciones suaves y `scroll-margin-top` para anclas con header sticky.
- Smoke checks mínimos por consola (no requiere Jest).

---

Hecho con ❤️ para EGGEO.
