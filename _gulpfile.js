var gulp = require('gulp'),
    concat = require('gulp-concat'),
    scss = require('gulp-sass'),
    changed = require('gulp-changed'),
    csso = require('gulp-csso'),
    less = require('gulp-less'),
    uglify = require('gulp-uglify'),
    browserify = require('browserify'),
    autoprefixer = require('gulp-autoprefixer'),
    imagemin = require('gulp-imagemin'),
    del = require('del'),
    plumber = require('gulp-plumber'),
    notify = require("gulp-notify"),
    sourcemaps = require("gulp-sourcemaps"),
    pngcrush = require('imagemin-pngcrush'),
    react = require('gulp-react'),
    browserSync = require('browser-sync'),
    watchify = require('watchify'),
    reactify = require('reactify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    reload = browserSync.reload,
    shell = require('gulp-shell');


var paths = {
    scripts: ['./.build/js/libs.js', './.build/js/app.js'],
    scss: ['./scss/**/*'],
    fonts: ['']
};

gulp.task('scss', function () {
    return gulp.src(paths.scss)
        .pipe(scss())
        .pipe(plumber())
        .pipe(autoprefixer())
        .pipe(csso())
        .pipe(gulp.dest('src/css'));
});


//var gulp = require('gulp'),
//    concat = require('gulp-concat'),
//    php2html = require("gulp-php2html"),
//    scss = require('gulp-sass'),
//    changed = require('gulp-changed'),
//    csso = require('gulp-csso'),
//    less = require('gulp-less'),
//    uglify = require('gulp-uglify'),
//    prettify = require('gulp-prettify'),
//    cssmin = require('gulp-cssmin'),
//    browserify = require('browserify'),
//    autoprefixer = require('gulp-autoprefixer'),
//    imagemin = require('gulp-imagemin'),
//    del = require('del'),
//    plumber = require('gulp-plumber'),
//    notify = require("gulp-notify"),
//    sourcemaps = require("gulp-sourcemaps"),
//    pngcrush = require('imagemin-pngcrush'),
//    react = require('gulp-react'),
//    browserSync = require('browser-sync'),
//    watchify = require('watchify'),
//    reactify = require('reactify'),
//    source = require('vinyl-source-stream'),
//    buffer = require('vinyl-buffer'),
//    reload = browserSync.reload,
//    shell = require('gulp-shell');
//
//var paths = {
//    scripts: ['./.build/js/libs.js', './.build/js/app.js'],
//    jslibs: [
//        'bower_components/jquery/dist/jquery.js',
//        'bower_components/bootstrap/dist/js/bootstrap.js',
//        'bower_components/iscroll/build/iscroll.js',
//        'node_modules/fastclick/lib/fastclick.js'
//    ],
//    images: 'src/img/**/*.jpg',
//    png: 'src/img/**/*.png',
//    jsx: './src/jsx/app.jsx',
//    distJs: './dist/js',
//    distCss: './dist/css',
//    html: 'src/**/*.html',
//    bundle: 'app.js',
//    buildJs: './.build/js',
//    php: 'src/**/*.php',
//    less: 'src/bootstrap/less/bootstrap.less',
//    fonts: [
//        'src/fonts/**/*',
//        'bower_components/font-awesome/fonts/**/*',
//        'bower_components/bootstrap/fonts/**/*'
//    ],
//    scss: ['bower_components/font-awesome/scss/font-awesome.scss',
//        'src/scss/main.scss'
//    ]
//};
//
//
//gulp.task('jsx', function () {
//    return browserify({
//               //do your config here
//                entries: paths.jsx
//            })
//            .bundle()
//            .pipe(plumber())
//            .pipe(source('app.js'))
//             //do all processing here.
//             //like uglification and so on.
//            .pipe(uglify())
//            .pipe(gulp.dest('src/js'));
//});
//
//gulp.task('php', function () {
//    return gulp.src(paths.php)
//        .pipe(gulp.dest('dist'))
//        .pipe(gulp.dest('build'));
//});
//
//gulp.task('php2html', function () {
//    return gulp.src('src/*.php')
//        .pipe(php2html())
//        .pipe(prettify())
//        .pipe(gulp.dest('dist'));
//});
//
//gulp.task('fonts', function () {
//    return gulp.src(paths.fonts)
//        .pipe(gulp.dest('dist/fonts'))
//        .pipe(gulp.dest('build/fonts'));
//});
//
//gulp.task('sass', function () {
//    return gulp.src(paths.scss)
//        .pipe(scss())
//        .pipe(plumber())
//        .pipe(autoprefixer())
//        //.pipe(cssmin())
//        .pipe(csso())
//        .pipe(gulp.dest('src/css'));
//});
//
//gulp.task('less', function () {
//    return gulp.src(paths.less)
//        .pipe(less())
//        .pipe(autoprefixer())
//        .pipe(cssmin())
//        .pipe(gulp.dest('src/css'));
//});
//
//gulp.task('css', ['less', 'sass'], function () {
//    return gulp.src([
//          'bower_components/normalize-css/normalize.css',
//          'src/css/bootstrap.css',
//          'src/css/font-awesome.css',
//          'src/css/main.css'
//    ])
//        .pipe(concat('style.min.css'))
//        .pipe(gulp.dest('dist/css'))
//        .pipe(gulp.dest('build/css'));
//});
//
//
//// Render all the JavaScript files
//gulp.task('regularjs', function () {
//   return gulp.src('src/js/blogdata.js')
//       .pipe(plumber())
//       .pipe(uglify({'mangle': false}))
//       .pipe(concat('blogdata.min.js'))
//       .pipe(gulp.dest('dist/js'));
//});
//
//gulp.task('minifyapp', ['jscripts','unminified'], function () {
//    return gulp.src(['dist/js/app.js'])
//        .pipe(uglify())
//        .pipe(concat('app.min.js'))
//        .pipe(gulp.dest('dist/js'));
//});
//
//gulp.task('unminified', ['jscripts'], function () {
//    return gulp.src(['src/js/rainbow.js','src/js/language/**/*',
//        'bower_components/rebound-js/rebound.js',
//        'dist/js/app.js','src/js/ready.js'])
//        .pipe(concat('app.js'))
//        .pipe(gulp.dest('dist/js'));
//});
//
//gulp.task('jscripts', ['regularjs'], function () {
//    return browserify(paths.jsx)
//        .transform(reactify)
//        .bundle()
//        .pipe(plumber())
//        .pipe(source('app.js'))
//        .pipe(gulp.dest('dist/js'))
//});
//
//// Copy all static libraries
//gulp.task('jslibs', function () {
//    return gulp.src(paths.jslibs)
//        //.pipe(sourcemaps.init({loadMaps: true}))
//        .pipe(concat('libs.min.js'))
//            .pipe(uglify())
//        //.pipe(sourcemaps.write({includeContent: false, sourceRoot: '/src'}))
//        .pipe(gulp.dest('dist/js'));
//});
//
//// Run git add
//// src is the file(s) to add (or ./*)
//gulp.task('git-add', function(){
//    return gulp.src('./src/*')
//        .pipe(git.add());
//});
//
//// Run git commit
//// src are the files to commit (or ./*)
//gulp.task('git-commit', ['git-add'], function(){
//    return gulp.src('.')
//        .pipe(git.commit('auto-commit'));
//});
//
//// Copy all png
//gulp.task('png', function () {
//    return gulp.src(paths.png)
//        // Pass in options to the task
//        /*.pipe(imagemin({
//            optimizationLevel: 5,
//            progressive: true,
//            svgoPlugins: [
//                {removeViewBox: false}
//            ],
//            use: [pngcrush()]
//        }))*/
//        .pipe(gulp.dest('dist/img'))
//});
//
//// Copy all static images
//gulp.task('images', ['png'], function () {
//    return gulp.src(paths.images)
//        // Pass in options to the task
//        .pipe(imagemin({
//            optimizationLevel: 5,
//            progressive: true,
//            svgoPlugins: [
//                {removeViewBox: false}
//            ],
//            use: [pngcrush()]
//        }))
//        .pipe(gulp.dest('dist/img'))
//});
//
//gulp.task('push', shell.task([
//    'git add .',
//    'git commit -am"autocommit" --allow-empty',
//    'git push',
//    'git subtree push --prefix dist heroku master'
//]));
//
//
//gulp.task('browserSync', function () {
//    browserSync({
//        server: {
//            baseDir: './dist'
//        }
//    })
//});
//
//// Rerun the task when a file changes
//gulp.task('watch', function () {
//    //gulp.watch(paths.scripts, ['jscripts']);
//    //gulp.watch('src/jsx/**/*', ['jscripts']);
//    //gulp.watch('src/js/blogdata.js', ['regularjs']);
//    //gulp.watch(paths.jsx, ['minifyapp']);
//    //gulp.watch(paths.scss, ['css']);
//    //gulp.watch(paths.php, ['php2html']);
//
//    gulp.watch(['src/js/ready.js'], ['minifyapp']);
//    gulp.watch(['src/jsx/**/*','src/js/blogdata.js'], ['minifyapp']);
//    gulp.watch('src/scss/**/*', ['css']);
//    gulp.watch(paths.html, ['html']);
//    gulp.watch(paths.php, ['php']);
//    gulp.watch(paths.images, ['images']);
//});
//
//// gulp main tasks
//gulp.task('default', ['css','minifyapp','images','jslibs','php']);
//gulp.task('watchify', ['default', 'watch']);
//gulp.task('serve', ['watchify', 'browserSync']);
//gulp.task('heroku', ['default', 'push']);
//
