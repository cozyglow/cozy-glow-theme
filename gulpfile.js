const fs            = require("fs")
const gulp          = require("gulp")
const path          = require("path")
const sass          = require("gulp-sass")
const autoprefixer  = require("gulp-autoprefixer")
const sourcemaps    = require("gulp-sourcemaps")
const cleanCSS      = require("gulp-clean-css")
const rename        = require("gulp-rename")
const concat        = require("gulp-concat")
const uglify        = require("gulp-uglify")
const connect       = require("gulp-connect")
const open          = require("gulp-open")
const babel         = require("gulp-babel")
const replace       = require("gulp-replace")
const wrapper       = require("gulp-wrapper")
const tildeImporter = require("node-sass-tilde-importer")

sass.compiler = require("node-sass");

var Paths = {
    HERE                 : "./",
    DIST                 : "dist",
    DIST_TOOLKIT_JS      : "dist/toolkit.js",
    SCSS_TOOLKIT_SOURCES : "./scss/toolkit*",
    SCSS                 : "./scss/**/**",
    JS                   : [
        "./node_modules/bootstrap/js/src/util.js",
        "./node_modules/bootstrap/js/src/alert.js",
        "./node_modules/bootstrap/js/src/button.js",
        "./node_modules/bootstrap/js/src/carousel.js",
        "./node_modules/bootstrap/js/src/collapse.js",
        "./node_modules/bootstrap/js/src/dropdown.js",
        "./node_modules/bootstrap/js/src/modal.js",
        "./node_modules/bootstrap/js/src/tooltip.js",
        "./node_modules/bootstrap/js/src/popover.js",
        "./node_modules/bootstrap/js/src/scrollspy.js",
        "./node_modules/bootstrap/js/src/tab.js",
        "./js/*"
    ]
}

var banner  = "/*!\n"
    + " * Cozy Glow\n"
    + " * Copyright © 2018 - 2019\n"
    + " */\n"
var jqueryCheck = 'if (typeof jQuery === \'undefined\') {\n'
    + '  throw new Error(\'Bootstrap\\\'s JavaScript requires jQuery. jQuery must be included before Bootstrap\\\'s JavaScript.\')\n'
    + '}\n'
var jqueryVersionCheck = '+function ($) {\n'
    + '  var version = $.fn.jquery.split(\' \')[0].split(\'.\')\n'
    + '  if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1) || (version[0] >= 4)) {\n'
    + '    throw new Error(\'Bootstrap\\\'s JavaScript requires at least jQuery v1.9.1 but less than v4.0.0\')\n'
    + '  }\n'
    + '}(jQuery);\n\n'

var sassConfig = {
    importer: tildeImporter
}

/**
 * Watch task.
 *
 * @method watch
 */
function watch() {
    gulp.watch(Paths.SCSS, gulp.series(scss, scssMin))
    gulp.watch(Paths.JS,   gulp.series(js, jsMin))
}

/**
 * Docs task.
 *
 * @method docs
 */
function docs() {
    gulp.src(__filename).pipe(open({uri: "http://localhost:9001/docs"}))
}

/**
 * Server task.
 *
 * @method server
 */
function server() {
    connect.server({
        root: "docs",
        port: 9001,
        livereload: true
    })
}

/**
 * SCSS task.
 *
 * @method scss
 */
function scss() {
    return gulp.src(Paths.SCSS_TOOLKIT_SOURCES)
        .pipe(sourcemaps.init())
        .pipe(sass(sassConfig).on("error", sass.logError))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write(Paths.HERE))
        .pipe(gulp.dest(Paths.DIST))
}

/**
 * SCSS min task.
 *
 * @method scssMin
 */
function scssMin() {
    return gulp.src(Paths.SCSS_TOOLKIT_SOURCES)
        .pipe(sourcemaps.init())
        .pipe(sass(sassConfig).on("error", sass.logError))
        .pipe(cleanCSS({compatibility: "ie9"}))
        .pipe(autoprefixer())
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(sourcemaps.write(Paths.HERE))
        .pipe(gulp.dest(Paths.DIST))
}

/**
 * JavaScript task.
 *
 * @method js
 */
function js() {
    return gulp.src(Paths.JS)
        .pipe(concat("toolkit.js"))
        .pipe(replace(/^(export|import).*/gm, ""))
        .pipe(babel({
            "compact" : false,
            "presets": [
                [
                    "@babel/env",
                    {
                        "modules": false,
                        "loose": true,
                        "exclude": ["transform-typeof-symbol"]
                    }
                ]
            ],
            "plugins": [
                "transform-es2015-modules-strip",
                "@babel/plugin-proposal-object-rest-spread"
            ]}))
        .pipe(wrapper({
            header: banner
                + "\n"
                + jqueryCheck
                + "\n"
                + jqueryVersionCheck
                + "\n+function () {\n",
            footer: "\n}();\n"
        }))
        .pipe(gulp.dest(Paths.DIST))
}

/**
 * JavaScript min task.
 *
 * @method jsMin
 */
function jsMin() {
    return gulp.src(Paths.DIST_TOOLKIT_JS)
        .pipe(uglify())
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(gulp.dest(Paths.DIST))
}

/**
 * Declare tasks.
 */
exports.watch = watch
exports.docs = docs
exports.server = server
exports.scss = scss
exports.scssMin = gulp.series(scss, scssMin)
exports.js = js
exports.jsMin = gulp.series(js, jsMin)
exports.default = gulp.parallel(gulp.series(scss, scssMin), gulp.series(js, jsMin))

gulp.task("default", gulp.parallel(gulp.series(scss, scssMin), gulp.series(js, jsMin)))

gulp.task("watch", watch)

gulp.task("docs", gulp.series(server, docs))

gulp.task("server", server)

gulp.task("scss", scss)

gulp.task("scss-min", gulp.series(scss, scssMin))

gulp.task("js", js)

gulp.task("js-min", gulp.series(js, jsMin))
