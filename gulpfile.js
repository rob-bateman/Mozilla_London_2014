var gulp = require('gulp');
var glob = require('glob');
var path = require('path');
var browserify  = require('browserify');
var source = require('vinyl-source-stream');
var transform = require('vinyl-transform');
var exorcist = require('exorcist');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');

var typescript = require('gulp-typescript');

gulp.task('compile', function() {
    var tsProject = typescript.createProject({
        declarationFiles: true,
        noExternalResolve: true,
        target: 'ES5',
        module: 'commonjs',
        sourceRoot: './src'
    });

    var tsResult = gulp.src(['./src/Intermediate_AWDViewer.ts', './node_modules/awayjs-**/build/*.d.ts'])
        .pipe(sourcemaps.init())
        .pipe(typescript(tsProject));

    return tsResult.js
        .pipe(sourcemaps.write({sourceRoot: './'}))
        .pipe(gulp.dest('./src'));
});

gulp.task('watch', ['package', 'tests'], function() {
    gulp.watch('./src/*.ts', ['package']);
});

gulp.task('package', ['compile'], function(){
    var b = browserify({
        debug: true,
        entries: './src/Intermediate_AWDViewer.js'
    });

    return b.bundle()
        .pipe(exorcist('./bin/js/Intermediate_AWDViewer.js.map'))
        .pipe(source('Intermediate_AWDViewer.js'))
        .pipe(gulp.dest('./bin/js/'));
});

gulp.task('package-min', ['package'], function(callback){
    return gulp.src('./bin/js/Intermediate_AWDViewer.js')
        .pipe(sourcemaps.init({loadMaps:true}))
        .pipe(uglify({compress:false}))
        .pipe(sourcemaps.write({sourceRoot:'./'}))
        .pipe(transform(function() { return exorcist('./bin/js/Intermediate_AWDViewer.js.map'); }))
        .pipe(gulp.dest('./bin/js/'));
});

gulp.task('package-awayjs', function(callback){
    var b = browserify({
        debug: true,
        paths: ['../']
    });

    glob('./node_modules/awayjs-**/lib/**/*.js', {}, function (error, files) {

        files.forEach(function (file) {
            b.require(file, {expose:path.relative('./node_modules/', file.slice(0,-3))});
        });

        b.bundle()
            .pipe(exorcist('./bin/js/awayjs-dist-require.js.map'))
            .pipe(source('awayjs-dist-require.js'))
            .pipe(gulp.dest('./bin/js'))
            .on('end', callback);
    });
});

gulp.task('package-awayjs-min', ['package-awayjs'], function(callback){
    return gulp.src('./bin/js/awayjs-dist-require.js')
        .pipe(sourcemaps.init({loadMaps:true}))
        .pipe(uglify({compress:false}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./bin/js'));
});