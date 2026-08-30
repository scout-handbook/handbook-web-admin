import { sveltekit } from "@sveltejs/kit/vite";
import htaccess from "rollup-plugin-htaccess";
import { defineConfig } from "vite";

import options from "./rollup-plugin-htaccess.config";
import { htmlToPhp } from "./rollup-plugin-html-to-php";

export default defineConfig({
  build: {
    target: "es2021",
  },
  plugins: [sveltekit(), htmlToPhp("dist"), htaccess(options)],
});
