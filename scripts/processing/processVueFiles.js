/* eslint-disable */
import path from 'path';
import glob from 'glob';
import fs from 'fs-extra';
import { parseComponent } from 'vue-template-compiler';
import { transformSync } from '@babel/core';
/* eslint-enable */

import { babelConfPath, changePathToLib } from '../utils';

/**
 * @param {string} pkgPath
 * @return {Promise<void>}
 */
export const processVueFiles = async (pkgPath) => {
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
        const attrsString = Object.keys(style.attrs)
          .reduce((acc, attr) => `${acc} ${attr}="${style.attrs[attr]}"`, '');

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
