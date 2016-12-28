var gulp = require("gulp");
var sass = require("gulp-sass");
var concat = require("gulp-concat");
var rename = require("gulp-rename");

gulp.task("concatGameJs", function(){
    gulp.src(["dev/js/game/**/*.js"])
        .pipe(concat("game.js"))
        .pipe(gulp.dest("public/js"));
});

gulp.task("concatMigrations", function(){
    gulp.src(["migrations/db.js",
            "migrations/_create_quickplay_users_table.js",
            "migrations/close_db.js"])
        .pipe(concat("migrations.js"))
        .pipe(gulp.dest("migrations/"));
})

gulp.task("concatUiJs", function(){
    gulp.src(["dev/js/ui/**/*.js"])
        .pipe(concat("ui.js"))
        .pipe(gulp.dest("public/js"));
})

gulp.task('concatApp', function(){
    gulp.src(['server/_server.js',
              'server/_db.js',
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

gulp.task("default", ["concatMigrations", "concatGameJs", "concatUiJs", "compileSass", "concatApp"],  function(){
    gulp.watch(["migrations/**/*.js"], ["concatMigrations"]);
    gulp.watch(["dev/js/game/**/*.js"], ["concatGameJs"]);
    gulp.watch(["dev/js/ui/**/*.js"], ["concatUiJs"]);
    gulp.watch(["dev/sass/**/*.scss"], ["compileSass"]);
    gulp.watch(["server/**/*.js"], ["concatApp"]);
});
