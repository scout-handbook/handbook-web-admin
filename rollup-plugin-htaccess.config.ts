import type { Options } from "rollup-plugin-htaccess";

/* eslint-disable @typescript-eslint/naming-convention -- Most of these are things like header names */
const options: (
  config: Record<string, string>,
  cspHashes: Array<string>,
) => Partial<Options> = (config, cspHashes) => ({
  spec: {
    AddOutputFilterByType: [
      {
        filters: ["DEFLATE"],
        mediaTypes: [
          "text/plain",
          "text/html",
          "text/css",
          "application/javascript",
          "application/json",
        ],
      },
    ],
    ErrorDocument: {
      403: "/admin/403.html",
      404: "/admin/404.html",
      500: "/admin/500.html",
    },
    Options: {
      minus: ["Indexes"],
    },
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
              sha256: cspHashes,
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
          ...(config["csp-report-uri"] && {
            "report-uri": [config["csp-report-uri"]],
          }),
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
    ],
    rewrite: {
      rules: [
        // Force HTTPS
        {
          conditions: [
            {
              testString: "%{HTTPS}",
              conditionPattern: "off",
            },
          ],
          pattern: "(.*)",
          substitution: "https://%{HTTP_HOST}%{REQUEST_URI}",
          flags: {
            last: true,
            qsappend: true,
            redirect: 301,
          },
        },
        // Pages rewrite
        {
          conditions: [
            {
              testString: "%{REQUEST_URI}",
              conditionPattern:
                "^/admin/(lessons|competences|images|users|groups)(/|$)",
            },
          ],
          pattern: "(.*)",
          substitution: "/admin/",
          flags: {
            last: true,
            qsappend: true,
          },
        },
        // PDF rewrite
        {
          pattern: "^lesson/(.*)",
          substitution: "lesson.php?id=$1",
          flags: {
            qsappend: true,
          },
        },
      ],
    },
  },
});
/* eslint-enable */

export default options;
