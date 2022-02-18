import path from 'path';
// eslint-disable-next-line import/no-extraneous-dependencies
import shell from 'shelljs';

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

/**
 * @param {Object} attrs
 * @return {string}
 */
export const getAttrsString = (attrs) => Object.keys(attrs)
  .reduce((acc, attr) => `${acc} ${attr}="${attrs[attr]}"`, '');

/**
 * @param {string} command
 * @param {Object} options
 * @return {Promise<*>}
 */
export function asyncExec(
  command,
  options = {}
) {
  return new Promise((resolve, reject) => {
    shell.exec(
      command,
      { ...options, async: false },
      (code, stdout, stderr) => {
        if (code !== 0) {
          const e = new Error();
          e.message = stderr;
          e.name = String(code);
          reject(e);
        } else {
          resolve(stdout);
        }
      }
    );
  });
}
