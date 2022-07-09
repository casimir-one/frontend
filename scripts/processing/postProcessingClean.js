import path from 'path';
import glob from 'glob';
import fs from 'fs-extra';
import { asyncExec } from '../utils';

export const postProcessingClean = async (pkgPath) => {
  const pattern = path.join(pkgPath, 'lib', '**', '*.js');
  const files = glob.sync(pattern);
  const operations = [];

  for (const file of files) {
    const fileContent = fs.readFileSync(file, 'utf8').trim();
    if (/export {}(;?)/.test(fileContent)) {
      operations.push(() => asyncExec(`shx rm ${file}`));
    }
  }

  try {
    await Promise.all(operations.map((fn) => fn()));
  } catch (err) {
    console.info(err);
  }
};
