var gulp = require("gulp");
var sass = require("gulp-sass");
var concat = require("gulp-concat");
var rename = require("gulp-rename");

gulp.task("concatJs", function(){
    gulp.src(["dev/js/**/*.js"])
        .pipe(concat("script.js"))
        .pipe(gulp.dest("public/js"));
});

gulp.task('concatApp', function(){
    gulp.src(['server/_server.js',
              'server/_routes.js',
              'server/_sockets.js'])
        .pipe(concat('app.js'))
        .pipe(gulp.dest('./'))
})

gulp.task("compileSass", function(){
    gulp.src(["dev/sass/index.scss"])
        .pipe(sass())
        .pipe(gulp.dest("public/css"));
});

gulp.task("default", function(){
    gulp.watch(["dev/js/**/*.js"], ["concatJs"]);
    gulp.watch(["dev/sass/**/*.scss"], ["compileSass"]);
    gulp.watch(["server/**/*.js"], ["concatApp"]);
});
