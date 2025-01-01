import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { readFileSync } from "fs";

function getConfig() {
  if (!(process.env["npm_lifecycle_script"]?.startsWith("vite") ?? false)) {
    return {};
  }
  const location = process.env.VITE_CONFIG;
  if (location === undefined || location === "undefined") {
    throw new Error("No config specified");
  }
  return JSON.parse(readFileSync(location, "utf8"));
}

const config = getConfig();
const basePath =
  config["admin-uri"] !== undefined
    ? new URL(config["admin-uri"]).pathname
    : "";

export default {
  kit: {
    adapter: adapter({
      assets: "dist",
      fallback: "index.html",
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
        ...(config["csp-report-uri"] !== undefined && {
          "report-uri": [config["csp-report-uri"]],
        }),
      },
      mode: "hash",
    },
    paths: {
      base: basePath,
    },
  },
  preprocess: vitePreprocess(),
};
