var gulp = require('gulp');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync');


gulp.task('serve', function(done) {
  browserSync({
    open: true,
    port: 9000,
    minify: true,
    server: {
      baseDir: ['.'],
      middleware: function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');        
        next();
      }
    }
  }, done);
});

gulp.task('minify', function() {
  return gulp.src('js/*.js')
      .pipe(uglify())
      .pipe(gulp.dest('js/min'));
  console.log('GULP - minify js');
});