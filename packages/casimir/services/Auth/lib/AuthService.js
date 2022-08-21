import { genSha256Hash, makeSingletonInstance } from '@casimir/toolbox';
import { proxydi } from '@casimir/proxydi';
import { CreateDaoCmd, ImportDAOCmd } from '@casimir/commands';
import { ChainService } from '@casimir/chain-service';
import { JsonDataMsg } from '@casimir/messages';
import { AuthHttp } from './AuthHttp';

/**
 * Auth transport
 */
export class AuthService {
  http = AuthHttp.getInstance();
  proxydi = proxydi;

  static #getChainActions(chainService) {
    const chainTxBuilder = chainService.getChainTxBuilder();
    const chainNodeClient = chainService.getChainNodeClient();

    return {
      chainTxBuilder,
      chainNodeClient
    };
  }

  /**
   * Check if user exists by username or email
   * @param {string} usernameOrEmail
   * @return {Promise<Object>}
   */
  async isExist(usernameOrEmail) {
    return this.http.isExist(usernameOrEmail).then(({ data: { exists } }) => exists);
  }

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
   * @param {Object} data
   * @return {Promise<Object>}
   */
  async importDao(data) {
    const { daoId, publicKey } = data;

    const env = this.proxydi.get('env');
    const { RETURN_MSG } = env;

    const importDaoCmd = new ImportDAOCmd({
      entityId: daoId,
      authority: {
        owner: {
          auths: [{ key: publicKey, weight: 1 }],
          weight: 1
        }
      },
      attributes: [],
      roles: [],
      isTeamAccount: false,
      status: 2
    });

    const msg = new JsonDataMsg({ appCmds: [importDaoCmd] });

    if (RETURN_MSG && RETURN_MSG === true) {
      return msg;
    }

    return this.http.importDao(msg);
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

    const chainService = await ChainService.getInstanceAsync(env);
    const { chainTxBuilder, chainNodeClient } = AuthService.#getChainActions(chainService);
    const userAttributes = attributes || [];
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
      description: genSha256Hash(JSON.stringify(userAttributes)),
      attributes: userAttributes,
      email,
      roles,
      confirmationCode
    });

    txBuilder.addCmd(createDaoCmd);
    const finalizedTx = await txBuilder.end();
    const signedTx = isAuthorizedCreatorRequired ? finalizedTx
      : finalizedTx.signAsync(privKey, chainNodeClient);

    const msg = new JsonDataMsg(signedTx.getPayload());
    if (RETURN_MSG && RETURN_MSG === true) {
      return msg;
    }
    return this.http.signUp(msg);
  }

  /**
   * @param {string} username
   * @param {string} passwordOrPrivKey
   * @return {Promise<Object>}
   */
  async generateSeedAccount(username, passwordOrPrivKey) {
    const env = this.proxydi.get('env');
    const chainService = await ChainService.getInstanceAsync(env);
    const isValidPrivKey = chainService.isValidPrivKey(passwordOrPrivKey);
    return chainService.generateChainSeedAccount({
      username,
      password: isValidPrivKey ? null : passwordOrPrivKey,
      privateKey: isValidPrivKey ? passwordOrPrivKey : null
    });
  }

  /** @type {() => AuthService} */
  static getInstance = makeSingletonInstance(() => new AuthService());
}
