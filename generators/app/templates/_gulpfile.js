var gulp = require('gulp'),
  webserver = require('gulp-webserver'),
  connect = require('gulp-connect'),
  watch = require('gulp-watch'),
  less = require('gulp-less'),
  coffee = require('gulp-coffee');
  sass = require('gulp-sass');

gulp.task('webserver', function() {
   gulp.src('app')
      .pipe(webserver({
        livereload: true,
        directoryListing: false,
        open: true
    }));
});

gulp.task('livereload', function() {
  gulp.src(['.tmp/styles/*.css', '.tmp/scripts/*.js'])
    .pipe(watch(['.tmp/styles/*.css', '.tmp/scripts/*.js']))
    .pipe(connect.reload());
});


gulp.task('sass', function () {
  gulp.src('./app/assets/**/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('css'));
});

gulp.task('less', function() {
  gulp.src('styles/main.less')
    .pipe(less())
    .pipe(gulp.dest('.tmp/styles'));
});

gulp.task('coffee', function() {
  gulp.src('scripts/*.coffee')
    .pipe(coffee())
    .pipe(gulp.dest('.tmp/scripts'));
});

gulp.task('watch', function() {
  gulp.watch('styles/*.less', ['less']);
  gulp.watch('scripts/*.coffee', ['coffee']);
})

gulp.task('default', ['less','sass', 'coffee', 'webserver', 'livereload', 'watch']);
