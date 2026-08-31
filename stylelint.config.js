/** @type {import('stylelint').Config} */
export default {
  extends: [
    "stylelint-config-standard",
    "stylelint-config-html/svelte",
    "stylelint-prettier/recommended",
  ],
  plugins: ["stylelint-no-unsupported-browser-features"],
  rules: {
    "color-function-notation": "legacy",
    // The `inset` shorthand is above our floor (Safari 14.1 vs 14.0).
    "declaration-block-no-redundant-longhand-properties": [
      true,
      { ignoreShorthands: ["inset"] },
    ],
    "plugin/no-unsupported-browser-features": [
      true,
      {
        // Caniuse's partial flags cover cases these declarations do not use.
        ignore: ["css-overflow", "intrinsic-width"],
      },
    ],
    // Svelte scopes styles and exposes :global() to opt out.
    "selector-pseudo-class-no-unknown": [
      true,
      { ignorePseudoClasses: ["global"] },
    ],
  },
};
