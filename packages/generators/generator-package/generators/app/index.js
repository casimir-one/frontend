const chalk = require('chalk');
const yosay = require('yosay');
const path = require('path');
const glob = require('glob');
const { pascalCase, paramCase, camelCase } = require('change-case');
const shell = require('shelljs');
const GeneratorBase = require('../GeneratorBase');

const genPackageName = (str) => `@casimir/${paramCase(str)}`;

module.exports = class extends GeneratorBase {
  initializing() {
    this.packagesPaths = this.lernaConf.packages
      .filter((pattern) => !pattern.includes('generators'))
      .reduce((acc, pattern) => {
        const pat = path.parse(pattern).dir;
        return [...acc, ...glob.sync(pat)];
      }, []);
  }

  async prompting() {
    this.log(
      yosay(
        `Welcome to the grand ${chalk.cyan('@casimir/package')} generator!`
      )
    );

    const prompts = [
      {
        type: 'list',
        name: 'packagePath',
        message: 'Package path',
        choices: this.packagesPaths
      },
      {
        type: 'input',
        name: 'packageName',
        message: 'Package name',
        default: 'package',
        transformer(value) {
          return genPackageName(value);
        }
      },
      {
        type: 'input',
        name: 'packageDescription',
        message: 'Description'
      },
      {
        type: 'list',
        name: 'scriptLang',
        message: 'Which language do you prefer',
        choices: [
          { name: 'JavaScript', value: 'js' },
          { name: 'TypeScript', value: 'ts' }
        ]
      },
      {
        type: 'input',
        name: 'authorName',
        message: 'Your name',
        default: this.author.name
      },
      {
        type: 'input',
        name: 'authorEmail',
        message: 'Your email',
        default: this.author.email
      }
    ];

    const {
      packagePath,
      packageName,
      packageDescription,
      authorName,
      authorEmail,
      scriptLang
    } = await this.prompt(prompts);

    const author = [
      ...(authorName ? [authorName] : []),
      ...(authorEmail ? [`<${authorEmail}>`] : [])
    ].join(' ');

    this.props = {
      packagePath: path.join(packagePath, paramCase(packageName)),

      packageName: genPackageName(packageName),
      packageVersion: this.lernaConf.version,
      packageDescription: packageDescription || '> TODO: description',
      packageAuthor: author,

      methodName: camelCase(packageName),
      className: pascalCase(packageName),
      cssClassName: paramCase(packageName),

      scriptLang
    };
  }

  writing() {
    this._copyFiles(
      ['**', '*.*']
    );
  }

  async install() {
    await shell.exec('npx lerna bootstrap');
  }
};
