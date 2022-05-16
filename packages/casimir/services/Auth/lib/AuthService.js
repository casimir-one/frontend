import { genSha256Hash, makeSingletonInstance } from '@deip/toolbox';
import { proxydi } from '@deip/proxydi';
import { CreateDaoCmd } from '@deip/commands';
import { ChainService } from '@deip/chain-service';
import { JsonDataMsg } from '@deip/messages';
import { AuthHttp } from './AuthHttp';

/**
 * Auth transport
 */
export class AuthService {
  http = AuthHttp.getInstance();
  proxydi = proxydi;

  /**
   * @param {Object} data
   * @return {Promise<Object>}
   */
  async signIn(data) {
    return this.http.signIn(data);
  }

  /**
   * @param {Object} data
   * @return {Promise<Object>}
   */
  async adminSignIn(data) {
    return this.http.adminSignIn(data);
  }

  /**
   * Create new user
   * @param {Object} initiator
   * @param {Object} userData
   * @return {Promise<Object>}
   */
  async signUp(initiator, userData) {
    const env = this.proxydi.get('env');
    const { CORE_ASSET, FAUCET_ACCOUNT_USERNAME, RETURN_MSG } = env;
    const {
      privKey,
      isAuthorizedCreatorRequired
    } = initiator;

    const {
      email,
      attributes,
      username,
      pubKey,
      roles,
      confirmationCode
    } = userData;

    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const chainTxBuilder = chainService.getChainTxBuilder();
        const chainNodeClient = chainService.getChainNodeClient();
        const userAttributes = attributes || [];

        return chainTxBuilder.begin()
          .then((txBuilder) => {
            const createDaoCmd = new CreateDaoCmd({
              entityId: username,
              isTeamAccount: false,
              fee: { ...CORE_ASSET, amount: 0 },
              creator: isAuthorizedCreatorRequired ? FAUCET_ACCOUNT_USERNAME : username,
              authority: {
                owner: {
                  auths: [{ key: pubKey, weight: 1 }],
                  weight: 1
                }
              },
              description: genSha256Hash(JSON.stringify(userAttributes)),
              attributes: userAttributes,
              email,
              roles,
              confirmationCode
            });

            txBuilder.addCmd(createDaoCmd);
            return txBuilder.end();
          })
          .then((finalizedTx) => (isAuthorizedCreatorRequired
            ? Promise.resolve(finalizedTx)
            : finalizedTx.signAsync(privKey, chainNodeClient)))
          .then((finalizedTx) => {
            const msg = new JsonDataMsg(finalizedTx.getPayload());
            if (RETURN_MSG && RETURN_MSG === true) {
              return msg;
            }
            return this.http.signUp(msg);
          });
      });
  }

  /**
   * @param {string} username
   * @param {string} passwordOrPrivKey
   * @return {Promise<Object>}
   */
  async generateSeedAccount(username, passwordOrPrivKey) {
    const env = this.proxydi.get('env');
    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        // TODO: There is no way to define programmatically what user provides exactly -
        // Password or Private Key, we have to resolve it via UI control (e.g. switch/checkbox)
        const isValidPrivKey = chainService.isValidPrivKey(passwordOrPrivKey);
        return chainService.generateChainSeedAccount({
          username,
          password: isValidPrivKey ? null : passwordOrPrivKey,
          privateKey: isValidPrivKey ? passwordOrPrivKey : null
        });
      });
  }

  /** @type {() => AuthService} */
  static getInstance = makeSingletonInstance(() => new AuthService());
}
