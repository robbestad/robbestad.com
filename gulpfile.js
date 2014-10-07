var gulp = require('gulp'),
    concat = require('gulp-concat'),
    scss = require('gulp-sass'),
    changed = require('gulp-changed'),
    csso = require('gulp-csso'),
//    less = require('gulp-less'),
    uglify = require('gulp-uglify'),
//    browserify = require('browserify'),
    autoprefixer = require('gulp-autoprefixer'),
    imagemin = require('gulp-imagemin'),
    del = require('del'),
    plumber = require('gulp-plumber'),
    notify = require("gulp-notify"),
//    sourcemaps = require("gulp-sourcemaps"),
//    pngcrush = require('imagemin-pngcrush'),
//    react = require('gulp-react'),
    browserSync = require('browser-sync'),
//    watchify = require('watchify'),
//    reactify = require('reactify'),
//    source = require('vinyl-source-stream'),
//    buffer = require('vinyl-buffer'),
    reload = browserSync.reload,
    shell = require('gulp-shell'),
    jshint      = require('gulp-jshint'),
    nodemon = require('gulp-nodemon');

// tasks
gulp.task('default', ['jsbundle','cssbundle', 'lint', 'watch'], function () {
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
        'js/bundle.js',
        'bower_components/rebound-js/rebound.js',
        'js/app-ready.js'],
    scss: ['./scss/main.scss'],
    css: ['node_modules/bootstrap/dist/css/bootstrap.css',
        'css/**/*',
        'common-assets/base.css'],
    fonts: ['']
};


// js tasks

gulp.task('jsbundle', function () {
    return gulp.src(['bower_components/rebound-js/rebound.js',
        'js/app-ready.js'])
        .pipe(concat('app.min.js'))
        .pipe(gulp.dest('assets'));
});

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

gulp.task('clean-css', function(cb){
    del(['css/app.css'], function (err) {
        console.log('css deleted');
    });
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
