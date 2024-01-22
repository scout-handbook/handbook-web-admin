import { sveltekit } from "@sveltejs/kit/vite";
//import legacy, { cspHashes } from "@vitejs/plugin-legacy";
import { readFileSync } from "fs";
import { defineConfig, loadEnv } from "vite";

/*
if (
  JSON.stringify(cspHashes) !==
  JSON.stringify([
    "MS6/3FCg4WjP9gwgaBGwLpRCY6fZBgwmhVCdrPrNf3E=",
    "tQjf8gvb2ROOMapIxFvFAYBeUJ0v1HCbOcSmDNXGtDo=",
    "4y/gEB2/KIwZFTfNqwXJq4olzvmQ0S214m9jwKgNXoc=",
    "+5XkZFazzJo8n0iOP4ti/cLCMUudTf//Mzkb7xNPXIc=",
  ])
) {
  throw new Error(
    "CSP Hashes are out of date in htaccess. New hashes: " +
      JSON.stringify(cspHashes),
  );
}
*/

function getConfig(mode: string): Record<string, string> {
  const location = loadEnv(mode, process.cwd()).VITE_CONFIG;
  if (location === "undefined") {
    throw new Error("No config specified");
  }
  return JSON.parse(readFileSync(location, "utf8")) as Record<string, string>;
}

export default defineConfig(({ mode }) => ({
  plugins: [
    //legacy(),
    sveltekit(),
  ],
  define: {
    // eslint-disable-next-line @typescript-eslint/naming-convention -- CLI variable
    CONFIG: JSON.stringify(getConfig(mode)),
  },
  build: {
    minify: false,
  },
}));
