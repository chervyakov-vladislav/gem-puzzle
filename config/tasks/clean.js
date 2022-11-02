//не работает экспорт конфига, написал тут пример данных, которые должны передаваться (SRC_DIST)
module.exports = () => {
	const {SRC_DIST} = require('../gulp.config');
  $.gulp.task('clean', () => {
    return $.delete(`./${SRC_DIST}`);
  })

}