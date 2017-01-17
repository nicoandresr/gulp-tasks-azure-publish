var gulp = require('gulp');
var del = require('del');
var zip = require('gulp-zip');
var minimist = require('minimist');
var path = require('path');

var knownOptions = {
      string: 'packageName',
      string: 'packagePath',
      default: {packageName: "Package.zip", packagePath: path.join(__dirname, '_package')}
}

var options = minimist(process.argv.slice(3), knownOptions);

gulp.task('clean', function(cb) {
    return del(['build'], cb);
});

gulp.task('resources', function() {
    return gulp.src(['public/dist/**/*']).pipe(gulp.dest('build/dist'));
});

gulp.task('server', ['resources'], function() {
    return gulp.src(['server.js', 'package.json','Web.config']).pipe(gulp.dest('build'));
});

gulp.task('zip', ['server'], function() {
    return gulp.src(['build/**/*']).pipe(zip(options.packageName)).pipe(gulp.dest(options.packagePath));
});
