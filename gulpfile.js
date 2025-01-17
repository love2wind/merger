const gulp = require('gulp');
const terser = require('gulp-terser');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const htmlmin = require('gulp-html-minifier-terser');
const rename = require('gulp-rename');
const htmlreplace = require('gulp-html-replace');



gulp.task('pack-css', async function () {
  const compressedCSS = gulp.src(['./assets/styles/spectre.css/spectre-modified.css', './assets/styles/style.css'])
    .pipe(concat('style.main.css'))
    .pipe(cleanCSS({
      level: 2
    }))
  compressedCSS.pipe(gulp.dest('./assets/bundles/'))
  if (process.env.NODE_ENV == 'production') {
    compressedCSS.pipe(gulp.dest('./build/assets/'))
  }
});

gulp.task('pack-js', async function () {
  const compressedJS = gulp.src(['./assets/js/function.js', './assets/js/iconfont.js'])
    .pipe(concat('function.main.js'))
    .pipe(terser())
  compressedJS.pipe(gulp.dest('./assets/bundles/'))
  if (process.env.NODE_ENV == 'production') {
    compressedJS.pipe(gulp.dest('./build/assets/'))
  }
});

gulp.task('minify-html', async function () {
  return gulp.src(['./build/index.html'], { base: "./" })
    .pipe(htmlmin({
      collapseWhitespace: true,
      conservativeCollapse: true,
      collapseInlineTagWhitespace: true,
      collapseBooleanAttributes: true,
      removeComments: true,
      minifyCSS: true,
      minifyJS: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      useShortDoctype: true,
      sortAttributes: true,
      sortClassName: true,
      includeAutoGeneratedTags: false,
    }))
    .pipe(gulp.dest('./'));
});

gulp.task('replace-js-css', function (done) {
  return gulp.src('./merger.html')
    .pipe(htmlreplace({
      'css': '/assets/style.main.css',
      'js': '/assets/function.main.js'
    }))
    .pipe(rename('index.html'))
    .pipe(gulp.dest('build/'))
    .on('end', done);
  });

gulp.task('build-html', async function () {
  gulp.start('replace-js-css');
  gulp.start('minify-html');
})

gulp.task('compile', gulp.parallel('pack-css', 'pack-js'));
gulp.task('default', gulp.series('replace-js-css', gulp.parallel('minify-html', 'pack-js', 'pack-css' )));