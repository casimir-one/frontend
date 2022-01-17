const path = require('path');

/**
 * @param {string} pkgPath
 * @param {string} filePath
 * @return {string} File path related to 'lib' directory
 */
const changePathToLib = (pkgPath, filePath) => {
  const pathArr = path.relative(pkgPath, filePath).split(path.sep);
  pathArr[0] = 'lib';
  return path.join(pkgPath, ...pathArr);
};

/**
 * @param {Object} attrs
 * @return {string}
 */
const getAttrsString = (attrs) => Object.keys(attrs)
  .reduce((acc, attr) => `${acc} ${attr}="${attrs[attr]}"`, '');

module.exports = {
  changePathToLib,
  getAttrsString
};
