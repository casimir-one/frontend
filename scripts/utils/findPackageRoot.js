/* eslint-disable */
import path from 'path';
import fs from 'fs-extra';
/* eslint-enable */

/**
 * @param {string} file
 * @return {string} package root path
 */
export const findPackageRoot = (file) => {
  const { dir } = path.parse(file);

  if (fs.existsSync(path.join(dir, 'package.json'))) {
    return dir;
  }

  return findPackageRoot(dir);
};
