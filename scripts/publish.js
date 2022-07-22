const inquirer = require('inquirer');
const ora = require('ora');
const execa = require('execa');
const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');

// eslint-disable-next-line import/extensions
const { argv } = require('yargs/yargs')(process.argv.slice(2));

const {
  bootstrap = true,
  clean = true
} = argv;

const rootDir = path.resolve(__dirname, '..');

const spinner = ora();
const prompt = inquirer.createPromptModule();

const { command: { version: { allowBranch } } } = fs.readJsonSync(path.join(rootDir, 'lerna.json'));

/**
 * @return {string} Current branch name
 */
const getCurrentBranch = async () => {
  const { stdout } = await execa.command('git rev-parse --abbrev-ref HEAD');
  return stdout;
};

/**
 * @param error
 * @param withExit
 */
const errorHandler = (error, withExit = true) => {
  spinner.fail(chalk.red(error.toString()));

  if (withExit) {
    process.exit();
  }
};

/**
 * Check current branch state
 * @param currentBranch
 * @return {Promise<boolean>}
 */
const checkBranchUpToDate = async (currentBranch) => {
  await execa.command('git remote update');

  const { stdout } = await execa.command('git status -uno');

  const aheadMsg = {
    phrase: 'Your branch is ahead',
    recommend: 'Use "git push" to publish your local commits'
  };
  const behindMsg = {
    phrase: 'Your branch is behind',
    recommend: 'Use "git pull" to update your local branch'
  };
  const dirtyMsg = {
    phrase: 'Changes not staged',
    recommend: 'Use "git add [file]..." to update what will be committed'
  };

  const remoteBranch = `origin/${currentBranch}`;

  const isAhead = stdout.includes(aheadMsg.phrase);
  const isBehind = stdout.includes(behindMsg.phrase);
  const isDirty = stdout.includes(dirtyMsg.phrase);

  if (isAhead) {
    throw new Error(`${aheadMsg.phrase} of '${remoteBranch}'. ${aheadMsg.recommend}`);
  }
  if (isBehind) {
    throw new Error(`${behindMsg.phrase} of '${remoteBranch}'. ${behindMsg.recommend}`);
  }
  if (isDirty) {
    throw new Error(`${dirtyMsg.phrase} for commit. ${dirtyMsg.recommend}`);
  }

  return true;
};

/**
 * Make re:bootstrap of all packages
 * @return {Promise<void>}
 */
const prepareForPublish = async () => {
  if (clean) {
    await execa.command('npx lerna clean --yes', { stdio: 'inherit', shell: true });
  }
  if (bootstrap) {
    await execa.command('npx lerna bootstrap --no-ci -- --legacy-peer-deps',
      { stdio: 'inherit', shell: true });
  }
};

/**
 * Increase repo version, commit and push to git, publish packages to registry
 * @param publishBranch
 * @return {Promise<void>}
 */
const makePublish = async (publishBranch) => {
  await execa.command(
    'npx lerna version --no-push --exact',
    { stdio: 'inherit', shell: true }
  );

  try {
    await execa.command(`git push --tags origin ${publishBranch}`);
  } catch ({ message }) {
    const accessError = message.includes('protected branch hook declined');

    if (accessError) {
      throw new Error('You do not have the required rights for publishing.');
    }

    throw new Error(message);
  }

  await execa.command(
    'npx lerna publish from-package',
    { stdio: 'inherit', shell: true }
  );
};

/**
 * Revert publish changes
 * @return {Promise<void>}
 */
const revertPublish = async () => {
  const { version } = fs.readJsonSync(path.join(rootDir, 'lerna.json'));
  await execa.command('git reset --hard HEAD~1');
  await execa.command(`git tag -d v${version}`);
};

prompt([{
  type: 'list',
  name: 'startPublish',
  prefix: '',
  message: `
${chalk.cyan.bold('ATTENTION!')}
You are going to publish packages to the NPM registry.
Make sure everything is done correctly.

  `,
  default: [1],
  choices: [
    {
      value: 1,
      name: 'Yes. I understand.'
    },
    {
      value: 0,
      name: 'Cancel'
    }
  ]
}])
  .then(async (answer) => {
    if (!answer.startPublish) {
      process.exit();
    }

    const publishBranch = await getCurrentBranch();

    if (!allowBranch.includes(publishBranch)) {
      // eslint-disable-next-line max-len
      errorHandler(`Wrong Branch ${publishBranch}. Publish can be started only from ${allowBranch.join(' ,')}.`);
    }

    spinner.start('Checking branch state');
    try {
      await checkBranchUpToDate(publishBranch);
    } catch (err) {
      errorHandler(err);
    }
    spinner.stop();

    spinner.info('Preparing for publication...');
    await prepareForPublish();
    spinner.succeed('Complete');

    try {
      await makePublish(publishBranch);

      spinner.succeed(chalk.green('Published'));
    } catch (err) {
      errorHandler(err, false);

      if (err.toString().includes('publishing')) {
        spinner.start('Reverting...');
        await revertPublish();
        spinner.succeed('Reverted');
      }
    }

    process.exit();
  });
