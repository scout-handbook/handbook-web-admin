/* eslint-env node */

module.exports = {
  parserOptions: {
    project: "./tsconfig.json",
    sourceType: "script",
    extraFileExtensions: [".svelte"],
  },
  env: {
    browser: true,
    node: false,
  },
  plugins: ["compat", "deprecation", "@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:svelte/recommended",
    "plugin:prettier/recommended",
    "plugin:svelte/prettier",
  ],
  rules: {
    "compat/compat": "warn",
    "deprecation/deprecation": "warn",
    "no-warning-comments": "warn",
    strict: ["error", "never"],
    "@typescript-eslint/array-type": ["error", { default: "generic" }],
    "@typescript-eslint/member-ordering": "error",
    "@typescript-eslint/no-extraneous-class": "error",
    "@typescript-eslint/no-namespace": ["error", { allowDeclarations: true }],
    "@typescript-eslint/no-non-null-assertion": "off",
    "svelte/no-store-async": "error",
    "svelte/no-target-blank": "error",
    "svelte/button-has-type": "error",
    "svelte/no-reactive-functions": "error",
    "svelte/no-reactive-literals": "error",
    "svelte/no-useless-mustaches": "error",
    "svelte/require-optimized-style-attribute": "error",
    "svelte/require-stores-init": "error",
    "svelte/derived-has-same-inputs-outputs": "error",
    "svelte/no-extra-reactive-curlies": "error",
    "svelte/prefer-class-directive": "error",
    "svelte/prefer-style-directive": "error",
    "svelte/sort-attributes": "error",
    "svelte/spaced-html-comment": "error",
  },
  settings: {
    svelte: {
      ignoreWarnings: ["@typescript-eslint/explicit-function-return-type"],
    },
  },
  overrides: [
    {
      files: ["*.svelte"],
      parser: "svelte-eslint-parser",
      parserOptions: {
        parser: "@typescript-eslint/parser",
      },
      rules: {
        "deprecation/deprecation": "off",
      },
    },
    {
      parserOptions: {
        project: null,
      },
      files: ["gulpfile.js", "webpack.config.js", ".eslintrc.js"],
      rules: {
        "deprecation/deprecation": "off",
        "@typescript-eslint/await-thenable": "off",
        "@typescript-eslint/no-floating-promises": "off",
        "@typescript-eslint/no-implied-eval": "off",
        "@typescript-eslint/no-misused-promises": "off",
        "@typescript-eslint/no-unnecessary-type-assertion": "off",
        "@typescript-eslint/no-unsafe-argument": "off",
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/no-unsafe-call": "off",
        "@typescript-eslint/no-unsafe-member-access": "off",
        "@typescript-eslint/no-unsafe-return": "off",
        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/require-await": "off",
        "@typescript-eslint/restrict-plus-operands": "off",
        "@typescript-eslint/restrict-template-expressions": "off",
        "@typescript-eslint/unbound-method": "off",
      },
    },
  ],
};
