module.exports = () => {

  $.gulp.task('copy:js', () => {
    return $.gulp.src('./src/**/*.js')
			.pipe($.glp.if($.dev, $.glp.sourcemaps.init()))
			.pipe($.glp.concat('index.js', {newLine: ";"}))
			.pipe($.glp.babel({
					presets: ['@babel/env']
				})
			)
			.pipe($.glp.if(!$.dev, $.glp.uglify()))
			.pipe($.glp.if(!$.dev, $.glp.rename({suffix: ''})))
			.pipe($.glp.if($.dev, $.glp.sourcemaps.write()))
      .pipe($.gulp.dest('dist/js'));
  })

}


// если нужно будет переименовать
// .pipe($.glp.if(!$.dev, $.glp.rename({suffix: '.min'})))