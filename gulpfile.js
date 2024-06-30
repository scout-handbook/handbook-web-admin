/* eslint-env node */

import { exec } from "child_process";
import gulp from "gulp";
import postcss from "gulp-postcss";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

gulp.task("build:main", (cb) => {
  const config = yargs(hideBin(process.argv)).string("config").argv.config;
  exec('VITE_CONFIG="' + config + '" npx vite build', (err, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

gulp.task("build:error:css", () =>
  gulp.src(["src/css/error.css"]).pipe(postcss()).pipe(gulp.dest("dist/")),
);

gulp.task("build", gulp.parallel("build:main", "build:error:css"));
