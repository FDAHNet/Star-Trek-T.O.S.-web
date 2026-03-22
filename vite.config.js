import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/Star-Trek-T.O.S.-web/",
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL("./index.html", import.meta.url)),
        temporada1: fileURLToPath(new URL("./temporada-1.html", import.meta.url)),
        temporada2: fileURLToPath(new URL("./temporada-2.html", import.meta.url)),
        temporada3: fileURLToPath(new URL("./temporada-3.html", import.meta.url))
      }
    }
  }
});
