var gulp = require('gulp');
var browserSync = require('browser-sync');


gulp.task('serve', function(done) {
  browserSync({
    open: true,
    port: 9000,
    server: {
      baseDir: ['.'],
      middleware: function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        next();
      }
    }
  }, done);
});