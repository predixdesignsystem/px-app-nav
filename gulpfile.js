'use strict';
const path = require('path');
const gulp = require('gulp');
const pkg = require('./package.json');
const $ = require('gulp-load-plugins')();
const gulpSequence = require('gulp-sequence');
const importOnce = require('node-sass-import-once');
const stylemod = require('gulp-style-modules');
const browserSync = require('browser-sync').create();
const gulpif = require('gulp-if');
const bump = require('gulp-bump');
const argv = require('yargs').argv;

const sassOptions = {
  importer: importOnce,
  importOnce: {
    index: true,
    bower: true
  }
};

gulp.task('sass', function() {
  return gulp.src(['./sass/*.scss', '!./sass/*sketch.scss'])
    .pipe($.sass(sassOptions).on('error', $.sass.logError))
    .pipe($.autoprefixer({
      browsers: ['last 2 versions', 'Safari 8.0'],
      cascade: false
    }))
    .pipe(gulpif(/.*predix/,
      $.rename(function(path){
        console.log(new RegExp('.+?(?=\-predix)').exec(path.basename)[0]);
        path.basename = new RegExp('.+?(?=\-predix)').exec(path.basename)[0];
      })
    ))
    .pipe(gulpif(!argv.debug, $.cssmin()))
    .pipe(stylemod({
      moduleId: function(file) {
        return path.basename(file.path, path.extname(file.path)) + '-styles';
      }
    }))
    .pipe(gulp.dest('./'))
    .pipe(browserSync.stream({match: '**/*.css'}));
});

gulp.task('watch', function() {
  gulp.watch('./sass/**/*.scss', ['default']);
});

gulp.task('serve', ['default'], function() {
  browserSync.init({
    port: 8080,
    notify: false,
    reloadOnRestart: true,
    logPrefix: `${pkg.name}`,
    https: false,
    files: ['*.*'],
    server: ['./', 'bower_components'],
  });

  gulp.watch(['!${pkg.name}-styles.html', '*.html', 'bower_components/**/*.html']).on('change', browserSync.reload);
  gulp.watch('sass/*.scss', ['default']);

});

gulp.task('bump:patch', function(){
  gulp.src(['./bower.json', './package.json'])
  .pipe(bump({type:'patch'}))
  .pipe(gulp.dest('./'));
});

gulp.task('bump:minor', function(){
  gulp.src(['./bower.json', './package.json'])
  .pipe(bump({type:'minor'}))
  .pipe(gulp.dest('./'));
});

gulp.task('bump:major', function(){
  gulp.src(['./bower.json', './package.json'])
  .pipe(bump({type:'major'}))
  .pipe(gulp.dest('./'));
});

gulp.task('default', gulpSequence('sass'));
