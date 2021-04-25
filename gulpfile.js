/* eslint-env node */

const yargs = require("yargs");
const fs = require("fs");
const nestedObjectAssign = require("nested-object-assign");

const gulp = require("gulp");
const uglify = require("uglify-js");
const composer = require("gulp-uglify/composer");
const merge = require("merge-stream");
const sourcemaps = require("gulp-sourcemaps");
const concat = require("gulp-concat");
const cleanCSS = require("gulp-clean-css");
const postcss = require("gulp-postcss");
const postcssCustomProperties = require("postcss-custom-properties");
const autoprefixer = require("autoprefixer");
const inject = require("gulp-inject-string");
const htmlmin = require("gulp-htmlmin");
const ts = require("gulp-typescript");

const minify = composer(uglify, console);

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

gulp.task("build:html", function () {
  return (
    merge(
      gulp.src(["src/html/403.html", "src/html/404.html", "src/html/500.html"]),
      gulp
        .src(["src/html/index.html"])
        .pipe(inject.replace("<!--ADMIN-URI-->", getConfig()["admin-uri"]))
    )
      .pipe(sourcemaps.init())
      .pipe(inject.replace("<!--SITE-NAME-->", getConfig()["site-name"]))
      //.pipe(gulp.dest('dist/'));
      .pipe(htmlmin({ collapseWhitespace: true }))
      .pipe(sourcemaps.write("./"))
      .pipe(gulp.dest("dist/"))
  );
});

gulp.task("build:js", function () {
  function bundle(name, addConfig = false) {
    const tsProject = ts.createProject("tsconfig/" + name + ".json");
    let ret = tsProject
      .src()
      .pipe(sourcemaps.init())
      .pipe(tsProject())
      .pipe(concat(name + ".min.js"));
    if (addConfig) {
      ret = ret.pipe(
        inject.prepend(
          '"use strict";\nvar CONFIG = JSON.parse(\'' +
            JSON.stringify(getConfig()) +
            "');\n"
        )
      );
    }
    return (
      ret
        //.pipe(gulp.dest('dist/'));
        .pipe(minify())
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest("dist/"))
    );
  }
  return merge(
    bundle("admin-pushed", true),
    bundle("admin-worker"),
    bundle("admin-worker-deps"),
    bundle("admin")
  );
});

gulp.task("build:css", function () {
  function bundle(name, sources) {
    return (
      gulp
        .src(sources)
        .pipe(sourcemaps.init())
        .pipe(concat(name + ".min.css"))
        .pipe(
          postcss([
            postcssCustomProperties({
              importFrom: getConfig(),
              preserve: false,
            }),
            autoprefixer(),
          ])
        )
        //.pipe(gulp.dest('dist/'));
        .pipe(cleanCSS())
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest("dist/"))
    );
  }
  return merge(
    bundle("error", ["src/css/error.css"]),
    bundle("admin-pushed", [
      "src/css/button.css",
      "src/css/dialog.css",
      "src/css/fontello.css",
      "src/css/lesson.css",
      "src/css/main.css",
      "src/css/mainPage.css",
      "src/css/mainView.css",
      "src/css/sidePanel.css",
    ]),
    bundle("admin", [
      "src/css/competenceSubview.css",
      "src/css/editor.css",
      "src/css/fieldSubview.css",
      "src/css/form.css",
      "src/css/groupSubview.css",
      "src/css/imageSubview.css",
      "src/css/lessonSubview.css",
      "src/css/pagination.css",
      "src/css/userSubview.css",
    ])
  );
});

gulp.task("build:php", function () {
  return gulp.src(["src/php/lesson.php"]).pipe(gulp.dest("dist/"));
});

gulp.task("build:txt", function () {
  return gulp.src(["src/txt/htaccess.txt"]).pipe(gulp.dest("dist/"));
});

gulp.task("build:font", function () {
  return gulp
    .src([
      "src/font/fontello.eot",
      "src/font/fontello.svg",
      "src/font/fontello.ttf",
      "src/font/fontello.woff",
      "src/font/fontello.woff2",
    ])
    .pipe(gulp.dest("dist/font/"));
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
  return merge(
    gulp.src([
      "src/icon/apple-touch-icon.png",
      "src/icon/favicon-16x16.png",
      "src/icon/favicon-32x32.png",
      "src/icon/favicon.ico",
      "src/icon/mstile-150x150.png",
      "src/icon/safari-pinned-tab.svg",
    ]),
    gulp
      .src(["src/icon/browserconfig.xml"])
      .pipe(
        inject.replace(
          "<!--ACCENT-COLOR-->",
          getConfig()["custom-properties"]["--accent-color"]
        )
      )
  ).pipe(gulp.dest("dist/"));
});

gulp.task(
  "build",
  gulp.parallel(
    "build:html",
    "build:css",
    "build:js",
    "build:php",
    "build:txt",
    "build:font",
    "build:png",
    "build:deps",
    "build:icon"
  )
);
