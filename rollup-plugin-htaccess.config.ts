import type { Options } from "rollup-plugin-htaccess";

const options: Partial<Options> = {
  extractMetaCSP: {
    defaultPolicyFile: "index.html",
    enabled: true,
    outputDir: "dist",
  },
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
    Header: [
      {
        action: "set",
        always: true,
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
      },
      {
        action: "set",
        always: true,
        header: "Referrer-Policy",
        value: "same-origin",
      },
      {
        action: "set",
        always: true,
        header: "Strict-Transport-Security",
        value: {
          includeSubDomains: true,
          maxAge: 31536000,
        },
      },
      {
        action: "set",
        always: true,
        header: "X-Content-Type-Options",
        value: {
          nosniff: true,
        },
      },
    ],
    Options: {
      minus: ["Indexes"],
    },
    rewrite: {
      rules: [
        // Force HTTPS
        {
          conditions: [
            {
              conditionPattern: "off",
              testString: "%{HTTPS}",
            },
          ],
          flags: {
            last: true,
            qsappend: true,
            redirect: 301,
          },
          pattern: "(.*)",
          substitution: "https://%{HTTP_HOST}%{REQUEST_URI}",
        },
        // Pages rewrite
        {
          conditions: [
            {
              conditionPattern:
                "^/admin/(lessons|competences|images|users|groups)(/|$)",
              testString: "%{REQUEST_URI}",
            },
          ],
          flags: {
            last: true,
            qsappend: true,
          },
          pattern: "(.*)",
          substitution: "/admin/",
        },
        // PDF rewrite
        {
          flags: {
            qsappend: true,
          },
          pattern: "^lesson/(.*)",
          substitution: "lesson.php?id=$1",
        },
      ],
    },
  },
};

export default options;
