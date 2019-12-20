const gulp = require('gulp'),
      pug = require('gulp-pug'),
      browserSync = require('browser-sync'),
      fs = require('fs'),
      yargs = require('yargs'),
      gulpIf = require('gulp-if'),
      replace = require('gulp-replace'),
      {paths} = require('../gulpfile');

const isProductionMode = yargs.argv.mode === 'production';

gulp.task('pug', () => 
    gulp.src(paths.src.pug)
        .pipe(pug({
            pretty: true,
            locals: JSON.parse(fs.readFileSync('src/views/content.json', 'utf-8'))
        }))
        .pipe(gulpIf(isProductionMode, replace(/(src="\/?js\/.+)(\.js)/g, (match, p1, p2) => `${p1}.min${p2}`)))
        .pipe(gulpIf(isProductionMode, replace(/(href="\/?css\/.+)(\.css)/g, (match, p1, p2) => `${p1}.min${p2}`)))
        .pipe(gulp.dest(paths.output.pug))
        .pipe(browserSync.stream())
);