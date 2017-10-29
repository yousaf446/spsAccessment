var gulp = require('gulp'),
    webserver = require('gulp-webserver');

gulp.task('webserver', function() {
    gulp.src('.')
        .pipe(webserver({
            livereload: false,
            directoryListing: true,
            port: 9000,
            open: "http://localhost:9000/client/"
        }));
});

gulp.task('default', ['webserver']);