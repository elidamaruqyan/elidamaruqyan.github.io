"use strict";

// Load plugins
const autoprefixer = require("autoprefixer");
const browsersync = require("browser-sync").create();
const cp = require("child_process");
const cssnano = require("cssnano");
const del = require("del");
const gulp = require("gulp");
const imagemin = require("gulp-imagemin");
const newer = require("gulp-newer");
const plumber = require("gulp-plumber");
const postcss = require("gulp-postcss");
const rename = require("gulp-rename");
const sass = require("gulp-sass");

// BrowserSync
function browserSync(done) {
    browsersync.init({
        server: {
            baseDir: "./app/"
        },
        port: 3000
    });
    done();
}

// BrowserSync Reload
function browserSyncReload(done) {
    browsersync.reload();
    done();
}

// Clean assets
function clean() {
    return del(["./app/assets/"]);
}

// Optimize Images
function images() {
    return gulp
        .src("./app/assets/images/**/*")
        .pipe(newer("./dist/assets/images"))
        .pipe(
            imagemin([
                imagemin.gifsicle({ interlaced: true }),
                imagemin.optipng({ optimizationLevel: 5 }),
                imagemin.svgo({
                    plugins: [
                        {
                            removeViewBox: false,
                            collapseGroups: true
                        }
                    ]
                })
            ])
        )
        .pipe(gulp.dest("./dist/assets/images"));
}

// CSS task
function css() {
    return gulp
        .src("./app/css/**/*.css")
        .pipe(plumber())
        .pipe(sass({ outputStyle: "expanded" }))
        .pipe(gulp.dest("./dist/css/"))
        .pipe(rename({ suffix: ".min" }))
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(gulp.dest("./dist/css/"))
        .pipe(browsersync.stream());
}



// Watch files
function watchFiles() {
    gulp.watch("./app/css/**/*", css);
    gulp.watch(["./app/**/*",],
        gulp.series(browserSyncReload)
    );
    gulp.watch("./app/assets/images/**/*", images);
}

// define complex tasks
const build = gulp.series(clean, gulp.parallel(css, images));
const watch = gulp.parallel(watchFiles, browserSync);

// export tasks
exports.images = images;
exports.css = css;
exports.clean = clean;
exports.build = build;
exports.watch = watch;
exports.default = build;
