import { svelte } from "@sveltejs/vite-plugin-svelte";
import legacy from "@vitejs/plugin-legacy";
import { readFileSync } from "fs";
import { defineConfig, loadEnv, splitVendorChunkPlugin } from "vite";

function getConfig(mode: string): unknown {
  const location = loadEnv(mode, process.cwd()).VITE_CONFIG;
  if (location === "undefined") {
    throw new Error("No config specified");
  }
  return readFileSync(location, "utf8");
}

export default defineConfig(({ mode }) => ({
  plugins: [
    legacy(),
    splitVendorChunkPlugin(),
    svelte({
      configFile: "../svelte.config.js",
    }),
  ],
  root: "src",
  base: "./",
  build: {
    outDir: "../dist",
  },
  define: {
    CONFIG: getConfig(mode),
  },
}));
