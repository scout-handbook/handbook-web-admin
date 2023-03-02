/* eslint-env node */

const fs = require("fs");
const nestedObjectAssign = require("nested-object-assign");
const yargs = require("yargs");

const autoprefixer = require("autoprefixer");
const postcssCustomProperties = require("postcss-custom-properties");
const postcssJitProps = require("postcss-jit-props");

function getConfig() {
  let config = JSON.parse(fs.readFileSync("src/json/config.json", "utf8"));
  const overrideLocation = yargs.string("config").argv.config;
  if (overrideLocation) {
    config = nestedObjectAssign(
      config,
      JSON.parse(fs.readFileSync(overrideLocation, "utf8"))
    );
  }
  return config;
}

module.exports = {
  plugins: [
    postcssJitProps(getConfig()["custom-properties"]),
    postcssCustomProperties({ preserve: false }),
    autoprefixer(),
  ],
};
