module.exports = () => {

  $.gulp.task('copy:img', () => {
    return $.gulp.src('./src/images/**/*.*')
      .pipe($.gulp.dest('dist/images'));
  })

}