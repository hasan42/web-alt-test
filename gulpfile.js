const { src, dest, series, parallel, watch } = require('gulp'),
      less = require('gulp-less'),
      cleanCSS = require('gulp-clean-css'),
      browserSync = require('browser-sync'),
      uglify = require('gulp-uglify'),
      gulpCopy = require('gulp-copy'),
      rename  = require('gulp-rename'),
      del = require('del'),
      autoprefixer = require('gulp-autoprefixer');

const path = {
  src: { // исходники
    html: 'www/*.html',
    styles: 'www/assets/less/bundle.less',
    css: 'www/css/',
    img: '',
    fonts: ''
  },
  build: { // готовые после сборки файлы
    html: 'dist/',
    js: 'dist/js/',
    css: 'dist/css/',
    img: '',
    fonts: ''
  },
  watch: { // за изменением каких файлов мы хотим наблюдать
    html: 'www/**/*.html',
    js: 'www/assets/**/*.js',
    styles: 'www/assets/**/*.less',
    img: '',
    fonts: ''
  },
  clean: './dist'
};

function clean() {
  return del.sync('dist');
}

function css() {
  return src(path.src.styles) // Берем источник
    .pipe(less()) // Преобразуем less в CSS посредством gulp-less
    .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie >= 9'], { cascade: true })) // Создаем префиксы
    .pipe(cleanCSS())
    .pipe(dest(path.src.css)) // Выгружаем результата в папку www/css
    .pipe(browserSync.stream()) // Обновляем CSS на странице при изменении
}

// function javascript(cb) {
//   return src([ // Берем все необходимые библиотеки
//       'www/js/jquery.min.js' // Берем jQuery
//     ])
//     .pipe(concat('libs.min.js')) // Собираем их в кучу в новом файле libs.min.js
//     .pipe(uglify()) // Сжимаем JS файл
//     .pipe(gulp.dest('www/js')); // Выгружаем в папку app/js
// }

function server(){
  browserSync.init({
    port: 3100,
    open: true,
    notify: false,
    server: {
      baseDir: "./www"
    }
  });
}
function serverReload() {
  browserSync.reload();
}
function watchFiles() {
  watch(path.watch.styles, css);
  watch(path.src.css + '*.css').on("change", serverReload);
  watch(path.watch.html).on('change', serverReload);
  watch(path.watch.js).on('change', serverReload);
}

exports.clean = clean;
exports.css = css;

exports.build = series(clean, parallel(css));
exports.default = parallel(watchFiles, server);