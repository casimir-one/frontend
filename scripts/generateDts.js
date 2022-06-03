import yargs from 'yargs';
import path from 'path';

import { asyncExec } from './utils';

const { argv } = yargs(process.argv.slice(2));

(async () => {
  const inPath = path.join(path.resolve(), argv._[0]);
  const dtsFileName = path.parse(inPath).base.replace('.js', '.d.ts');
  const outPath = path.join(path.resolve(), argv.out, dtsFileName);

  const flags = '--declaration --allowJs --emitDeclarationOnly';
  const command = `npx -p typescript tsc ${inPath} ${flags} --outFile ${outPath}`;

  await asyncExec(command);
})();
