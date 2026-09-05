import { sveltekit } from "@sveltejs/kit/vite";
import htaccess from "rollup-plugin-htaccess";
import { defineConfig } from "vite";

import options from "./rollup-plugin-htaccess.config.ts";
import { htmlToPhp } from "./rollup-plugin-html-to-php.ts";

export default defineConfig({
  build: {
    target: "es2021",
  },
  plugins: [sveltekit(), htmlToPhp("dist"), htaccess(options)],
});
