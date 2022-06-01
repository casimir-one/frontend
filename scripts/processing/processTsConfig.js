/* eslint-disable */
import path from 'path';
import fs from 'fs-extra';
/* eslint-enable */

import { asyncExec } from '../utils';

/**
 * @param {string} pkgPath
 * @return {Promise<void>}
 */
export const processTsConfig = async (pkgPath) => {
  const tsconfig = path.join(pkgPath, 'tsconfig.build.json');

  if (fs.existsSync(tsconfig)) {
    const tscCommandStack = [
      `-p ${pkgPath}/tsconfig.build.json`
    ].join(' ');

    try {
      await asyncExec(`tsc ${tscCommandStack}`, { silent: false });
    } catch (err) {
      console.info(err);
    }
  }

  return Promise.resolve();
};
