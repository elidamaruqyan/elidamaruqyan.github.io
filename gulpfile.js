'use strict';

const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const cssnano = require('gulp-cssnano');
const concat = require('gulp-concat');
const runSequence = require('run-sequence');
const htmlmin = require('gulp-htmlmin');
const del = require('del');
const browserSync = require('browser-sync').create();
const changed = require('gulp-changed');
const imagemin = require('gulp-imagemin');
const autoprefixer = require('autoprefixer');
const cssnext = require('postcss-cssnext');
const shortcss = require('postcss-short');
const deploy      = require('gulp-gh-pages');

// Gulp task fto add autoprefixer
gulp.task('css', function() {
    var plugins = [
        shortcss,
        cssnext,
        autoprefixer({browsers: ['> 1%'], cascade: false})
    ];
    return gulp.src('app/css/**/*.css')
        .pipe(sourcemaps.init())
        .pipe(postcss(plugins))
        .pipe(cssnano())
        .pipe(concat('main.css'))
        .pipe(sourcemaps.write('.'))
        // Output
        .pipe(gulp.dest('./dist/css'))
});

// Gulp task to minify HTML files
gulp.task('pages', function () {
    return gulp.src(['app/**/*.html'])
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(gulp.dest('./dist'));
});

// Gulp task to minify Image files
gulp.task('imagemin', function () {
    var imgSrc = 'app/assets/images/*.+(jpg|gif|jpeg|svg|png)',
        imgDst = 'dist/assets/images';

    gulp.src(imgSrc)
        .pipe(changed(imgDst))
        .pipe(imagemin())
        .pipe(gulp.dest(imgDst));
});

// Clean output directory
gulp.task('clean', () => del(['dist']));

// Gulp task to minify all files
gulp.task('default', ['clean'], function () {
    runSequence(
        'styles',
        'pages'
    );
});

gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: './app'
        },
    })
});

gulp.task('bs-reload', function () {
    browserSync.reload();
});

gulp.task('deploy', function () {
    return gulp.src("./dist/**/*")
        .pipe(deploy())
});

// Watch Css and Html files, doing different things with each.
gulp.task('watch', ['browserSync'], function () {
    gulp.watch('app/**/*.html', ['pages']);
    gulp.watch('app/**/*.css', ['css']);
    gulp.watch('app/assets/images/*', ['imagemin']);
});


