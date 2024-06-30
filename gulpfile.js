/* eslint-env node */

import { exec } from "child_process";
import gulp from "gulp";
import postcss from "gulp-postcss";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

gulp.task("build", (cb) => {
  const config = yargs(hideBin(process.argv)).string("config").argv.config;
  exec('VITE_CONFIG="' + config + '" npx vite build', (err, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});
