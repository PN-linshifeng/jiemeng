var gulp = require("gulp");
var browserSync = require("browser-sync").create();
var ssi = require('browsersync-ssi');
var reload = browserSync.reload;
var rubySass = require("gulp-ruby-sass");
var sourcemaps = require('gulp-sourcemaps'); // 来源地图
// var node        = require('node-sass');
// var nodeSass    = require('gulp-sass');
var cleanCss = require('gulp-clean-css'); //css压缩
var spriter = require('gulp-css-spriter'); //雪碧图
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var imageminMozjpeg = require('imagemin-mozjpeg');
var autoprefix = require('gulp-autoprefixer'); //浏览器商家前缀

var config = {
    svn: '.'
}

var webUrl = config.svn;


// 静态服务器 + 监听 scss/html 文件
gulp.task('serve', ["sassAllCN", "sassSpriterCN"], function() {
    // "scssEN","scssCN"
    browserSync.init({
        server: {
            baseDir: './',
            middleware: ssi({
                baseDir: "./",
                ext: ['.html']
            })
        },
        port: 3009

    });

    gulp.watch(['./**/*.html', '!node_modules/**']).on('change', reload);
    gulp.watch("./static/**/*.js").on('change', reload);
    // gulp.watch("/cn|en/**/*.css", ['cssLoad']);

    //两个版本站
    gulp.watch("static/scss/**/!(sprite)*", ['sassAllCN']);
    gulp.watch("static/scss/**/+(sprite)*", ['sassSpriterCN']);
    // gulp.watch("en/static/scss/**/!(sprite)*", ['sassAllEN']);
    // gulp.watch("en/static/scss/**/+(sprite)*", ['sassSpriterEN']);
});


gulp.task("cssLoad", function() {
        gulp.src(webUrl + '/**/*.css')
            .pipe(browserSync.stream({
                match: '**/*.css'
            }));
    })
    //dist ruby sass 编译
gulp.task('scss', function() {

    var timestamp = +new Date().getTime();
    return rubySass('/static/scss/*.scss', {
            sourcemap: true
        })
        .on('error', rubySass.logError)
        .pipe(autoprefix({
            browsers: ['last 30 versions', 'Android >= 4.0'],
            cascade: true, //是否美化属性值 默认：true 像这样：
            //-webkit-transform: rotate(45deg);
            //        transform: rotate(45deg);
            remove: true //是否去掉不必要的前缀 默认：true 
        }))
        .pipe(cleanCss({
            compatibility: 'ie7'
        }))
        // .pipe(spriter({
        //     //生成的spriter的位置
        //     'spriteSheet': webUrl+'/static/images/sprite' + timestamp + '.png',
        //     //生成样式文件图片引用地址的路径
        //     //如下将生产：backgound:url(../images/sprite20324232.png)
        //     'pathToSpriteSheetFromCSS': '../images/sprite' + timestamp + '.png',
        // }))
        .pipe(sourcemaps.write('./', { //路径相对 gulp.dest
            includeContent: false,
            sourceRoot: '../scss/' //gulp.dest sourcemaps
        }))
        .pipe(gulp.dest('/static/css/'))
        .pipe(browserSync.stream({
            match: '**/*.css'
        }));
});

// sass 过滤雪碧图文件
gulp.task("sassAll", function() {
    var timestamp = +new Date().getTime();
    var src = '/static/scss/**/+(sprite)*.scss';
    var filter = '/static/scss/**/!(sprite)*.scss';
    rubySass([filter], {
            sourcemap: true
        })
        .pipe(autoprefix({
            browsers: ['last 30 versions', 'Android >= 4.0'],
            cascade: false, //是否美化属性值 默认：true 像这样：
            //-webkit-transform: rotate(45deg);
            //        transform: rotate(45deg);
            remove: true //是否去掉不必要的前缀 默认：true 
        }))
        .pipe(cleanCss({
            compatibility: 'ie7'
        })) //压缩        
        .pipe(sourcemaps.write('./', { //路径相对 gulp.dest
            includeContent: false,
            sourceRoot: '../scss/' //gulp.dest sourcemaps
        }))
        .pipe(gulp.dest('/static/css/'))
        .pipe(browserSync.stream({
            match: '**/*.css'
        }));
})

