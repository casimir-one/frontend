/* eslint-disable */
import ora from 'ora';
/* eslint-enable */

import { getPackages, BuildStack, buildPackageLib } from './utils';

const spinner = ora();
const packages = getPackages();

// ///////////////

(async () => {
  spinner.start('Building ...');

  const stack = new BuildStack(buildPackageLib);

  for (const pkg of packages) {
    stack.addPackage(pkg);
  }

  await stack.compile();

  spinner.succeed();
})();
