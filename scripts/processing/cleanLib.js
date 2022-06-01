import { asyncExec } from '../utils';

/**
 * @param {string} pkgPath
 * @return {Promise<void>}
 */
export const cleanLib = async (pkgPath) => {
  await asyncExec(`shx rm -rf ${pkgPath}/lib`);
};
