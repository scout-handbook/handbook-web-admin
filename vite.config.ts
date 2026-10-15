import adapter from "@sveltejs/adapter-static";
import { sveltekit } from "@sveltejs/kit/vite";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import htaccess from "rollup-plugin-htaccess";
import { defineConfig } from "vite";

import options from "./rollup-plugin-htaccess.config.ts";
import { htmlToPhp } from "./rollup-plugin-html-to-php.ts";

export default defineConfig({
  build: {
    target: "es2021",
  },
  plugins: [
    sveltekit({
      adapter: adapter({
        assets: "dist",
        fallback: "fallback.php",
        pages: "dist",
        precompress: false,
        strict: true,
      }),
      csp: {
        directives: {
          "default-src": ["self"],
          "font-src": ["self", "data:"],
          "img-src": ["self", "data:"],
          "object-src": ["none"],
          "style-src": ["self", "unsafe-inline"],
          "upgrade-insecure-requests": true,
        },
        mode: "hash",
      },
      paths: {
        base: `/${process.env["VITE_BASEPATH"] ?? "admin"}`,
      },
      preprocess: vitePreprocess(),
    }),
    htmlToPhp("dist"),
    htaccess(options),
  ],
});
