import { genSha256Hash, createInstanceGetter } from '@deip/toolbox';
import { proxydi } from '@deip/proxydi';
import { CreateDaoCmd } from '@deip/commands';
import { ChainService } from '@deip/chain-service';
import { JsonDataMsg } from '@deip/messages';
import { AuthHttp } from './AuthHttp';

/**
 * Auth transport
 */
export class AuthService {
  proxydi = proxydi;

  http = AuthHttp.getInstance();

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

    const {
      privKey,
      isAuthorizedCreatorRequired
    } = initiator;

    const chainService = await ChainService.getInstanceAsync(env);
    const chainNodeClient = chainService.getChainNodeClient();
    const chainTxBuilder = chainService.getChainTxBuilder();

    const finalizedTx = await this.createFinalizedTx(
      chainTxBuilder,
      userData,
      isAuthorizedCreatorRequired
    );

    const checkedFinalizedTx = isAuthorizedCreatorRequired
      ? finalizedTx
      : await finalizedTx.signAsync(privKey, chainNodeClient);

    const msg = new JsonDataMsg(checkedFinalizedTx.getPayload());
    return this.http.signUp(msg);
  }

  async createFinalizedTx(chainTxBuilder, userData, isAuthorizedCreatorRequired) {
    const {
      email,
      attributes = [],
      username,
      pubKey,
      roles
    } = userData;
    const env = this.proxydi.get('env');
    const { CORE_ASSET, FAUCET_ACCOUNT_USERNAME } = env;

    const txBuilder = await chainTxBuilder.begin();

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
      description: genSha256Hash(JSON.stringify(attributes)),
      attributes,
      email,
      roles
    });

    txBuilder.addCmd(createDaoCmd);

    return txBuilder.end();
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
  static getInstance = createInstanceGetter(AuthService)
}
