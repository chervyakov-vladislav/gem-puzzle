module.exports = () => {
	$.gulp.task('server', () => {
    $.bSync.init({
      server: './dist',
      port: 8080
    })
  })
}