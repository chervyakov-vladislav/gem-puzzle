global.$ = {
	gulp : require('gulp'),
	sass : require('gulp-sass')(require('sass')),
	delete : require('del'),
	tasks : require('./config/path.json').tasks,
	bSync: require('browser-sync').create(),
	dev: process.env.NODE_ENV === "development" ? true : false,
  glp: require('gulp-load-plugins')({
    rename : {
      'gulp-replace-task': 'replacetask'
    }
    
  })
}
//const sass = require('gulp-sass')(require('sass'));
//const config = require('./config/gulp.config');

for (const task in $.tasks) {
  require($.tasks[task])();
}

$.gulp.task('default',
	$.gulp.series(
		'clean',
		$.gulp.parallel(
			'copy:fonts',
			'copy:img',
			'copy:js',
			'copy:html'			
		),
		'scss',
		$.gulp.parallel(
			'watch',
			'server'
		)	
	)
)

$.gulp.task('build',
	$.gulp.series(
		'clean',
		$.gulp.parallel(
			'copy:fonts',
			'copy:img',
			'copy:js',
			'copy:html'			
		),
		'scss',
		$.gulp.parallel(
			'watch',
			'server'
		)	
	)
)