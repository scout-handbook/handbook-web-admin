import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src",
  base: "./",
  build: {
    outDir: "../dist",
  },
  plugins: [svelte({
    configFile: "../svelte.config.js",
  })],
});
