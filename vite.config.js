import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/", // Esto es vital para que las rutas funcionen en www.eggeo.com.ar
});
