var gulp = require('gulp'),
    concat = require('gulp-concat'),
    scss = require('gulp-sass'),
    changed = require('gulp-changed'),
    csso = require('gulp-csso'),
    uglify = require('gulp-uglify'),
    autoprefixer = require('gulp-autoprefixer'),
    plumber = require('gulp-plumber'),
    notify = require("gulp-notify"),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    jshint      = require('gulp-jshint'),
    nodemon = require('gulp-nodemon');

// tasks
gulp.task('default', ['cssbundle', 'lint', 'watch'], function () {
    gulp.watch('js/**/*', ['lint', reload]);
});
gulp.task('serve', ['default', 'browser-sync'], function () {
    gulp.watch('js/**/*', ['lint', reload]);
});
gulp.task('watch', function () {
    gulp.watch('scss/**/*', ['cssbundle']);
});

// paths
var paths = {
    scripts: [
        'node_modules/jquery/dist/jquery.js',
        'js/bundle.js'],
    scss: ['./scss/main.scss'],
    css: ['node_modules/bootstrap/dist/css/bootstrap.css',
        'css/**/*'],
    fonts: ['']
};
// css tasks
gulp.task('scss', function () {
    return gulp.src(paths.scss)
        .pipe(scss())
        .pipe(plumber())
        .pipe(autoprefixer("last 2 versions", "> 1%", "ie 8", "Android 2", "Firefox ESR"))
        .pipe(csso())
        .pipe(gulp.dest('css'))
        .pipe(reload({stream: true}));
});
gulp.task('cssbundle', ['scss'], function () {
    return gulp.src(paths.css)
        .pipe(concat('bundle.min.css'))
        .pipe(gulp.dest('assets'));
});
// Server tasks
gulp.task('browser-sync', ['nodemon'], function() {
    browserSync({
        server: {
            baseDir: './'
        },
        proxy: "http://localhost:3000",
        files: ["**/*.js"],
        port: 3000
    });

});
gulp.task('nodemon', function (cb) {
    return nodemon({
        script: 'index.js',
        ext: 'html js',
        watch: [
            'index.js'
        ]
    })
});
// Lint task.
gulp.task('lint', function () {
    gulp.src('js/**/*')
        .pipe(jshint());
});