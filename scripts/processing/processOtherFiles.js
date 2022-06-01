/* eslint-disable */
import path from 'path';
import glob from 'glob';
import fs from 'fs-extra';
/* eslint-enable */

import { changePathToLib, scriptExtensions } from '../utils';

/**
 * @param {string} pkgPath
 * @return {Promise<void>}
 */
export const processOtherFiles = async (pkgPath) => {
  const pattern = path.join(pkgPath, 'src', '**', '*.*');
  const files = glob.sync(
    pattern,
    {
      ignore: [`**/*.{${['vue', ...scriptExtensions].join(',')}}`]
    }
  );

  const operations = [];

  for (const file of files) {
    operations.push(() => fs.copy(file, changePathToLib(pkgPath, file)));
  }

  try {
    await Promise.all(operations.map((fn) => fn()));
  } catch (err) {
    console.info(err);
  }
};
