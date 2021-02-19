const {src, dest, parallel, series, watch} = require('gulp'); // add gulp into project
const browserSync = require('browser-sync').create(); // add liveBrowser
const concat = require('gulp-concat'); // add concat
const uglify = require('gulp-uglify-es').default; //uglify for min
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleancss = require('gulp-clean-css')
// add function for serve
function browsersync(){
    browserSync.init ({
        server: {baseDir: 'app/'}, // path to server file
        notify: false
    })
}

function scripts(){
    return src([
        'app/js/app.js'
    ])
        .pipe(concat('app.min.js')) //file
        .pipe(uglify()) // min
        .pipe(dest('app/js')) //path
        .pipe(browserSync.stream())
}

function styles(){
    return src('app/scss/style.scss')
        .pipe(sass())
        .pipe(concat('style.min.css'))
        .pipe(autoprefixer({overrideBrowserslist:['last 10 version'], grid:true}))
        .pipe(cleancss(({level: {1: { specialComments:0 }}, format: 'beautify'})))
        .pipe(dest('app/style'))
        .pipe(browserSync.stream())

}

function startWatch(){
    watch('app/**/*.scss', styles);
    watch(['app/**/*.js', '!app/**/min/js'],scripts);
    watch ('app/**/*.html').on('change', browserSync.reload);
}
exports.browsersync=browsersync;
exports.scripts=scripts;
exports.styles=styles;

exports.default = parallel(styles, scripts, browsersync, startWatch)