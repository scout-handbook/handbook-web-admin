import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

export default {
  kit: {
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
      base: `/${process.env.VITE_BASEPATH ?? "admin"}`,
    },
  },
  preprocess: vitePreprocess(),
};
