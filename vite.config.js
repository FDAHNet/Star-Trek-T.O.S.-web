import { readdirSync } from "node:fs";
import { defineConfig } from "vite";

var htmlEntries = Object.fromEntries(
  readdirSync(".")
    .filter(function (file) {
      return file.endsWith(".html");
    })
    .map(function (file) {
      return [file.replace(/\.html$/, ""), file];
    })
);

export default defineConfig({
  // Relative asset paths work on both GitHub Pages and Cloudflare deployments.
  base: "./",
  build: {
    rollupOptions: {
      input: htmlEntries
    }
  }
});
