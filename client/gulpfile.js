'use strict';

var gulp       = require('gulp');
var less       = require('gulp-less');
var minifycss  = require('gulp-minify-css');
var size       = require('gulp-size');
var del        = require('del');
var path       = require('path');
var browserify = require('browserify');
var reactify   = require('reactify');
var watchify   = require('watchify');
var source     = require('vinyl-source-stream');
var $          = require('gulp-load-plugins')();

var is_prod = $.util.env.type === 'production';

// gulp-plumber for error handling
function onError() {
  /* jshint ignore:start */
  var args = Array.prototype.slice.call(arguments);
  $.util.beep();
  $.notify.onError({
    title: "Compile Error",
    message: "<%= error.message %>"
  }).apply(this, args);
  this.emit('end'); // Keep gulp from hanging on this task
  /* jshint ignore:end */
}


// Styles LESS > CSS
gulp.task('styles', function(){
  return gulp.src('src/styles/styles.less')
    .pipe(less())
    .pipe(minifycss())
    .pipe(gulp.dest('dist/styles'));
});
gulp.task('optimize:styles', function() {
  return gulp.src('src/styles/styles.less')
    .pipe(less())
    .pipe(minifycss())
    .pipe(gulp.dest('dist/styles'))
    .pipe(size());
});
// Fonts
gulp.task('copy:fonts', function() {
    return gulp.src([
            'src/styles/lib/bootstrap/fonts/glyphicons-halflings-regular.*'])
            .pipe(gulp.dest('dist/fonts/'));
});

// Scripts
gulp.task('scripts', function() {
  var bundler;
  bundler = browserify({
    basedir: __dirname,
    noparse: ['react/addons', 'reflux'],
    entries: ['./src/scripts/app.js'],
    transform: [reactify],
    extensions: ['.js'],
    debug: true,
    cache: {},
    packageCache: {},
    fullPaths: true
  });

  bundler = watchify(bundler);

  function rebundle() {
    console.log('Bundling Scripts...');
    var start = Date.now();
    return bundler.bundle()
      .on('error', onError)
      .pipe(source('app.js'))
      .pipe(is_prod ? $.streamify($.uglify()) : $.util.noop())
      .pipe(gulp.dest('dist/scripts'))
      .pipe($.notify(function() {
        console.log('Bundling Complete - ' + (Date.now() - start) + 'ms');
      }));
  }

  bundler.on('update', rebundle);

  return rebundle();
});


// HTML
gulp.task('html', function() {
  return gulp.src('src/*.html')
    .pipe($.useref())
    .pipe(gulp.dest('dist'))
    .pipe($.size());
});


// Images
gulp.task('images', function() {
  return gulp.src('src/images/**/*')
    .pipe($.cache($.imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('dist/images'))
    .pipe($.size());
});

// Webserver
gulp.task('serve', function() {
  gulp.src('dist')
    .pipe($.webserver({
      livereload: true,
      port: 9000,
      fallback: 'index.html'
    }));
});


// Clean
gulp.task('clean', function(cb) {
  del(['dist/styles', 'dist/scripts', 'dist/images'], cb);
});


// Default task
gulp.task('default', ['clean', 'html', 'optimize:styles', 'images', 'scripts', 'copy:fonts']);

// Watch
gulp.task('watch', ['html', 'styles', 'images', 'scripts', 'copy:fonts'], function() {
  gulp.watch('src/*.html', ['html']);
  gulp.watch('src/styles/**/*.less', ['styles']);
  gulp.watch('src/images/**/*', ['images']);
});
