const inquirer = require('inquirer');
const ora = require('ora');
const execa = require('execa');
const { crc32 } = require('crc');
const chalk = require('chalk');

const prompt = inquirer.createPromptModule();

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

    const spinner = ora('Check remotes');
    const allowBranch = ['master', 'develop'];
    const currentBranch = (await execa.command('git rev-parse --abbrev-ref HEAD')).stdout;

    if (!allowBranch.includes(currentBranch)) {
      console.info('Wrong Brunch', currentBranch);
      process.exit();
    }

    const today = new Date();
    const crc = crc32(today.toString()).toString(16);
    const publishBranch = `publish/${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}-${crc}`;

    spinner.start();
    const originIsClean = !(await execa.command('git ls-remote --heads origin publish*')).stdout;
    spinner.stop();

    if (!originIsClean) {
      console.info(`${chalk.red.bold('✘')} Remotes have 'pablish*' brunches. Merge its in develop and delete`);
      process.exit();
    }

    console.info(`${chalk.green.bold('✔')} Origin is clean. Continue...`);

    await execa.command(`git checkout -b ${publishBranch}`);
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
