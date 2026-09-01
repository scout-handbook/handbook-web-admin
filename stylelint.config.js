/** @type {import('stylelint').Config} */
export default {
  extends: ["stylelint-config-standard", "stylelint-prettier/recommended"],
  rules: {
    "color-function-notation": "legacy",
  },
};
