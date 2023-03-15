/* eslint-env node */

const fs = require("fs");
const path = require("path");
const webpack = require("webpack");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const sveltePreprocess = require("svelte-preprocess");
const TerserPlugin = require("terser-webpack-plugin");

function getConfig(env) {
  if (env["client-config"] === undefined) {
    throw new Error("No config specified");
  }
  return JSON.parse(fs.readFileSync(env["client-config"], "utf8"));
}

module.exports = (env) => {
  const mode =
    process.env.NODE_ENV ?? (env.development ? "development" : "production");
  const config = getConfig(env);
  return {
    mode,
    devtool: mode === "development" ? "source-map" : false,
    plugins: [
      new HtmlWebpackPlugin({
        base: config["admin-uri"] + "/",
        configuration: config,
        title: config["site-name"] + " - administrace",
        template: "./src/html/index.html",
      }),
      new MiniCssExtractPlugin(),
      new webpack.DefinePlugin({
        CONFIG: JSON.stringify(config),
      }),
    ],
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, "css-loader"],
        },
        {
          test: /\.svelte$/,
          use: {
            loader: "svelte-loader",
            options: {
              compilerOptions: {
                dev: mode === "development",
              },
              emitCss: true,
              preprocess: sveltePreprocess({
                postcss: true,
                tsconfigFile: "./tsconfig.json",
              }),
            },
          },
        },
        {
          test: /\.ts$/,
          use: {
            loader: "ts-loader",
            options: {
              onlyCompileBundledFiles: true,
            },
          },
        },
      ],
    },
    resolve: {
      alias: {
        svelte: path.resolve("node_modules", "svelte"),
      },
      conditionNames: ["require", "node", "svelte"],
      extensions: [".ts", ".js", ".svelte"],
      mainFields: ["svelte", "browser", "module", "main"],
    },
    entry: "./src/ts/admin.ts",
    output: {
      filename: "[name].js",
    },
    optimization: {
      minimize: mode === "production",
      minimizer: [
        new TerserPlugin({
          extractComments: false,
          terserOptions: {
            format: {
              comments: false,
            },
          },
        }),
      ],
      splitChunks: {
        chunks: "all",
      },
    },
  };
};
