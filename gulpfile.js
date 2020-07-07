'use strict';

const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const runSequence = require('run-sequence');
const htmlmin = require('gulp-htmlmin');
const cssnano = require('gulp-cssnano');
const del = require('del');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');


// Gulp task to add autoprefixer
gulp.task('default', () =>
    gulp.src('./app/*.css')
        .pipe(autoprefixer({
            browsers: ['defaults'],
            cascade: false
        }))
        .pipe(gulp.dest('dist'))
);

// Gulp task to minify CSS files
gulp.task('styles', function () {
    return gulp.src('./app/css/*.css')
    // Minify the file
        .pipe(cssnano())
        .pipe(concat('all.css'))
        // Output
        .pipe(gulp.dest('./dist/css'))
});

// Gulp task to minify HTML files
gulp.task('pages', function () {
    return gulp.src(['./app/**/*.html'])
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(gulp.dest('./dist'));
});

//Gulp task to minify images
gulp.task('images', function () {
    return gulp.src('./app/assets/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/assets/images'))
});

// Clean output directory
gulp.task('clean', () => del(['dist']));

// Gulp task to minify all files
gulp.task('default', ['clean'], function () {
    runSequence(
        'styles',
        'scripts',
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

// Watch Css and Html files, doing different things with each.
gulp.task('watch', ['browserSync'], function () {
    gulp.watch('app/**/*.html', ['pages']);
    gulp.watch('app/**/*.css', ['styles']);
});
