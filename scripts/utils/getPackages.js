/* eslint-disable */
import glob from 'glob';
import path from 'path';
import fs from 'fs-extra';
/* eslint-enable */

import { rootPath } from './variables';

const legacyExcludes = ['lib-crypto', 'RpcClient'];
const lernaConf = fs.readJsonSync(path.join(rootPath, 'lerna.json'));

/**
 * @return {Array} list of packages
 */
const getPackages = (forBuild = true) => lernaConf.packages
  .filter((pattern) => !pattern.includes('generators'))
  .filter((pattern) => !pattern.includes('portals'))
  .reduce((acc, pattern) => [...acc, ...glob.sync(pattern, { absolute: true })], [])

  .filter((p) => {
    const pArr = path.parse(p);
    if (forBuild) {
      return fs.existsSync(path.join(p, 'src')) && !legacyExcludes.includes(pArr.name);
    }
    return true;
  })

  .map((pkgPath) => {
    const { name, dependencies } = fs.readJsonSync(`${pkgPath}/package.json`);

    let platformDependencies = [];

    if (dependencies) {
      platformDependencies = Object.keys(dependencies)
        .filter((key) => key.includes('@deip') || key.includes('@casimir'));
    }

    return {
      name,
      path: pkgPath,
      deps: platformDependencies
    };
  });

export {
  getPackages
};
