import { sveltekit } from "@sveltejs/kit/vite";
import { readFileSync } from "fs";
import htaccess from "rollup-plugin-htaccess";
import { defineConfig, loadEnv } from "vite";

import options from "./rollup-plugin-htaccess.config";

function getConfig(mode: string): Record<string, string> {
  if (!(process.env["npm_lifecycle_script"]?.startsWith("vite") ?? false)) {
    return {};
  }
  const location = loadEnv(mode, process.cwd())["VITE_CONFIG"] as
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
    define: {
      CONFIG: JSON.stringify(config),
    },
    plugins: [sveltekit(), htaccess(options)],
  };
});
