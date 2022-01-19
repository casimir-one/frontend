/* eslint-disable */
import glob from 'glob';
import path from 'path';
import fs from 'fs-extra';
/* eslint-enable */

const { rootPath } = require('./paths');

const legacyExcludes = ['lib-crypto', 'RpcClient'];
const lernaConf = fs.readJsonSync(path.join(rootPath, 'lerna.json'));

/**
 * @return {Array} list of packages
 */
const getPackages = () => lernaConf.packages
  .filter((pattern) => !pattern.includes('generators'))
  .reduce((acc, pattern) => [...acc, ...glob.sync(pattern, { absolute: true })], [])
  .filter((p) => {
    const pArr = path.parse(p);
    return fs.existsSync(path.join(p, 'src')) && !legacyExcludes.includes(pArr.name);
  });

export {
  getPackages
};
