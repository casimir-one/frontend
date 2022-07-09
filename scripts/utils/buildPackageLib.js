import {
  cleanLib,
  processTsConfig,
  processBabelConfig,
  processVueFiles,
  processOtherFiles
} from '../processing';
import { postProcessingClean } from '../processing/postProcessingClean';

/**
 *
 * @param pkg
 * @return {Promise<string>}
 */
export const buildPackageLib = async (pkg) => {
  const { name: pkgName, path: pkgPath } = pkg;

  await cleanLib(pkgPath);

  await Promise.all([
    processVueFiles(pkgPath),
    processBabelConfig(pkgPath),
    processTsConfig(pkgPath),
    processOtherFiles(pkgPath)
  ]);

  await postProcessingClean(pkgPath);

  return pkgName;
};
