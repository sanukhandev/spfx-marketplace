'use strict';

const build = require('@microsoft/sp-build-web');
const gulp = require('gulp');
const postcss = require('gulp-postcss');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');

build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);
gulp.task('tailwindcss', function () {
  return gulp
    .src('src/styles/tailwind.css')
    .pipe(postcss([tailwindcss(), autoprefixer()]))
    .pipe(gulp.dest('src/styles/dist'));
});
var getTasks = build.rig.getTasks;
build.rig.getTasks = function () {
  var result = getTasks.call(build.rig);

  result.set('serve', result.get('serve-deprecated'));

  return result;
};
build.initialize(gulp);

