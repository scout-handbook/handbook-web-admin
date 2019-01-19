"use strict";
/* eslint-env node */

var yargs = require('yargs');
var fs = require("fs")
var nestedObjectAssign = require('nested-object-assign');

var gulp = require('gulp');
var eslint = require('gulp-eslint');
var uglify = require('uglify-js');
var composer = require('gulp-uglify/composer');
var stylelint = require('gulp-stylelint');
var merge = require('merge-stream');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var cleanCSS = require('gulp-clean-css');
var postcss = require('gulp-postcss');
var postcssCustomProperties = require('postcss-custom-properties');
var autoprefixer = require('autoprefixer');
var inject = require('gulp-inject-string');
var htmlmin = require('gulp-htmlmin');
var ts = require("gulp-typescript");

var minify = composer(uglify, console);

function getConfig() {
	var config = JSON.parse(fs.readFileSync("src/json/config.json", "utf8"));
	var overrideLocation = yargs.string('config').argv.config
	if(overrideLocation) {
		config = nestedObjectAssign(config, JSON.parse(fs.readFileSync(overrideLocation, "utf8")));
	}
	return config;
}

gulp.task('eslint', function() {
	return gulp.src(['**/*.js', '**/*.ts', '!node_modules/**', '!dist/**'])
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failAfterError());
});

gulp.task('stylelint', function() {
	return gulp.src(['**/*.css', '!node_modules/**', '!dist/**', '!src/css/fontello.css'])
		.pipe(stylelint({
			failAfterError: true,
			reporters: [
				{formatter: 'string', console: true}
			]
		}));
});

gulp.task('build:html', function() {
	return merge(
		gulp.src([
			'src/html/403.html',
			'src/html/404.html',
			'src/html/500.html'
		]),
		gulp.src([
			'src/html/index.html'
		])
		.pipe(inject.replace('<!--ADMIN-URI-->', getConfig()['admin-uri']))
	)
		.pipe(sourcemaps.init())
		.pipe(inject.replace('<!--SITE-NAME-->', getConfig()['site-name']))
		//.pipe(gulp.dest('dist/'));
		.pipe(htmlmin({collapseWhitespace: true}))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('dist/'));
});

gulp.task('build:js', function() {
	function bundle(name, sources, addConfig) {
		var ret = gulp.src(sources)
			.pipe(sourcemaps.init())
			.pipe(concat(name + '.min.js'));
		if(addConfig) {
			ret = ret.pipe(inject.prepend('"use strict";\nvar CONFIG = JSON.parse(\'' + JSON.stringify(getConfig()) + '\');\n'))
		}
		return ret
			//.pipe(gulp.dest('dist/'));
			.pipe(minify({ie8: true}))
			.pipe(sourcemaps.write('./'))
			.pipe(gulp.dest('dist/'));
	}
	function tsBundle(name, addConfig) {
		var tsProject = ts.createProject("tsconfig/" + name + ".json");
		var ret = tsProject.src()
			.pipe(sourcemaps.init())
			.pipe(tsProject())
			.pipe(concat(name + '.min.js'));
		if(addConfig) {
			ret = ret.pipe(inject.prepend('"use strict";\nvar CONFIG = JSON.parse(\'' + JSON.stringify(getConfig()) + '\');\n'))
		}
		return ret
			//.pipe(gulp.dest('dist/'));
			.pipe(minify({ie8: true}))
			.pipe(sourcemaps.write('./'))
			.pipe(gulp.dest('dist/'));
	}
	return merge(
		tsBundle('admin-pushed', true),
		tsBundle('admin-worker'),
		bundle('admin-worker-deps', [
			'src/js/HandbookMarkdown.js',
			'src/js/xssOptions.js'
		]),
		tsBundle('admin')
	);
});

gulp.task('build:css', function() {
	function bundle(name, sources) {
		return gulp.src(sources)
			.pipe(sourcemaps.init())
			.pipe(concat(name + '.min.css'))
			.pipe(postcss([postcssCustomProperties({importFrom: getConfig(), preserve: false}), autoprefixer()]))
			//.pipe(gulp.dest('dist/'));
			.pipe(cleanCSS({compatibility: 'ie8'}))
			.pipe(sourcemaps.write('./'))
			.pipe(gulp.dest('dist/'));
	}
	return merge(
		bundle('error', [
			'src/css/error.css'
		]),
		bundle('admin-pushed', [
			'src/css/button.css',
			'src/css/dialog.css',
			'src/css/fontello.css',
			'src/css/lesson.css',
			'src/css/main.css',
			'src/css/mainPage.css',
			'src/css/mainView.css',
			'src/css/sidePanel.css'
		]),
		bundle('admin', [
			'src/css/competenceSubview.css',
			'src/css/editor.css',
			'src/css/fieldSubview.css',
			'src/css/form.css',
			'src/css/groupSubview.css',
			'src/css/imageSubview.css',
			'src/css/lessonSubview.css',
			'src/css/pagination.css',
			'src/css/userSubview.css'
		])
	);
});

gulp.task('build:php', function() {
	return gulp.src([
		'src/php/lesson.php'
	])
		.pipe(gulp.dest('dist/'));
});

gulp.task('build:txt', function() {
	return gulp.src([
		'src/txt/htaccess.txt'
	])
		.pipe(gulp.dest('dist/'));
});

gulp.task('build:font', function() {
	return gulp.src([
		'src/font/fontello.eot',
		'src/font/fontello.svg',
		'src/font/fontello.ttf',
		'src/font/fontello.woff',
		'src/font/fontello.woff2'
	])
		.pipe(gulp.dest('dist/font/'));
});

gulp.task('build:png', function() {
	return gulp.src([
		'src/png/avatar.png'
	])
		.pipe(gulp.dest('dist/'));
});

gulp.task('build:deps', function() {
	return gulp.src([
		'node_modules/easymde/dist/easymde.min.css',
		'node_modules/easymde/dist/easymde.min.js',
		'node_modules/showdown/dist/showdown.min.js',
		'node_modules/showdown/dist/showdown.min.js.map',
		'node_modules/xss/dist/xss.min.js'
	])
		.pipe(gulp.dest('dist/'));
});

gulp.task('build:icon', function() {
	return merge(
		gulp.src([
			'src/icon/apple-touch-icon.png',
			'src/icon/favicon-16x16.png',
			'src/icon/favicon-32x32.png',
			'src/icon/favicon.ico',
			'src/icon/mstile-150x150.png',
			'src/icon/safari-pinned-tab.svg',
		]),
		gulp.src([
			'src/icon/browserconfig.xml',
		])
			.pipe(inject.replace('<!--ACCENT-COLOR-->', getConfig()['custom-properties']['--accent-color']))
	)
		.pipe(gulp.dest('dist/'));
});

gulp.task('lint', gulp.series('eslint', 'stylelint'));

gulp.task('build', gulp.parallel('build:html', 'build:css', 'build:js', 'build:php', 'build:txt', 'build:font', 'build:png', 'build:deps', 'build:icon'));
