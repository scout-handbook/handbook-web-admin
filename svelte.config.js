import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { readFileSync } from "fs";

function getConfig() {
  const location = process.env.VITE_CONFIG;
  if (location === undefined || location === "undefined") {
    throw new Error("No config specified");
  }
  return JSON.parse(readFileSync(location, "utf8"));
}

function getBasePath() {
  if (process.env.npm_lifecycle_script !== "vite") {
    return "";
  }
  return new URL(getConfig()["admin-uri"]).pathname;
}

export default {
  kit: {
    adapter: adapter({
      assets: "dist",
      fallback: "index.html",
      pages: "dist",
      precompress: false,
      strict: true,
    }),
    paths: {
      base: getBasePath(),
    },
  },
  preprocess: vitePreprocess(),
};
