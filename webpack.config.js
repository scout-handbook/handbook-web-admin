/* eslint-env node */

module.exports = {
  mode: "development",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: "ts-loader",
        },
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js", ".svelte"],
  },
  entry: {
    index: "./src/ts/main.ts",
  },
  output: {
    filename: "[name].js",
  },
};
