var gulp = require("gulp");
var sass = require("gulp-sass");
var concat = require("gulp-concat");
var rename = require("gulp-rename");

gulp.task("concatJs", function(){
    gulp.src(["dev/js/**/*.js"])
        .pipe(concat("script.js"))
        .pipe(gulp.dest("public/js"));
});

gulp.task("compileSass", function(){
    gulp.src(["dev/sass/index.scss"])
        .pipe(sass())
        .pipe(gulp.dest("public/css"));
});

gulp.task("default", function(){
    gulp.watch(["dev/js/**/*.js"], ["concatJs"]);
    gulp.watch(["dev/sass/**/*.scss"], ["compileSass"]);
});
