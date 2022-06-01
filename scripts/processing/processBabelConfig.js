/* eslint-disable */
import path from 'path';
import fs from 'fs-extra';
/* eslint-enable */

import { babelConfPath, scriptExtensions, asyncExec } from '../utils';

/**
 * @param {string} pkgPath
 * @return {Promise<void>}
 */
export const processBabelConfig = async (pkgPath) => {
  const babelExt = scriptExtensions.map((ext) => `.${ext}`).join(',');
  const localConfigPath = path.join(pkgPath, 'babel.config.js');

  const babelConfig = fs.existsSync(localConfigPath) ? localConfigPath : babelConfPath;

  const babelCommandStack = [
    `--config-file ${babelConfig}`,
    `${pkgPath}/src`,
    `--out-dir ${pkgPath}/lib`,
    `--extensions "${babelExt}"`
  ].join(' ');

  try {
    await asyncExec(`cross-env NODE_ENV=lib babel ${babelCommandStack}`, { silent: true });
  } catch (err) {
    console.info(err);
  }
};
