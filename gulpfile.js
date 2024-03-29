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

gulp.task("build:error:html", () =>
  gulp
    .src(["src/html/403.html", "src/html/404.html", "src/html/500.html"])
    .pipe(gulp.dest("dist/")),
);

gulp.task("build:error", gulp.parallel("build:error:css", "build:error:html"));

gulp.task("build:php", () =>
  gulp.src(["src/php/lesson.php"]).pipe(gulp.dest("dist/")),
);

gulp.task("build:txt", () =>
  gulp.src(["src/txt/htaccess.txt"]).pipe(gulp.dest("dist/")),
);

gulp.task("build:png", () =>
  gulp.src(["src/png/avatar.png"]).pipe(gulp.dest("dist/")),
);

gulp.task("build:icon", () =>
  gulp
    .src([
      "src/icon/apple-touch-icon.png",
      "src/icon/browserconfig.xml",
      "src/icon/favicon-16x16.png",
      "src/icon/favicon-32x32.png",
      "src/icon/favicon.ico",
      "src/icon/mstile-150x150.png",
      "src/icon/safari-pinned-tab.svg",
    ])
    .pipe(gulp.dest("dist/")),
);

gulp.task(
  "build",
  gulp.parallel(
    "build:main",
    "build:error",
    "build:php",
    "build:txt",
    "build:png",
    "build:icon",
  ),
);
