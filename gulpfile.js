"use strict";
/* eslint-env node */

var gulp = require('gulp');
var shell = require('gulp-shell');
var eslint = require('gulp-eslint');
var uglify = require('uglify-js');
var composer = require('gulp-uglify/composer');
var stylelint = require('gulp-stylelint');
var merge = require('merge-stream');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var cleanCSS = require('gulp-clean-css');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var inject = require('gulp-inject-string');
var htmlmin = require('gulp-htmlmin');

var pkg = require('./package.json');

var minify = composer(uglify, console);

gulp.task('eslint', function() {
	return gulp.src(['**/*.js', '!node_modules/**', '!API/**', '!dist/**'])
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failAfterError());
});

gulp.task('stylelint', function() {
	return gulp.src(['**/*.css', '!node_modules/**', '!API/**', '!dist/**', '!src/shared/fontello?.css'])
		.pipe(stylelint({
			failAfterError: true,
			reporters: [
				{formatter: 'string', console: true}
			]
		}));
});

gulp.task('npm-check-updates', shell.task(['npm outdated'], {ignoreErrors: true}));

gulp.task('build:html', function() {
	return gulp.src('src/html/*')
		.pipe(sourcemaps.init())
		//.pipe(gulp.dest('dist/'));
		.pipe(htmlmin({collapseWhitespace: true}))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('dist/'));
});

gulp.task('build:js', function() {
	function bundle(name, sources) {
		return gulp.src(sources)
			.pipe(sourcemaps.init())
			.pipe(concat(name + '.min.js'))
			.pipe(inject.replace('\\"\\"\\/\\*INJECTED\\-VERSION\\*\\/', '"' + pkg.version + '"'))
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
			'src/js/config.js',
			'src/js/history.js',
			'src/js/main.js',
			'src/js/metadata.js'
		]),
		bundle('admin-worker', [
			'src/js/lessonEditor/previewWorker.js',
		]),
		bundle('admin-worker-deps', [
			'src/js/OdyMarkdown.js',
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
			.pipe(postcss([autoprefixer()]))
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
	return gulp.src('src/php/*')
		.pipe(gulp.dest('dist/'));
});

gulp.task('build:txt', function() {
	return gulp.src('src/txt/*')
		.pipe(gulp.dest('dist/'));
});

gulp.task('build:font', function() {
	return gulp.src('src/font/*')
		.pipe(gulp.dest('dist/'));
});

gulp.task('build:png', function() {
	return gulp.src('src/png/*')
		.pipe(gulp.dest('dist/'));
});

gulp.task('build:deps', function() {
	return gulp.src(['node_modules/simplemde/dist/simplemde.min.css', 'node_modules/simplemde/dist/simplemde.min.js', 'node_modules/showdown/dist/showdown.min.js', 'node_modules/xss/dist/xss.min.js'])
		.pipe(gulp.dest('dist/'));
});

gulp.task('build:icon', function() {
	return gulp.src('src/icon/*')
		.pipe(gulp.dest('dist/'));
});

gulp.task('lint', gulp.series('eslint', 'stylelint'));

gulp.task('build', gulp.parallel('build:html', 'build:css', 'build:js', 'build:php', 'build:txt', 'build:font', 'build:png', 'build:deps', 'build:icon'));
