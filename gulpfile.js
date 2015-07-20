var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var concat = require('gulp-concat');

// watch files for changes and reload
gulp.task('serve', function() {
  browserSync({
    server: {
      baseDir: 'app'
    }
  });

  gulp.watch(['*.html', 'style.css', 'js/**/*.js'], {cwd: 'app'}, reload);
});

gulp.task('scripts', function() {
  return gulp.src(['app/js/modernizr.js', 'app/js/weather.js'])
    .pipe(concat('global.js'))
    .pipe(gulp.dest('app/js'));
});

gulp.task('default', ['serve', 'scripts']);
