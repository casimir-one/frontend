const Generator = require('yeoman-generator');
const path = require('path');
const shell = require('shelljs');
const glob = require('glob');

module.exports = class GeneratorBase extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.rootPath = path.resolve(
      __dirname,
      ...new Array(4).fill('..')
    );

    this.lernaConf = this.fs.readJSON(path.join(this.rootPath, 'lerna.json'));

    this.author = {
      name: (shell.exec('git config --global user.name', { silent: true }).stdout || '').replace(/\n/g, ''),
      email: (shell.exec('git config --global user.email', { silent: true }).stdout || '').replace(/\n/g, '')
    };
  }

  _getDestinationPath(file) {
    const mapNames = {
      methodName: this.props.methodName,
      className: this.props.className,
      cssClassName: this.props.cssClassName
    };
    const replace = new RegExp(Object.keys(mapNames).join('|'), 'gi');
    const pathData = path.parse(file);

    pathData.dir = path.join(this.props.packagePath, pathData.dir);
    pathData.ext = pathData.ext === '.js' ? `.${this.props.scriptLang}` : pathData.ext;
    pathData.name = pathData.name.replace(replace, (matched) => mapNames[matched]);
    pathData.base = pathData.name + pathData.ext;

    return path.format(pathData);
  }

  _copyFiles(...patterns) {
    const templates = patterns.reduce((acc, pattern) => {
      const files = glob
        .sync(path.join(this.templatePath(), ...pattern))
        .map((file) => path.relative(this.templatePath(), file));
      return [...acc, ...files];
    }, []);

    for (const template of templates) {
      this.fs.copyTpl(
        this.templatePath(template),
        this.destinationPath(this._getDestinationPath(template)),
        { ...this.props }
      );
    }
  }
};
