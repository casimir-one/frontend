import path from 'path';

/**
 * @param {string} pkgPath
 * @param {string} filePath
 * @return {string} File path related to 'lib' directory
 */
export const changePathToLib = (pkgPath, filePath) => {
  const pathArr = path.relative(pkgPath, filePath).split(path.sep);
  pathArr[0] = 'lib';
  return path.join(pkgPath, ...pathArr);
};
