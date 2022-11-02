module.exports = () => {
	$.gulp.task('scss', () => {
		return $.gulp.src('./src/styles/index.scss')
		.pipe($.glp.if($.dev, $.glp.sourcemaps.init()))
		.pipe($.glp.sassGlob())
		.pipe($.sass()).on('error', $.sass.logError)
		.pipe($.glp.autoprefixer())
		.pipe($.glp.if(!$.dev, $.glp.csso()))
		.pipe($.glp.if(!$.dev, $.glp.rename({suffix: ''})))
		.pipe($.glp.if($.dev, $.glp.sourcemaps.write()))
		.pipe($.gulp.dest('dist/css'))
		.pipe($.bSync.stream());
	})
}


// .pipe($.glp.if(!$.dev, $.glp.rename({suffix: '.min'})))
// если нужно будет переименовать
