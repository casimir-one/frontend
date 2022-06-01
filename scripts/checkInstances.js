/* eslint-disable */
import glob from 'glob';
import path from 'path';
import fs from 'fs-extra';
/* eslint-enable */

import { getPackages } from './utils';

const pkg = getPackages(false);

const result = pkg.reduce((acc, p) => {
  const { name } = fs.readJsonSync(path.join(p, 'package.json'));
  const instances = glob.sync(path.join(p, 'node_modules', '+(vue|vuetify|vuex)'))
    .map((inst) => path.parse(inst).base);
  const res = {
    [name]: instances
  };

  return { ...acc, ...(instances.length ? res : {}) };
}, {});

console.info(result);
