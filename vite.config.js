import { defineConfig } from "vite";

export default defineConfig({
  // Relative asset paths work on both GitHub Pages and Cloudflare deployments.
  base: "./",
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        temporada1: "temporada-1.html",
        temporada2: "temporada-2.html",
        temporada3: "temporada-3.html"
      }
    }
  }
});
