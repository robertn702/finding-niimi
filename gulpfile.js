'use strict'

const gulp = require('gulp');
const webpack = require('webpack-stream');
const postcssImport = require('postcss-import');
const pngquant = require('imagemin-pngquant');
const $ = require('gulp-load-plugins')();
const runSequence = require('run-sequence');

// DIRECTORY CONSTANTS
const DIST = './web/dist/';
const DIST_STATIC = DIST + 'static/';
const DIST_STATIC_IMAGES = DIST_STATIC + 'images/';

const APP = './web/app/';
const APP_IMAGES = APP + 'images/';
const APP_JS = APP + 'js/';
const APP_STYLE = APP + 'style/';

const LOGIN = './web/login/';
const LOGIN_JS = LOGIN + 'js/';
const LOGIN_STYLE = LOGIN + 'style/';
const LOGIN_IMAGES = LOGIN + 'images/'

const ALL = '**/*';
const ALL_HTML = '.html';
const ALL_CSS = ALL + '.css';
const ALL_JS = ALL + '.js';
const ALL_JSX = ALL + '.jsx';
const ALL_SCSS = ALL + '.scss';

function swallowErr(err) {
  console.log('[gulpfile] err: ', err);
  this.emit('end');
};

gulp.task('build', (cb) => {
  $.util.env.env = ($.util.env.env) ? $.util.env.env : 'development';
  runSequence(
    [
      'html',
      'images',
      'scripts',
      'styles',
    ],
    cb
  )
});

/* ========== Dev Tasks ========== */
gulp.task('dev', ['build'], () => {
  gulp.watch([
    APP_JS + ALL_JS,
    APP_JS + ALL_JSX,
  ], ['_webpack']);
  gulp.watch(APP_STYLE + ALL_CSS, ['styles']);
  gulp.watch(APP + '*.html', ['html']);
  gulp.watch([
    APP_IMAGES + '*.png',
    APP_IMAGES + '*.svg',
    APP_IMAGES + '.jpg',
  ], ['images']);
});

/* ========== JS Tasks ========== */
gulp.task('scripts', ['_webpack']);

gulp.task('_webpack', () => {
  const env = $.util.env.env || 'development';
  const webpackConfig = require(`./web/webpack.${(env) ? env + '.' : ''}config`);

  return gulp.src(APP_JS + ALL_JS)
    .pipe($.plumber({errorHandler: swallowErr}))
    .pipe(webpack(webpackConfig))
    .pipe($.plumber.stop())
    .pipe(gulp.dest(DIST_STATIC))
    ;
});

/* ========== Style Tasks ========== */
gulp.task('styles', ['_minify-css']);

gulp.task('_minify-css', () => {
  const env = $.util.env.env || 'development';
  return gulp.src(APP_STYLE + ALL_SCSS)
    .pipe($.plumber({errorHandler: swallowErr}))
    .pipe($.sass({
      includePaths: [
        './node_modules',
        './node_modules/support-for/sass',
      ],
      errLogToConsole: true,
    }))
    .pipe($.postcss([postcssImport]))
    .pipe(env === 'production'
      ? $.cssnano({discardComments: {removeAll: true,}})
      : $.util.noop())
    .pipe($.plumber.stop())
    .pipe(gulp.dest(DIST_STATIC))
    ;
});

/* ========== HTML Tasks ========== */
gulp.task('html', () => {
  const env = $.util.env.env || 'development';
  return gulp.src(APP + '*.html')
    .pipe($.plumber({errorHandler: swallowErr}))
    .pipe(env === 'production'
      ? $.htmlmin({collapseWhitespace: true, removeComments: true})
      : $.util.noop())
    .pipe($.plumber.stop())
    .pipe(gulp.dest(DIST))
    ;
});

/* ========== Image Tasks ========== */
gulp.task('images', () => {
  const env = $.util.env.env || 'development';
  return gulp.src(APP_IMAGES + '*')
    .pipe($.plumber({errorHandler: swallowErr}))
    .pipe(env === 'production'
      ? $.imagemin({progressive: true, use: [pngquant()]})
      : $.util.noop()
    )
    .pipe($.plumber.stop())
    .pipe(gulp.dest(DIST_STATIC_IMAGES));

})

/* ========== Server Tasks ========== */
gulp.task('serve', () => {
  const env = $.util.env.env || 'development';
  return $.nodemon({
    script: './server/server.js',
    ignore: ['./server/data/'],
    env: {
      NODE_ENV: env,
    },
  })
  ;
});
