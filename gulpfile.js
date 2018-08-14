const gulp = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const browserSync = require('browser-sync').create();
const gulpWebpack = require('webpack-stream');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');
const autoprefixer = require('gulp-autoprefixer');
const svgSprite = require('gulp-svg-sprite');
const svgmin = require('gulp-svgmin');
const cheerio = require('gulp-cheerio');
const replace = require('gulp-replace');



const paths = {
    root: './build',
    templates: {
        pages: 'src/templates/pages/*.pug',
        src: 'src/templates/**/*.pug',
        dest: 'build/'
    },
    style: {
        src: 'src/style/**/*.scss',
        dest: 'build/styles'
    }
}

//oчистка
function clean() {
    return del(paths.root);
}


//pug
function templates() {
    return gulp.src(paths.templates.pages)
        .pipe(pug({ pretty: true }))
        .pipe(gulp.dest(paths.templates.dest));
}

//scss
function styles() {
    return gulp.src('./src/style/app.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({outputstyle: 'compressed' }))
        .pipe(sourcemaps.write())
        .pipe(rename({suffix: '.min' }))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest(paths.style.dest));
        
}

//слежка
function watch() {
    gulp.watch(paths.style.src, styles);
    gulp.watch(paths.templates.src, templates);
}

//следим за build и релоадим браузер
function server() {
    browserSync.init({
        server: paths.root
    });
    browserSync.watch(paths.root + '/**/*.*', browserSync.reload);
}


exports.templates = templates;
exports.styles = styles;
exports.clean = clean;



gulp.task('default', gulp.series(
    clean,
    gulp.parallel(styles, templates),
    gulp.parallel(watch, server)
));

