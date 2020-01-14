const gulp = require('gulp'),
      webpack = require('webpack-stream'),
      browserSync = require('browser-sync'),
      yargs = require('yargs'),
      {paths} = require('../gulpfile');

const config = {
    development: {
        mode: 'development',
        devtool: 'source-map',
    },
    production: {
        mode: 'production',
        output: { filename: '[name].min.js' }
    },
}
const mode = yargs.argv.mode || 'development';

gulp.task('js', () => {
    delete require.cache[require.resolve('../webpack.config')];
    webpackConfig = require('../webpack.config');
    Object.assign(webpackConfig, config[mode]);
    return gulp.src(paths.src.js)
        .pipe(webpack(webpackConfig))
        .pipe(gulp.dest(paths.output.js))
        .pipe(browserSync.stream())
});