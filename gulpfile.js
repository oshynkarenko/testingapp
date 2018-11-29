const gulp = require('gulp');
const browserSync = require('browser-sync');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const mmq = require('gulp-merge-media-queries');
const del = require('del');
const htmlmin = require('gulp-htmlmin');
const imagemin = require('gulp-imagemin');
const jsonmin = require('gulp-jsonminify');
const rigger = require('gulp-rigger');
const babel = require("gulp-babel");
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const order = require("gulp-order");
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');

const path = {
  src: {
    html: "src/html/*.html",
    scss: "src/scss/*.scss",
    js: "src/js/*.js",
    data:"src/data/*/*.json",
    img: "src/img/**/*.+(png|jpg|gif|svg)",
    fonts: "src/fonts/**/*.*"
  },
  dist: {
    html: "dist/html",
    css: "dist/css/",
    js: "dist/js/",
    data:"dist/data/",
    img: "dist/img/",
    fonts: "dist/fonts/"
  }
};

gulp.task('html', () => {
  return gulp.src(path.src.html)
    .pipe(rigger())
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest(path.dist.html))
    .pipe(browserSync.reload({ stream: true }))
});

gulp.task('css', () => {
  return gulp.src(path.src.scss)
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('main.css'))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(mmq({
      log: false
    }))
    .pipe(cssnano())
    .pipe(gulp.dest(path.dist.css))
    .pipe(browserSync.reload({
      stream: true
    }));
});


gulp.task('data', () => {
    return gulp.src(path.src.data)
        .pipe(jsonmin())
        .pipe(gulp.dest(path.dist.data))
        .pipe(browserSync.reload({ stream: true }))
});

gulp.task('img', () => {
  return gulp.src(path.src.img)
    /*.pipe(imagemin(
      imagemin.svgo({
        plugins: [
          { removeViewBox: true },
          { cleanupIDs: false }
        ]
      })))*/
    .pipe(gulp.dest(path.dist.img))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('fonts', () => {
  return gulp.src(path.src.fonts)
    .pipe(gulp.dest(path.dist.fonts))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('js', () => {
  return gulp.src(path.src.js)
  .pipe(webpackStream(webpackConfig), webpack)
    .pipe(gulp.dest(path.dist.js));
    /*.pipe(babel({
      presets: ['env']
    }))
    .pipe(order([
      'data.js',
      'tabs.js',
      'table-control-block.js',
      
      'edit-actions.js',
      'table.js',
      'field-settings.js',
      '*.js'
    ]))
    .pipe(concat('index.js'))
    // .pipe(uglify())
    .pipe(gulp.dest(path.dist.js))
    .pipe(browserSync.reload({
      stream: true
    }));*/
});

gulp.task('watch', () => {
  gulp.watch(path.src.html)
    .on('change', gulp.parallel('html'));
    gulp.watch(path.src.scss)
    .on('change', gulp.parallel('css'));
    gulp.watch(path.src.img)
    .on('change', gulp.parallel('img'));
    gulp.watch(path.src.fonts)
    .on('change', gulp.parallel('fonts'));
    gulp.watch(path.src.js)
    .on('change', gulp.parallel('js'));
});

gulp.task('server', () => {
  browserSync({
    server: {
      baseDir: "./dist",
      index: '/html/index.html'
    },
    notify: false
  });
});

gulp.task('del:dist', () => {
  return del.sync('./dist');
});

gulp.task('build', gulp.parallel(['html', 'css', 'img', 'fonts', 'js', 'data']));
gulp.task('start', gulp.parallel(['del:dist', 'build', 'server', 'watch']));