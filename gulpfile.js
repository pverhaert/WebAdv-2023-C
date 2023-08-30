// your class and name
const name = `1ITFxx_surname_name`;

import gulp from 'gulp';

// Needed for development (gulp)
import browserSync from 'browser-sync';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import sass from 'gulp-dart-sass';
import prefix from 'gulp-autoprefixer';
import sourcemaps from 'gulp-sourcemaps';
import zip from 'gulp-zip';


// Copy Bootstrap JS-file
gulp.task('copy-js', () =>
    gulp
        .src(['node_modules/bootstrap/dist/js/bootstrap.bundle.min.js'])
        .pipe(gulp.dest('./src/js'))
);

// Compile sass into CSS (/src/css/)
gulp.task('sass', () => {
    return (
        gulp
            .src('./scss/**/*.scss')
            .pipe(
                plumber({
                    errorHandler: notify.onError({
                        title: 'SASS compile error!',
                        message: '<%= error.message %>',
                    }),
                })
            )
            .pipe(sourcemaps.init())
            // outputStyle: expanded or compressed
            .pipe(sass.sync({ outputStyle: 'expanded' }).on('error', sass.logError))
            .pipe(prefix('last 2 versions'))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest('./src/css'))
    );
});

// Live-reload the browser
gulp.task('browser-sync', () => {
    browserSync.init({
        startPath: '/index.html',
        port: 7700,
        server: {
            baseDir: './src',
            directory: true,
        },
        ui: {
            port: 7710,
        },
    });
    gulp.watch('./scss/**/*.scss', gulp.series('sass'));
    gulp.watch('./src/**/*.{html,css,js}').on('change', browserSync.reload);
});

gulp.task('zip', () => gulp
    .src(['./**/*', '!./**/node_*', '!./**/node_modules/**/*', '!./*.zip'])
    .pipe(zip(`${name}.zip`))
    .pipe(gulp.dest('./')));

gulp.task('default', gulp.series('copy-js', 'sass', 'browser-sync'));
