import { svelte } from "@sveltejs/vite-plugin-svelte";
import legacy, { cspHashes } from "@vitejs/plugin-legacy";
import { readFileSync } from "fs";
import htaccess from "rollup-plugin-htaccess";
import { defineConfig, loadEnv, splitVendorChunkPlugin } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";

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

function getConfig(mode: string): Record<string, string> {
  const location = loadEnv(mode, process.cwd()).VITE_CONFIG;
  if (location === "undefined") {
    throw new Error("No config specified");
  }
  return JSON.parse(readFileSync(location, "utf8")) as Record<string, string>;
}

export default defineConfig(({ mode }) => ({
  plugins: [
    createHtmlPlugin({
      minify: true,
      entry: "ts/admin.ts",
      inject: {
        data: {
          title: getConfig(mode)["site-name"] + " - administrace",
        },
      },
    }),
    legacy(),
    splitVendorChunkPlugin(),
    svelte({
      configFile: "../svelte.config.js",
    }),
    /* eslint-disable @typescript-eslint/naming-convention -- Most of these are things like header names */
    htaccess({
      template: "txt/htaccess.txt",
      spec: {
        Header: [
          {
            action: "set",
            header: "Content-Security-Policy",
            value: {
              "upgrade-insecure-requests": true,
              "default-src": { self: true },
              "script-src": {
                self: true,
                hosts: ["https://ajax.googleapis.com/ajax/libs/webfont/"],
                hashes: {
                  sha256: [ // TODO: Use dynamic
                    "MS6/3FCg4WjP9gwgaBGwLpRCY6fZBgwmhVCdrPrNf3E=",
                    "tQjf8gvb2ROOMapIxFvFAYBeUJ0v1HCbOcSmDNXGtDo=",
                    "4y/gEB2/KIwZFTfNqwXJq4olzvmQ0S214m9jwKgNXoc=",
                    "+5XkZFazzJo8n0iOP4ti/cLCMUudTf//Mzkb7xNPXIc=",
                  ],
                },
              },
              "connect-src": {
                self: true,
                hosts: [
                  "https://fonts.gstatic.com/",
                  "https://ajax.googleapis.com/ajax/libs/webfont/",
                  "https://fonts.googleapis.com",
                ],
              },
              "style-src": {
                self: true,
                "unsafe-inline": true,
                hosts: ["https://fonts.googleapis.com"],
              },
              "font-src": {
                self: true,
                schemes: { data: true },
                hosts: ["https://fonts.gstatic.com"],
              },
              "img-src": {
                self: true,
                schemes: { data: true },
              },
              "object-src": {},
            },
            always: true,
          },
          {
            action: "set",
            header: "Permissions-Policy",
            value: {
              camera: {},
              "display-capture": {},
              fullscreen: { self: true },
              geolocation: {},
              microphone: {},
              "publickey-credentials-get": {},
              "screen-wake-lock": {},
              "web-share": {},
            },
            always: true,
          },
          {
            action: "set",
            header: "Referrer-Policy",
            value: "same-origin",
            always: true,
          },
          {
            action: "set",
            header: "Strict-Transport-Security",
            value: {
              maxAge: 31536000,
              includeSubDomains: true,
            },
            always: true,
          },
          {
            action: "set",
            header: "X-Content-Type-Options",
            value: {
              nosniff: true,
            },
            always: true,
          },
          {
            action: "set",
            header: "X-Xss-Protection",
            value: {
              mode: "block",
            },
            always: true,
          },
          {
            action: "set",
            header: "X-Frame-Options",
            value: "deny",
            always: true,
          },
        ],
      },
    }),
    /* eslint-enable */
  ],
  root: "src",
  base: getConfig(mode)["admin-uri"],
  build: {
    outDir: "../dist",
  },
  define: {
    // eslint-disable-next-line @typescript-eslint/naming-convention -- CLI variable
    CONFIG: JSON.stringify(getConfig(mode)),
  },
}));
