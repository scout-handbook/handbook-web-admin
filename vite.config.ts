import { svelte } from "@sveltejs/vite-plugin-svelte";
import { readFileSync } from "fs";
import { defineConfig, loadEnv } from "vite";

function getConfig(mode: string): unknown {
  const location = loadEnv(mode, process.cwd()).VITE_CONFIG;
  if (location === "undefined") {
    throw new Error("No config specified");
  }
  return readFileSync(location, "utf8");
}

export default defineConfig(({ mode }) => ({
  root: "src",
  base: "./",
  build: {
    outDir: "../dist",
  },
  plugins: [
    svelte({
      configFile: "../svelte.config.js",
    }),
  ],
  define: {
    CONFIG: getConfig(mode),
  },
}));
