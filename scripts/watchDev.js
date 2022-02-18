/* eslint-disable */
import chokidar from 'chokidar';
import path from 'path';
import fs from 'fs-extra';
import ora from 'ora';
/* eslint-enable */

import { getPackages } from './composables/getPackages';
import { buildPackageLib } from './composables/buildPackageLib';

const spinner = ora();

/**
 * @param {string} file
 * @return {string} package root path
 */
const findPackageRoot = (file) => {
  const { dir } = path.parse(file);

  if (fs.existsSync(path.join(dir, 'package.json'))) {
    return dir;
  }

  return findPackageRoot(dir);
};

const packagesSrcFiles = getPackages()
  .map((pkg) => path.join(pkg, 'src', '**', '*'));

const watcher = chokidar.watch(packagesSrcFiles, {
  persistent: true,
  ignoreInitial: true
});

watcher.on('all', (event, file) => {
  buildPackageLib(findPackageRoot(file)).then((result) => {
    spinner.succeed(`Success: ${result}`);
  });
});
