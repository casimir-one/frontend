import path from 'path';
import glob from 'glob';
import fs from 'fs-extra';
import { asyncExec } from '../utils';

export const postProcessingClean = async (pkgPath) => {
  const pattern = path.join(pkgPath, 'lib', '**', '*.js');
  const files = glob.sync(pattern);
  const operations = [];

  for (const file of files) {
    const fileContent = fs.readFileSync(file, 'utf8')
      .replace(/export {}(;?)/gm, '')
      .trim();

    if (!fileContent) {
      operations.push(() => asyncExec(`npx shx rm ${file}`));
    } else {
      fs.writeFileSync(file, fileContent);
    }
  }

  try {
    await Promise.all(operations.map((fn) => fn()));
  } catch (err) {
    console.info(err);
  }
};
