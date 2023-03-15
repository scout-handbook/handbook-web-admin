/* eslint-env node */

var exec = require("child_process").exec;
const gulp = require("gulp");
const yargs = require("yargs");

const cleanCSS = require("gulp-clean-css");
const concat = require("gulp-concat");
const inject = require("gulp-inject-string");
const merge = require("merge-stream");
const postcss = require("gulp-postcss");
const rename = require("gulp-rename");
const sourcemaps = require("gulp-sourcemaps");
const through = require("through2");
const webpack = require("webpack-stream");

gulp.task("build:main", function (cb) {
  const config = yargs.argv.config;
  exec(
    "npx webpack --color -c admin.webpack.config.js --env client-config=" +
      config,
    function (err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      cb(err);
    }
  );
});

gulp.task("build:js:worker", function () {
  return gulp
    .src("src/ts/admin-worker.ts")
    .pipe(webpack(require("./webpack.config.js")))
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(
      through.obj(function (file, _, cb) {
        const isSourceMap = /\.map$/.test(file.path);
        if (!isSourceMap) this.push(file);
        cb();
      })
    )
    .pipe(
      inject.prepend(
        'importScripts("showdown.min.js");\nimportScripts("xss.min.js");\n'
      )
    )
    .pipe(rename({ basename: "admin-worker", suffix: ".min" }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("dist/"));
});

gulp.task("build:js", gulp.parallel("build:js:worker"));

gulp.task("build:css", function () {
  function bundle(name, sources) {
    return (
      gulp
        .src(sources)
        .pipe(sourcemaps.init())
        .pipe(concat(name + ".min.css"))
        .pipe(postcss())
        //.pipe(gulp.dest('dist/'));
        .pipe(cleanCSS())
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest("dist/"))
    );
  }
  return merge(bundle("error", ["src/css/error.css"]));
});

gulp.task("build:php", function () {
  return gulp.src(["src/php/lesson.php"]).pipe(gulp.dest("dist/"));
});

gulp.task("build:txt", function () {
  return gulp.src(["src/txt/htaccess.txt"]).pipe(gulp.dest("dist/"));
});

gulp.task("build:png", function () {
  return gulp.src(["src/png/avatar.png"]).pipe(gulp.dest("dist/"));
});

gulp.task("build:deps", function () {
  return gulp
    .src([
      "node_modules/easymde/dist/easymde.min.css",
      "node_modules/easymde/dist/easymde.min.js",
      "node_modules/showdown/dist/showdown.min.js",
      "node_modules/showdown/dist/showdown.min.js.map",
      "node_modules/xss/dist/xss.min.js",
    ])
    .pipe(gulp.dest("dist/"));
});

gulp.task("build:icon", function () {
  return gulp
    .src([
      "src/icon/apple-touch-icon.png",
      "src/icon/browserconfig.xml",
      "src/icon/favicon-16x16.png",
      "src/icon/favicon-32x32.png",
      "src/icon/favicon.ico",
      "src/icon/mstile-150x150.png",
      "src/icon/safari-pinned-tab.svg",
    ])
    .pipe(gulp.dest("dist/"));
});

gulp.task(
  "build",
  gulp.parallel(
    "build:main",
    "build:css",
    "build:js",
    "build:php",
    "build:txt",
    "build:png",
    "build:deps",
    "build:icon"
  )
);
