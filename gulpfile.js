"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var rename = require("gulp-rename");
var del = require("del");
var server = require("browser-sync").create();

var sass = require("gulp-sass");
var posthtml = require("gulp-posthtml");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var csso = require("gulp-csso");
var htmlmin = require("gulp-htmlmin");
var uglify = require("gulp-uglify");

var imagemin = require("gulp-imagemin");
var webp = require("gulp-webp");
var svgstore = require("gulp-svgstore");
var cheerio = require("gulp-cheerio");
var cclean   = require('gulp-cheerio-clean-svg');

var buildFolder = "build";

gulp.task("css", function () {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest(buildFolder + "/css"))
    .pipe(server.stream());
});

gulp.task("html", function() {
  return gulp.src("source/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(buildFolder));
})

gulp.task("js", function() {
  return gulp.src(['source/js/*.js', '!source/js/*.min.js'])
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(buildFolder + "/js"));
  })

gulp.task("sprite", function () {
  return gulp.src("source/img/{icon,logo}-*.svg")
    .pipe(cheerio(cclean()))
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest(buildFolder + "/img"));
});

gulp.task("images", function () {
  return gulp.src("source/img/**/*.{png,jpg,svg}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true}),
      imagemin.svgo()
    ]))

    .pipe(gulp.dest(buildFolder + "/img"));
});

gulp.task("webp", function () {
  return gulp.src("source/img/**/*.{png,jpg}")
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest(buildFolder + "/img"));
});

gulp.task("copy", function () {
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}",
    "source/img/**",
    "source/js/**",
    "source/*.html",
    "source/*.ico"
    ], {
      base: "source"
    })
    .pipe(gulp.dest(buildFolder));
});

gulp.task("clean", function () {
  return del(buildFolder);
});

gulp.task("refresh", function (done) {
  server.reload();
  done();
});

gulp.task("server", function () {
  server.init({
    server: buildFolder + "/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.{scss,sass}", gulp.series("css"));
  gulp.watch("source/js/*.js", gulp.series("js"));
  gulp.watch("source/img/{icon,logo}-*.svg", gulp.series("sprite", "html", "refresh"));
  gulp.watch("source/*.html", gulp.series("html", "refresh"));
});

gulp.task("start", gulp.series("css", "server"));

gulp.task("build", gulp.series(
  "clean",
  "copy",
  "css",
  "js",
  "sprite",
  "html",
  "refresh"
));
