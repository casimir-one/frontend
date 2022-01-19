/* eslint-disable */
import vueCompiler from 'vue-template-compiler';
import fs from 'fs-extra';
import babel from '@babel/core';
import shell from 'shelljs';
import path from 'path';
import glob from 'glob';
import ora from 'ora';
import chalk from 'chalk';
/* eslint-enable */

import { getAttrsString, changePathToLib } from './utils';
import { babelConfPath } from './paths';

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
        filename: babelConfPath,
        envName: 'lib'
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
    `cross-env NODE_ENV=lib babel --config-file ${babelConfPath} ${pkgPath}/src --out-dir ${pkgPath}/lib --extensions "${babelExt}"`,
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
export const buildPackageLib = (pkgPath) => {
  spinner.start(`Building: ${pkgPath}`);
  processVue(pkgPath);
  processOtherFiles(pkgPath);
  processScripts(pkgPath);
  spinner.succeed(`Complete: ${pkgPath}`);
};
