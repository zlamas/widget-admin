import browserSync from 'browser-sync';
import { deleteAsync } from 'del';
import { src, dest, task, series, parallel, watch } from 'gulp';
import concat from 'gulp-concat';
import fileinclude from 'gulp-file-include';
import gulpSass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import * as dartSass from 'sass';

const sass = gulpSass(dartSass);

const src_dir = 'src';
const dest_dir = 'dist';

task('pages', () => {
  return src(src_dir + '/pages/**/*.html')
    .pipe(fileinclude({ basepath: src_dir }))
    .pipe(dest(dest_dir))
    .pipe(browserSync.stream());
});

task('styles', () => {
  return src(src_dir + '/sass/main.sass')
    .pipe(sourcemaps.init())
    .pipe(sass.sync({ silenceDeprecations: ['legacy-js-api'] }).on('error', sass.logError))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(dest_dir + '/css'))
    .pipe(browserSync.stream());
});

task('scripts', () => {
  return src(src_dir + '/js/*.js')
    .pipe(sourcemaps.init())
    .pipe(concat('main.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(dest_dir + '/js'))
    .pipe(browserSync.stream());
});

task('images', () => {
  return src(src_dir + '/images/*', { encoding: false })
    .pipe(dest(dest_dir + '/images'));
});

task('fonts', () => {
  return src(src_dir + '/fonts/*', { encoding: false })
    .pipe(dest(dest_dir + '/fonts'));
});

task('clean', () => {
  return deleteAsync(dest_dir + '/*');
});

task('build', parallel('pages', 'styles', 'scripts', 'images', 'fonts'));

task('reload', (done) => {
  browserSync.reload();
  done();
});

task('serve', () => {
  browserSync.init({
    browser: ['chrome', 'firefox'],
    server: dest_dir,
  });

  watch(src_dir + '/**/*.html', series('pages', 'reload'));
  watch(src_dir + '/sass/**/*', series('styles', 'reload'));
  watch(src_dir + '/js/**/*', series('scripts', 'reload'));
  watch(src_dir + '/images/**/*', series('images', 'reload'));
  watch(src_dir + '/fonts/**/*', series('fonts', 'reload'));
});

task('default', series('clean', 'build', 'serve'));
