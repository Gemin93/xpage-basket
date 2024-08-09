const gulp = require("gulp");
const pug = require("gulp-pug");
const sass = require("gulp-sass")(require("sass"));
const sourcemaps = require("gulp-sourcemaps");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cleanCss = require("gulp-clean-css");
const rename = require("gulp-rename");
const concat = require("gulp-concat");
const browserSync = require("browser-sync").create();

// Пути к файлам
const paths = {
  pug: {
    src: "src/pug/**/*.pug",
    dest: "dist",
  },
  sass: {
    src: "src/sass/**/*.scss",
    dest: "dist/css",
  },
  js: {
    src: "src/js/**/*.js",
    dest: "dist/js",
  },
};

// Задача для компиляции Pug
function compilePug() {
  return gulp
    .src(paths.pug.src)
    .pipe(pug({ pretty: true }))
    .pipe(gulp.dest(paths.pug.dest))
    .pipe(browserSync.stream());
}

// Задача для компиляции SASS
function compileSass() {
  return gulp
    .src(paths.sass.src)
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(cleanCss())
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(paths.sass.dest))
    .pipe(browserSync.stream());
}

// Задача для копирования JS файлов
function copyJs() {
  return gulp
    .src(paths.js.src)
    .pipe(concat("main.js"))
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest(paths.js.dest))
    .pipe(browserSync.stream());
}

// Задача для BrowserSync
function serve() {
  browserSync.init({
    server: {
      baseDir: "./dist",
    },
  });

  gulp.watch(paths.pug.src, compilePug);
  gulp.watch(paths.sass.src, compileSass);
  gulp.watch(paths.js.src, copyJs);
  gulp.watch("dist/*.html").on("change", browserSync.reload);
}

// Последовательность задач
const build = gulp.series(compilePug, compileSass, copyJs, serve);

// Экспорт задач
exports.compilePug = compilePug;
exports.compileSass = compileSass;
exports.copyJs = copyJs;
exports.serve = serve;
exports.default = build;
