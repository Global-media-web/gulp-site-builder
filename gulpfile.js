const gulp = require('gulp'),
      fs = require('fs'),
      path = require('path'),
      pug = require('gulp-pug'),
      postCSS = require('gulp-postcss'),
      cssNext = require('postcss-cssnext'),
      cssnano = require('cssnano'),
      cssImport = require('postcss-import'),
      browserSync = require('browser-sync').create(),
      webpack = require('webpack-stream'),
      webpackConfig = require('./webpack.config'),
      imagemin = require('gulp-imagemin'),
      webp = require('imagemin-webp'),
      rename = require('gulp-rename'),
      mozjpeg = require('imagemin-mozjpeg');

const paths = {
    src: {
        pug: "./src/views/*.pug",
        css: "./src/css/*.css",
        js: "./src/js/*.js",
        img: "./src/img/**/*.*",
        font: "./src/fonts/**/*.*",
    },
    output: {
        pug: "./build/",
        css: "./build/css/",
        js: "./build/js/",
        img: "./build/img/",
        font: "./build/fonts/",
    },
    watch: {
        pug: "./src/views/**/*.pug",
        css: "./src/css/**/*.css",
        js: "./src/js/**/*.js",
        img: "./src/img/**/*.*",
        font: "./src/fonts/**/*.*",
    },
    build: "./build/"
}

gulp.task('pug', () => 
    gulp.src(paths.src.pug)
        .pipe(pug({
            pretty: true,
            locals: JSON.parse(fs.readFileSync('./content.json', 'utf-8'))
        }))
        .pipe(gulp.dest(paths.output.pug))
        .pipe(browserSync.stream())
);

gulp.task('css', () =>
    gulp.src(paths.src.css)
        .pipe(postCSS([
            cssImport({root: './src/css/*.css'}),
            cssNext(),
            cssnano()
        ]))
        .pipe(gulp.dest(paths.output.css))
        .pipe(browserSync.stream())
);

gulp.task('js', () => 
    gulp.src(paths.src.js)
        .pipe(webpack(webpackConfig))
        .pipe(gulp.dest(paths.output.js))
        .pipe(browserSync.stream())
);

gulp.task('serve', () => {
    browserSync.init({
        server: './build/'
    });
    gulp.watch(paths.watch.pug, gulp.parallel('pug'));
    gulp.watch(paths.watch.css, gulp.parallel('css'));
    gulp.watch(paths.watch.js, gulp.parallel('js'));
    gulp.watch(paths.watch.img, gulp.parallel('image'));
    gulp.watch(paths.watch.img, gulp.parallel('imgToWebp'));
    gulp.watch(paths.watch.font, gulp.parallel('fonts'));
});

gulp.task('clean', (done) => {
    const removeDir = (dirPath) => {
        if(!fs.existsSync(dirPath)) return;
        const list = fs.readdirSync(dirPath, {withFileTypes: true});
        list.forEach(item => {
            const rightPath = path.join(dirPath, item.name);
            item.isDirectory() ? removeDir(rightPath) : fs.unlinkSync(rightPath);
        })
        fs.rmdirSync(dirPath);
    }
    removeDir(paths.build);
    done();
});
gulp.task('image', () =>
    gulp.src(paths.src.img)
        .pipe(imagemin([
            mozjpeg({progressive: true, quality: 75})
        ]))
        .pipe(gulp.dest(paths.output.img))
        .pipe(browserSync.stream())
);
gulp.task('imgToWebp', () =>
    gulp.src(paths.src.img)
        .pipe(imagemin([webp()]))
        .pipe(rename({extname: '.webp'}))
        .pipe(gulp.dest(paths.output.img))
        .pipe(browserSync.stream())
);
gulp.task('fonts', () =>
    gulp.src(paths.src.font)
        .pipe(gulp.dest(paths.build.font))
);
gulp.task('default', gulp.series('clean', gulp.parallel('pug', 'css', 'js', 'image', 'imgToWebp', 'fonts'), gulp.parallel('serve')));