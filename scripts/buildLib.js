// eslint-disable-next-line import/no-extraneous-dependencies
import ora from 'ora';

import { getPackages } from './composables/getPackages';
import { buildPackageLib } from './composables/buildPackageLib';

const spinner = ora();
const packages = getPackages();

const build = async () => {
  spinner.start(`Building ${packages.length} packages...`);
  const stack = [];
  for (const pkgPath of getPackages()) {
    stack.push(async () => {
      const res = await buildPackageLib(pkgPath);
      spinner.succeed(`Building complete: ${res}`);
      spinner.start('Building packages...');
    });
  }
  await Promise.all(stack.map((fn) => fn()));
  spinner.succeed('Done');
};

build();
