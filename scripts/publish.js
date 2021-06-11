/* eslint-disable */
const inquirer = require('inquirer');
const ora = require('ora');
const execa = require('execa');
const { crc32 } = require('crc');
const chalk = require('chalk');
/* eslint-enable */

const prompt = inquirer.createPromptModule();

const getCurrentBranch = async () => (await execa.command('git rev-parse --abbrev-ref HEAD')).stdout;

const checkBranchCleanness = async (currentBranch) => {
  await execa.command('git remote update');

  const { stdout } = await execa.command('git status -uno');

  // const isUpToDate = stdout.includes('Your branch is up to date');
  const isAhead = stdout.includes('Your branch is ahead');
  const isBehind = stdout.includes('Your branch is behind');
  const isDirty = stdout.includes('Changes not staged');

  const errors = [];

  if (isAhead) errors.push(`Your branch is ahead of 'origin/${currentBranch}'. Use "git push" to publish your local commits`);
  if (isBehind) errors.push(`Your branch is behind of 'origin/${currentBranch}'. Use "git pull" to update your local branch`);
  if (isDirty) errors.push('Changes not staged for commit. Use "git add [file]..." to update what will be committed');

  if (errors.length) {
    return {
      clean: false,
      errors
    };
  }

  return {
    clean: true,
    errors
  };
};

prompt([{
  type: 'list',
  name: 'startPublish',
  message: `

${chalk.cyan.bold('ATTENTION!')}
You are going to publish modules to the NPM repository.
Make sure everything is done correctly.
Otherwise, it will take a lot of work to roll back.

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

    const spinner = ora();
    const allowBranch = ['master', 'develop'];
    const currentBranch = await getCurrentBranch();

    if (!allowBranch.includes(currentBranch)) {
      console.info(`Wrong Brunch ${currentBranch}. Publish can be started only from ${allowBranch.join(' ,')}.`);
      process.exit();
    }

    const today = new Date();
    const crc = crc32(today.toString()).toString(16);
    const publishBranch = `publish/${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}-${crc}`;

    spinner.start('Checking brunch cleanness');
    const checkResult = await checkBranchCleanness();
    spinner.stop();

    if (!checkResult.clean) {
      for (const error of checkResult.errors) {
        console.info(`${chalk.red.bold('✘')} ${error}`);
      }
      process.exit();
    }

    console.info(`${chalk.green.bold('✔')} Your branch is up to date. Continue...`);

    spinner.start('Preparing for publication');
    await execa.command(`git checkout -b ${publishBranch}`);
    await execa.command('npx lerna clean --yes');
    await execa.command('npx lerna bootstrap');
    spinner.stop();

    await execa.command('npx lerna version --no-push --exact', { stdio: 'inherit', shell: true });
    await execa.command('npx lerna publish from-git', { stdio: 'inherit', shell: true });
    await execa.command(`git push --tags origin ${publishBranch}`);

    console.info('Clear publish brunch...');
    await execa.command('git checkout develop');
    await execa.command(`git branch -D ${publishBranch}`);

    console.info();
    console.info(`${chalk.cyan.bold('NOTE')}: Do not forget to create a merge request '${publishBranch} -> develop'`);
    console.info();
    console.info(`${chalk.green.bold('Finished')}`);

    process.exit();
  });
