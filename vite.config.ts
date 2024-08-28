import { svelte } from "@sveltejs/vite-plugin-svelte";
import legacy, { cspHashes } from "@vitejs/plugin-legacy";
import { readFileSync } from "fs";
import htaccess from "rollup-plugin-htaccess";
import { defineConfig, loadEnv, splitVendorChunkPlugin } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";

import options from "./rollup-plugin-htaccess.config";

function getConfig(mode: string): Record<string, string> {
  const location = loadEnv(mode, process.cwd()).VITE_CONFIG as
    | string
    | undefined;
  if (location === undefined || location === "undefined") {
    throw new Error("No config specified");
  }
  return JSON.parse(readFileSync(location, "utf8")) as Record<string, string>;
}

export default defineConfig(({ mode }) => {
  const config = getConfig(mode);
  return {
    plugins: [
      createHtmlPlugin({
        minify: true,
        entry: "ts/admin.ts",
        inject: {
          data: {
            title: `${config["site-name"]} - administrace`,
          },
        },
      }),
      legacy(),
      splitVendorChunkPlugin(),
      svelte({
        configFile: "../svelte.config.js",
      }),
      htaccess(options(config, cspHashes)),
    ],
    root: "src",
    base: config["admin-uri"],
    build: {
      outDir: "../dist",
    },
    define: {
      // eslint-disable-next-line @typescript-eslint/naming-convention -- CLI variable
      CONFIG: JSON.stringify(config),
    },
  };
});
