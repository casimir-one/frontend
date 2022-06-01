import {
  cleanLib,
  processTsConfig,
  processBabelConfig,
  processVueFiles,
  processOtherFiles
} from '../processing';

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

  return pkgName;
};
