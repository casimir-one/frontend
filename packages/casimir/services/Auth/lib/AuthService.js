import { genSha256Hash, createInstanceGetter } from '@deip/toolbox';
import { proxydi } from '@deip/proxydi';
import { CreateDaoCmd } from '@deip/commands';
import { ChainService } from '@deip/chain-service';
import { JsonDataMsg } from '@deip/messages';
import { AuthHttp } from './AuthHttp';

export class AuthService {
  proxydi = proxydi;

  http = AuthHttp.getInstance();

  async signIn(model) {
    return this.http.signIn(model);
  }

  async adminSignIn(model) {
    return this.http.adminSignIn(model);
  }

  async signUp({ privKey, isAuthorizedCreatorRequired }, {
    email,
    attributes,
    username,
    pubKey,
    roles
  }) {
    const env = this.proxydi.get('env');
    const { CORE_ASSET, FAUCET_ACCOUNT_USERNAME } = env;

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
              roles
            });

            txBuilder.addCmd(createDaoCmd);
            return txBuilder.end();
          })
          .then((finalizedTx) => (isAuthorizedCreatorRequired
            ? Promise.resolve(finalizedTx)
            : finalizedTx.signAsync(privKey, chainNodeClient)))
          .then((finalizedTx) => {
            const msg = new JsonDataMsg(finalizedTx.getPayload());
            return this.http.signUp(msg);
          });
      });
  }

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
