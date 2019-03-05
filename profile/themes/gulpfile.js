(function () {
  'use strict';

var gulp = require('gulp'),
	eslint = require('gulp-eslint'),
  sass = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  rename = require('gulp-rename'),
  path = require('path');
	//autoprefixer = require('gulp-autoprefixer'),
	//imagemin = require('gulp-imagemin');

  gulp.task('sass', function () {
    return gulp
      .src('./**/scss/**/*.scss')
      .pipe(sourcemaps.init())
      .pipe(sass({
        outputStyle: 'uncompressed'
      }).on('error', sass.logError))
      .pipe(sourcemaps.write('./'))
      .pipe(rename(function (file) {
        // file.dirname = current folder, your "scss"
        // then get the parent of the current folder, e.g., "themename1", "themename2", etc.
        let parentFolder = path.dirname(file.dirname)
        // set each file's folder to "themename1/css", "themename2/css", etc.
        file.dirname = path.join(parentFolder, 'css');
      }))
      .pipe(gulp.dest('.'));
  });

})();