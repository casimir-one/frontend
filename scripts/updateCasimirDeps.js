const inquirer = require('inquirer');
const execa = require('execa');

const prompt = inquirer.createPromptModule();

prompt([{
  type: 'list',
  name: 'update',
  message: 'This will update all @casimir dependencies in packages',
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
    if (!answer.update) {
      process.exit();
    }

    const commandStack = [
      'npx lerna exec',
      '--',
      '"npx ncu \'/^@(deip|casimir)\\/.*$/\' -u"'
    ];

    await execa.command(commandStack.join(' '), { stdio: 'inherit', shell: true });
    process.exit();
  });
