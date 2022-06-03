import chokidar from 'chokidar';
import path from 'path';
import ora from 'ora';

import { getPackages, buildPackageLib, findPackageRoot } from './utils';

const spinner = ora();

const packages = getPackages();

const packagesSrcFiles = packages
  .map((pkg) => path.join(pkg.path, 'src', '**', '*'));

const watcher = chokidar.watch(packagesSrcFiles, {
  persistent: true,
  ignoreInitial: true
});

console.info('\n');
spinner.info('Watching enabled');

watcher.on('all', (event, file) => {
  const targetPackage = packages.find((pkg) => pkg.path === findPackageRoot(file));

  spinner.start(`Building: ${targetPackage.name}`);

  buildPackageLib(targetPackage).then(() => {
    spinner.succeed();
  });
});
