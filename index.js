var gulp = require('gulp')
  , del = require('del')
  , zip = require('gulp-zip')
  , minimist = require('minimist')
  , path = require('path')
  , jeditor = require("gulp-json-editor")
  , concat = require('gulp-concat');

var knownOptions = {
      string: 'packageName',
      string: 'packagePath',
      default: {packageName: "Package.zip", packagePath: path.join(__dirname, '_package')}
}

var options = minimist(process.argv.slice(3), knownOptions);

var configAmbient = function(json) {
    if (!!options.stg) { return json.stg; }
    if (!!options.prod) { return json.prod; }
    return json.dev;
}

gulp.task('ambient', function() {
    return gulp.src('app.ambients.json')
      .pipe(jeditor(configAmbient))
      .pipe(concat('app.config.json'))
      .pipe(gulp.dest('./'));
});

gulp.task('clean', function(cb) {
    return del(['build'], cb);
});

gulp.task('resources', function() {
    return gulp.src(['public/dist/**/*']).pipe(gulp.dest('build/dist'));
});

gulp.task('services', function() {
    return gulp.src(['services/**/*','!**/*.ts', '!**/*.ts~']).pipe(gulp.dest('build/services'));
});

gulp.task('server', ['services','resources'], function() {
    return gulp.src(['server.js','package.json','Web.config','app.config.json']).pipe(gulp.dest('build'));
});

gulp.task('zip', ['server'], function() {
    return gulp.src(['build/**/*','!build/**/*.map']).pipe(zip(options.packageName)).pipe(gulp.dest(options.packagePath));
});

gulp.task('zip:dev', ['server'], function() {
    return gulp.src(['build/**/*']).pipe(zip(options.packageName)).pipe(gulp.dest(options.packagePath));
});

module.exports = gulp;
