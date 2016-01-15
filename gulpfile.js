var gulp = require('gulp'),
    ts = require('gulp-typescript'),
    uglify = require('gulp-uglify'),
    rename = require("gulp-rename"),
    tsProject = ts.createProject('tsconfig.json');


gulp.task('ts', function () {
    var tsResult = tsProject.src()
        .pipe(ts(tsProject));

    return tsResult.js.pipe(gulp.dest('dist'));
});

 
gulp.task('compress', ['ts'], function() {
  return gulp.src('dist/clerk.js')
    .pipe(uglify({
        output:""
    }))
    .pipe(rename("clerk.min.js"))
    .pipe(gulp.dest('dist'));
});

gulp.task('build', ['ts', 'compress'])