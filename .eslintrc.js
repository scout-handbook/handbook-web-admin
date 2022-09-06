/* eslint-env node */

module.exports = {
  parserOptions: {
    project: "./tsconfig.json",
    sourceType: "script",
  },
  env: {
    browser: true,
    node: false,
  },
  plugins: ["compat", "@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:prettier/recommended",
  ],
  rules: {
    "compat/compat": "warn",
    "no-warning-comments": "warn",
    strict: ["error", "never"],
    "@typescript-eslint/array-type": ["error", { default: "generic" }],
    "@typescript-eslint/member-ordering": "error",
    "@typescript-eslint/no-extraneous-class": "error",
    "@typescript-eslint/no-namespace": ["error", { allowDeclarations: true }],
    "@typescript-eslint/no-non-null-assertion": "off",
  },
  settings: {
    polyfills: ["document.getElementsByClassName"],
  },
  overrides: [
    {
      parserOptions: {
        project: null,
      },
      files: ["gulpfile.js", "webpack.config.js", ".eslintrc.js"],
      rules: {
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
