const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const uglify = require("gulp-uglify");
const concat = require("gulp-concat");
const cleanCSS = require("gulp-clean-css");
const rename = require("gulp-rename");
const sourcemaps = require("gulp-sourcemaps");
const pug = require("gulp-pug");
const browserSync = require("browser-sync").create();
var imagemin = require("gulp-imagemin");

// Пути к файлам
const paths = {
  styles: {
    src: "src/sass/**/*.scss",
    dest: "dist/css",
  },
  images: {
    src: "src/images/**/*.+(png|jpg|jpeg|gif|svg)",
    dest: "dist/images",
  },
  scripts: {
    src: "src/js/**/*.js",
    dest: "dist/js",
  },
  fonts: {
    src: "fonts/fonts/**/*",
    dest: "dist/fonts",
  },
  pug: {
    src: "src/pug/**/*.pug",
    dest: "dist",
  },
};

// Задача для обработки стилей
gulp.task("styles", function () {
  return gulp
    .src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(cleanCSS())
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(paths.styles.dest));
});

// Задача для обработки изображений
gulp.task("images", function () {
  return gulp
    .src(paths.images.src, { encoding: false })
    .pipe(gulp.dest(paths.images.dest));
});

// Задача для обработки скриптов
gulp.task("scripts", function () {
  return gulp
    .src(paths.scripts.src)
    .pipe(concat("main.js"))
    .pipe(uglify())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest(paths.scripts.dest));
});

// Задача для копирования шрифтов
gulp.task("fonts", function () {
  return gulp.src(paths.fonts.src).pipe(gulp.dest(paths.fonts.dest));
});

gulp.task("pug", function () {
  return gulp
    .src(paths.pug.src)
    .pipe(
      pug({
        pretty: true,
      })
    )
    .pipe(gulp.dest(paths.pug.dest));
});

// Задача для запуска Browsersync
gulp.task("browserSync", function () {
  browserSync.init({
    server: {
      baseDir: "./dist",
    },
    port: 3000,
  });
});

// Задача для наблюдения за изменениями
gulp.task("watch", function () {
  gulp.watch(paths.styles.src, gulp.series("styles", browserSync.reload));
  gulp.watch(paths.images.src, gulp.series("images", browserSync.reload));
  gulp.watch(paths.scripts.src, gulp.series("scripts", browserSync.reload));
  gulp.watch(paths.fonts.src, gulp.series("fonts", browserSync.reload));
  gulp.watch(paths.pug.src, gulp.series("pug", browserSync.reload));
});

// Задача по умолчанию
gulp.task(
  "default",
  gulp.series(
    "styles",
    "images",
    "scripts",
    "fonts",
    "pug",
    "browserSync",
    "watch"
  )
);
