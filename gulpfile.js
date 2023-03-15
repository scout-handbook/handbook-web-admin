/* eslint-env node */

var exec = require("child_process").exec;
const gulp = require("gulp");
const yargs = require("yargs");

const postcss = require("gulp-postcss");

gulp.task("build:main", function (cb) {
  const config = yargs.argv.config;
  exec(
    "npx webpack --color --env client-config=" + config,
    function (err, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      cb(err);
    }
  );
});

gulp.task("build:error:css", function () {
  return gulp
    .src(["src/css/error.css"])
    .pipe(postcss())
    .pipe(gulp.dest("dist/"));
});

gulp.task("build:error:html", function () {
  return gulp
    .src(["src/html/403.html", "src/html/404.html", "src/html/500.html"])
    .pipe(gulp.dest("dist/"));
});

gulp.task("build:error", gulp.parallel("build:error:css", "build:error:html"));

gulp.task("build:php", function () {
  return gulp.src(["src/php/lesson.php"]).pipe(gulp.dest("dist/"));
});

gulp.task("build:txt", function () {
  return gulp.src(["src/txt/htaccess.txt"]).pipe(gulp.dest("dist/"));
});

gulp.task("build:png", function () {
  return gulp.src(["src/png/avatar.png"]).pipe(gulp.dest("dist/"));
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
    "build:error",
    "build:php",
    "build:txt",
    "build:png",
    "build:icon"
  )
);
