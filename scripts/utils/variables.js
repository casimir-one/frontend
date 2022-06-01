import path from 'path';

export const rootPath = path.resolve();
export const babelConfPath = path.join(path.resolve(), 'babel.config.js');
export const tsConfPath = path.join(path.resolve(), 'tsconfig.json');
export const scriptExtensions = ['js', 'jsx', 'ts', 'tsx'];