// 雪碧图 
gulp.task("sassSpriter", function() {
    var timestamp = +new Date().getTime();
    var src = '/static/scss/**/+(sprite)*.scss';
    var filter = '/static/scss/**/!(sprite)*.scss';
    var fileName = [{
        path: '/static/scss/**/sprite.scss',
        name: 'sprite.png'
    }];
    fileName.forEach(function(val) {
        var src = val.path;
        var img = val.name;
        console.log("xxxx--" + val.path)
        rubySass([src], {
                sourcemap: true
            })
            .pipe(
                spriter({
                    //生成的spriter的位置
                    'spriteSheet': '/static/images/' + img,
                    //生成样式文件图片引用地址的路径
                    //如下将生产：backgound:url(../images/sprite20324232.png)
                    'pathToSpriteSheetFromCSS': '../images/' + img + "?" + Date.now(),
                    'spritesmithOptions': {
                        padding: 15
                    }, //图片之间的间隙
                    'unit': 'rem', //默认PX 单位
                    'scale': 100 //默认 100px=1rem,最小比例是12px=1rem。由于谷歌pc浏览器最小是12px
                }))
            .pipe(autoprefix({
                browsers: ['last 30 versions', 'Android >= 4.0'],
                cascade: false, //是否美化属性值 默认：true 像这样：
                //-webkit-transform: rotate(45deg);
                //        transform: rotate(45deg);
                remove: true //是否去掉不必要的前缀 默认：true 
            }))

        .pipe(cleanCss({
                compatibility: 'ie7'
            })) //压缩      
            .pipe(sourcemaps.write('./', { //路径相对 gulp.dest
                includeContent: false,
                sourceRoot: '../scss/' //gulp.dest sourcemaps
            }))

        .pipe(gulp.dest('/static/css/'))
            .pipe(browserSync.stream({
                match: '**/*.css'
            }));
    })

})
gulp.task("sassAllEN", function() {
    var timestamp = +new Date().getTime();
    var src = 'en/static/scss/**/+(sprite)*.scss';
    var filter = 'en/static/scss/**/!(sprite)*.scss';
    rubySass([filter], {
            sourcemap: true
        })
        .pipe(autoprefix({
            browsers: ['last 30 versions', 'Android >= 4.0'],
            cascade: false, //是否美化属性值 默认：true 像这样：
            //-webkit-transform: rotate(45deg);
            //        transform: rotate(45deg);
            remove: true //是否去掉不必要的前缀 默认：true 
        }))
        .pipe(cleanCss({
            compatibility: 'ie7'
        })) //压缩        
        .pipe(sourcemaps.write('./', { //路径相对 gulp.dest
            includeContent: false,
            sourceRoot: '../scss/' //gulp.dest sourcemaps
        }))
        .pipe(gulp.dest('en/static/css/'))
        .pipe(browserSync.stream({
            match: '**/*.css'
        }));
})

