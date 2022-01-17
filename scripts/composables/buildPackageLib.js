/* eslint-disable */
const vueCompiler = require('vue-template-compiler');
const fs = require('fs-extra');
const babel = require('@babel/core');
const shell = require('shelljs');
const path = require('path');
const glob = require('glob');
const ora = require('ora');
const chalk = require('chalk');
/* eslint-enable */

const { getAttrsString, changePathToLib } = require('./utils');
const { babelConfPath } = require('./paths');

const spinner = ora();
const scriptExtensions = ['js', 'ts', 'tsx'];

/**
 * @param {string} pkgPath
 */
const processVue = (pkgPath) => {
  const pattern = path.join(pkgPath, 'src', '**', '*.vue');
  const files = glob.sync(pattern);

  for (const file of files) {
    const { template, script, styles } = vueCompiler.parseComponent(fs.readFileSync(file, 'utf8'));

    const processedTemplate = `<template>\n${template.content.trim()}\n</template>`;

    const compiledScript = babel.transformSync(
      script.content.trim(),
      {
        babelrc: true,
        filename: babelConfPath
      }
    );
    const processedScript = `<script>\n${compiledScript.code.trim()}\n</script>`;

    const processedStyles = styles
      .map((style) => {
        const attrsString = getAttrsString(style.attrs);
        return `<style${attrsString ? `${attrsString}` : ''}>\n${style.content.trim()}\n</style>`;
      });

    const processedResult = [
      processedTemplate,
      processedScript,
      ...processedStyles
    ].join('\n\n');

    try {
      fs.outputFileSync(
        changePathToLib(pkgPath, file),
        processedResult
      );
    } catch (err) {
      console.error(err);
    }
  }
};

/**
 * @param {string} pkgPath
 */
const processScripts = (pkgPath) => {
  const babelExt = scriptExtensions.map((ext) => `.${ext}`).join(',');
  shell.exec(
    `npx babel --config-file ${babelConfPath} ${pkgPath}/src --out-dir ${pkgPath}/lib --extensions "${babelExt}"`,
    { silent: true }
  );
};

/**
 * @param {string} pkgPath
 */
const processOtherFiles = (pkgPath) => {
  const pattern = path.join(pkgPath, 'src', '**', '*.*');
  const files = glob.sync(pattern, { ignore: [`**/*.{${['vue', ...scriptExtensions].join(',')}`] });

  for (const file of files) {
    try {
      fs.copySync(file, changePathToLib(pkgPath, file));
    } catch (err) {
      console.info(err);
    }
  }
};

/**
 * @param {string} pkgPath
 */
const buildPackageLib = (pkgPath) => {
  spinner.start(`Building: ${pkgPath}`);
  processVue(pkgPath);
  processOtherFiles(pkgPath);
  processScripts(pkgPath);
  spinner.succeed(`Complete: ${pkgPath}`);
};

module.exports = {
  buildPackageLib
};
