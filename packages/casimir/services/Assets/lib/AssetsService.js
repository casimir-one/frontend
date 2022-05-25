import { createInstanceGetter } from '@deip/toolbox';
import { proxydi } from '@deip/proxydi';
import { ChainService } from '@deip/chain-service';
import { AssetsHttp } from './AssetsHttp';

/**
 * Assets data provider
 */
export class AssetsService {
  proxydi = proxydi;

  assetsHttp = AssetsHttp.getInstance();

  /**
   * Deposit history for certain account
   * @param {string} account
   * @param {string} status
   * @return {Promise<Object>}
   */
  getAccountDepositHistory(account, status) {
    return this.assetsHttp.getAccountDepositHistory(account, status);
  }

  /**
   * Get assets by type
   * @param {number} type
   * @return {Promise<Object>}
   */
  getAssetsByType(type) {
    return this.assetsHttp.getAssetsByType(type);
  }

  /**
   * Get assets by issuer
   * @param {string} issuer
   * @return {Promise<Object>}
   */
  getAssetsByIssuer(issuer) {
    return this.assetsHttp.getAssetsByIssuer(issuer);
  }

  /**
   * Get all assets
   * @param {number} limit
   * @return {Promise<Object>}
   */
  lookupAssets(limit) {
    return this.assetsHttp.lookupAssets(limit);
  }

  /**
   * Deposit asset tokens
   * @param {import('@casimir/platform-core').AssetDepositPayload} payload
   * @return {Promise<Object>}
   */
  deposit(payload) {
    const {
      initiator: { privKey, username },
      redirectUrl,
      amount,
      currency,
      account,
      timestamp
    } = payload;

    const depositData = {
      amount,
      currency,
      account,
      timestamp
    };

    const env = this.proxydi.get('env');
    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const seedAccount = chainService.generateChainSeedAccount({
          username,
          privateKey: privKey
        });
        const sigSource = JSON.stringify(depositData, Object.keys(depositData).sort());
        const sigHex = seedAccount.signString(sigSource);
        return this.assetsHttp.deposit(
          {
            ...depositData,
            sigSource,
            sigHex,
            redirectUrl
          }
        );
      });
  }

  /** @type {() => AssetsService} */
  static getInstance = createInstanceGetter(AssetsService);
}
