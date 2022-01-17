/* eslint-disable */
const chokidar = require('chokidar');
const path = require('path');
const fs = require('fs-extra');
/* eslint-enable */

const { getPackages } = require('./composables/getPackages');
const { buildPackageLib } = require('./composables/buildPackageLib');

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
  buildPackageLib(findPackageRoot(file));
});