// 雪碧图 
gulp.task("sassSpriterEN", function() {
    var timestamp = +new Date().getTime();
    var src = 'en/static/scss/**/+(sprite)*.scss';
    var filter = 'en/static/scss/**/!(sprite)*.scss';
    var fileName = [{
        path: 'en/static/scss/**/sprite.scss',
        name: 'sprite.png'
    }];
    fileName.forEach(function(val) {
        var src = val.path;
        var img = val.name;
        console.log("xxxx--" + val.path)
        rubySass([src], {
                sourcemap: true
            })
            .pipe(
                spriter({
                    //生成的spriter的位置
                    'spriteSheet': 'en/static/images/' + img,
                    //生成样式文件图片引用地址的路径
                    //如下将生产：backgound:url(../images/sprite20324232.png)
                    'pathToSpriteSheetFromCSS': '../images/' + img + "?" + Date.now(),
                    'spritesmithOptions': {
                        padding: 15
                    }, //图片之间的间隙
                    'unit': 'px', //默认PX 单位
                    'scale': 100 //默认 100px=1rem,最小比例是12px=1rem。由于谷歌pc浏览器最小是12px
                }))
            .pipe(autoprefix({
                browsers: ['last 30 versions', 'Android >= 4.0'],
                cascade: false, //是否美化属性值 默认：true 像这样：
                //-webkit-transform: rotate(45deg);
                //        transform: rotate(45deg);
                remove: true //是否去掉不必要的前缀 默认：true 
            }))

        .pipe(cleanCss({
                compatibility: 'ie7'
            })) //压缩      
            .pipe(sourcemaps.write('./', { //路径相对 gulp.dest
                includeContent: false,
                sourceRoot: '../scss/' //gulp.dest sourcemaps
            }))

        .pipe(gulp.dest('en/static/css/'))
            .pipe(browserSync.stream({
                match: '**/*.css'
            }));
    })

})
gulp.task("sassAllCN", function() {
    var timestamp = +new Date().getTime();
    var src = 'static/scss/**/+(sprite)*.scss';
    var filter = 'static/scss/**/!(sprite)*.scss';
    rubySass([filter], {
            sourcemap: true
        })
        .pipe(autoprefix({
            browsers: ['last 30 versions', 'Android >= 4.0'],
            cascade: false, //是否美化属性值 默认：true 像这样：
            //-webkit-transform: rotate(45deg);
            //        transform: rotate(45deg);
            remove: true //是否去掉不必要的前缀 默认：true 
        }))
        .pipe(cleanCss({
            compatibility: 'ie7'
        })) //压缩        
        .pipe(sourcemaps.write('./', { //路径相对 gulp.dest
            includeContent: false,
            sourceRoot: '../scss/' //gulp.dest sourcemaps
        }))
        .pipe(gulp.dest('static/css/'))
        .pipe(browserSync.stream({
            match: '**/*.css'
        }));
})

// 雪碧图 
gulp.task("sassSpriterCN", function() {
        var timestamp = +new Date().getTime();
        var src = 'static/scss/**/+(sprite)*.scss';
        var filter = 'static/scss/**/!(sprite)*.scss';
        var fileName = [{
            path: 'static/scss/**/sprite.scss',
            name: 'sprite.png'
        }];
        fileName.forEach(function(val) {
            var src = val.path;
            var img = val.name;
            console.log("xxxx--" + val.path)
            rubySass([src], {
                    sourcemap: true
                })
                .pipe(
                    spriter({
                        //生成的spriter的位置
                        'spriteSheet': 'static/images/' + img,
                        //生成样式文件图片引用地址的路径
                        //如下将生产：backgound:url(../images/sprite20324232.png)
                        'pathToSpriteSheetFromCSS': '../images/' + img + "?" + Date.now(),
                        'spritesmithOptions': {
                            padding: 15
                        }, //图片之间的间隙
                        'unit': 'px', //默认PX 单位
                        'scale': 100 //默认 100px=1rem,最小比例是12px=1rem。由于谷歌pc浏览器最小是12px
                    }))
                .pipe(autoprefix({
                    browsers: ['last 30 versions', 'Android >= 4.0'],
                    cascade: false, //是否美化属性值 默认：true 像这样：
                    //-webkit-transform: rotate(45deg);
                    //        transform: rotate(45deg);
                    remove: true //是否去掉不必要的前缀 默认：true 
                }))

            .pipe(cleanCss({
                    compatibility: 'ie7'
                })) //压缩      
                .pipe(sourcemaps.write('./', { //路径相对 gulp.dest
                    includeContent: false,
                    sourceRoot: '../scss/' //gulp.dest sourcemaps
                }))

            .pipe(gulp.dest('static/css/'))
                .pipe(browserSync.stream({
                    match: '**/*.css'
                }));
        })

    })
    //压缩图片1
gulp.task('imagemin', function() {
    gulp.src('html/tuiguang/ying/static/imgSource/*.{png,jpg,gif,ico}')
        .pipe(imagemin({
            plugins: [
                imageminMozjpeg({
                    targa: true
                }),
                pngquant({
                    quality: '90-100'
                })
            ]
        }))
        .pipe(gulp.dest('html/tuiguang/ying/static/images/'))
});
//压缩图片2
gulp.task('imagemin2', function() {
    gulp.src('tuiguang/**/*.*')
        .pipe(imagemin({
            plugins: [
                imageminMozjpeg({
                    targa: true
                }),
                pngquant({
                    quality: '65-80',
                    speed: 8
                })
            ]
        }))
        .pipe(gulp.dest('images3/'))
});