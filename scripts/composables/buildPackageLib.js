/* eslint-disable */
import { parseComponent } from 'vue-template-compiler';
import fs from 'fs-extra';
import { transformSync } from '@babel/core';
import path from 'path';
import glob from 'glob';
/* eslint-enable */

import { getAttrsString, changePathToLib, asyncExec } from './utils';
import { babelConfPath } from './paths';

const scriptExtensions = ['js', 'ts', 'tsx'];

/**
 * @param {string} pkgPath
 * @return {Promise<void>}
 */
const processVue = async (pkgPath) => {
  const pattern = path.join(pkgPath, 'src', '**', '*.vue');
  const files = glob.sync(pattern);

  const operations = [];

  for (const file of files) {
    const { template, script, styles } = parseComponent(fs.readFileSync(file, 'utf8'));

    const processedTemplate = `<template>\n${template.content.trim()}\n</template>`;

    const compiledScript = transformSync(
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

    operations.push(() => fs.outputFile(
      changePathToLib(pkgPath, file),
      processedResult
    ));
  }

  try {
    await Promise.all(operations.map((fn) => fn()));
  } catch (err) {
    console.error(err);
  }
};

/**
 * @param {string} pkgPath
 * @return {Promise<void>}
 */
const cleanLib = async (pkgPath) => {
  await asyncExec(`shx rm -rf ${pkgPath}/lib`);
};

/**
 * @param {string} pkgPath
 * @return {Promise<void>}
 */
const generateTsDefinitions = async (pkgPath) => {
  const tscCommandStack = [
    `-p ${pkgPath}/tsconfig.build.json`,
    '--emitDeclarationOnly',
    `--outFile ${pkgPath}/lib/types.d.ts`
  ].join(' ');

  await asyncExec(`tsc ${tscCommandStack}`, { silent: true });
};

/**
 * @param {string} pkgPath
 * @return {Promise<void>}
 */
const processScripts = async (pkgPath) => {
  const babelExt = scriptExtensions.map((ext) => `.${ext}`).join(',');

  const babelCommandStack = [
    `--config-file ${babelConfPath}`,
    `${pkgPath}/src`,
    `--out-dir ${pkgPath}/lib`,
    `--extensions "${babelExt}"`
  ].join(' ');

  await asyncExec(`cross-env NODE_ENV=lib babel ${babelCommandStack}`, { silent: true });
};

/**
 * @param {string} pkgPath
 * @return {Promise<void>}
 */
const processOtherFiles = async (pkgPath) => {
  const pattern = path.join(pkgPath, 'src', '**', '*.*');
  const files = glob.sync(pattern, { ignore: [`**/*.{${['vue', ...scriptExtensions].join(',')}}`] });

  const operations = [];

  for (const file of files) {
    operations.push(() => fs.copy(file, changePathToLib(pkgPath, file)));
  }

  try {
    await Promise.all(operations.map((fn) => fn()));
  } catch (err) {
    console.info(err);
  }
};

/**
 *
 * @param pkgPath
 * @return {Promise<string>}
 */
export const buildPackageLib = async (pkgPath) => {
  const { name } = await fs.readJson(`${pkgPath}/package.json`);

  await cleanLib(pkgPath);
  await Promise.all([
    processVue(pkgPath),
    processScripts(pkgPath),
    generateTsDefinitions(pkgPath),
    processOtherFiles(pkgPath)
  ]);

  return name;
};
