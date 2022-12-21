import { createRequire } from "module";
const require = createRequire(import.meta.url);

import gulp from 'gulp';
const sass = require('gulp-sass')(require("node-sass"));
const cssnano = require('gulp-cssnano');
const rev = require('gulp-rev');
const uglify = require("gulp-uglify-es").default;
import imagemin from 'gulp-imagemin';
import {deleteSync} from 'del';


gulp.task('css', function(done){

    console.log('minifying css...');
    gulp.src('./assets/sass/**/*.scss')
    .pipe(sass())
    .pipe(cssnano())
    .pipe(gulp.dest('./assets.css'));

    gulp.src('./assets/**/*.css')
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd: 'public',
        merge: true
    }))
    .pipe(gulp.dest('./public/assets'));

    done();

});

gulp.task('js', function(done){
    console.log('Minifying js...');
    
    gulp.src('./assets/**/*.js')
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd: 'public',
        merge: true
    }))
    .pipe(gulp.dest('./public/assets'));

    done();

});


gulp.task('images', function(done){
    console.log('compressing images...');

    gulp.src('./assets/**/*.+(png|jpg|gif|svg|jpeg')
    .pipe(imagemin())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd: 'public',
        merge: true
    }))
    .pipe(gulp.dest('./public/assets'));

    done();
});

// empty the public assets directory
gulp.task('clean:assets', function(done){
    console.log("Clearing Previous Builds...");
	deleteSync(["./public/assets"], { force: true });
	console.log("Cleared Previous Builds...");
	done();
});


gulp.task('build', gulp.series('clean:assets', 'css', 'js', 'images'), function(done){
    console.log('Building assets...');
    done();
});

