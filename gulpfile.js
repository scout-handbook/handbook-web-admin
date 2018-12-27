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
	return gulp.src(['**/*.js', '!node_modules/**', '!dist/**'])
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
	return merge(
		bundle('admin-pushed', [
			'src/js/lessonEditor/refreshPreview.js',
			'src/js/tools/ActionQueue.js',
			'src/js/tools/refreshLogin.js',
			'src/js/tools/request.js',
			'src/js/views/main.js',
			'src/js/AfterLoadEvent.js',
			'src/js/history.js',
			'src/js/main.js',
			'src/js/metadata.js'
		], true),
		bundle('admin-worker', [
			'src/js/lessonEditor/previewWorker.js',
		]),
		bundle('admin-worker-deps', [
			'src/js/HandbookMarkdown.js',
			'src/js/xssOptions.js'
		]),
		bundle('admin', [
			'src/js/actions/addCompetence.js',
			'src/js/actions/addField.js',
			'src/js/actions/addGroup.js',
			'src/js/actions/addImage.js',
			'src/js/actions/changeCompetence.js',
			'src/js/actions/changeField.js',
			'src/js/actions/changeGroup.js',
			'src/js/actions/changeLessonCompetences.js',
			'src/js/actions/changeLessonField.js',
			'src/js/actions/changeLessonGroups.js',
			'src/js/actions/changeUserGroups.js',
			'src/js/actions/changeUserRole.js',
			'src/js/actions/deleteCompetence.js',
			'src/js/actions/deleteField.js',
			'src/js/actions/deleteGroup.js',
			'src/js/actions/deleteImage.js',
			'src/js/actions/deleteLesson.js',
			'src/js/actions/importGroup.js',
			'src/js/actions/restoreLesson.js',
			'src/js/lessonEditor/defaultContent.js',
			'src/js/lessonEditor/editor.js',
			'src/js/lessonEditor/history.js',
			'src/js/lessonEditor/imageSelector.js',
			'src/js/lessonEditor/settings.js',
			'src/js/tools/addOnClicks.js',
			'src/js/tools/parseBoolForm.js',
			'src/js/tools/parseVersion.js',
			'src/js/UI/button.js',
			'src/js/UI/dialog.js',
			'src/js/UI/pagination.js',
			'src/js/UI/sidePanel.js',
			'src/js/UI/spinner.js',
			'src/js/views/mainSubviews/competence.js',
			'src/js/views/mainSubviews/group.js',
			'src/js/views/mainSubviews/image.js',
			'src/js/views/mainSubviews/lesson.js',
			'src/js/views/mainSubviews/user.js',
			'src/js/views/addLesson.js',
			'src/js/views/editLesson.js',
			'src/js/views/restoreLesson.js',
			'src/js/getLessonById.js'
		])
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
