import { Singleton } from '@deip/toolbox';
import { proxydi } from '@deip/proxydi';
import crypto from '@deip/lib-crypto';
import { CreateAccountCmd } from '@deip/command-models';
import { ChainService } from '@deip/chain-service';
import { JsonDataMsg } from '@deip/message-models';
import { AuthHttp } from './AuthHttp';

class AuthService extends Singleton {
  proxydi = proxydi;

  $http = AuthHttp.getInstance();

  signIn(model) {
    return this.$http.signIn(model);
  }

  adminSignIn(model) {
    return this.$http.adminSignIn(model);
  }

  signUp({
    creator,
    email,
    attributes,
    username,
    pubKey,
    roles
  }) {
    const env = this.proxydi.get('env');
    const {
      FAUCET_ACCOUNT_USERNAME,
      IS_TESTNET
    } = env;

    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const txBuilder = chainService.getChainTxBuilder();
        const userAttributes = attributes || [];

        return txBuilder.begin()
          .then(() => {
            const createAccountCmd = new CreateAccountCmd({
              isTeamAccount: false,
              fee: `0.000 ${IS_TESTNET ? 'TESTS' : 'DEIP'}`,
              creator: creator || FAUCET_ACCOUNT_USERNAME,
              authority: {
                owner: {
                  auths: [{ key: pubKey, weight: 1 }],
                  weight: 1
                },
                active: {
                  auths: [{ key: pubKey, weight: 1 }],
                  weight: 1
                }
              },
              memoKey: pubKey,
              description: crypto.hexify(crypto.sha256(new TextEncoder('utf-8').encode(JSON.stringify(userAttributes)).buffer)),
              attributes: userAttributes,
              email,
              roles,
              entityId: username
            });

            txBuilder.addCmd(createAccountCmd);

            return txBuilder.end();
          })
          .then((packedTx) => {
            // const chainNodeClient = chainService.getChainNodeClient();
            // return packedTx.signAsync(privKey, chainNodeClient);
            const msg = new JsonDataMsg(packedTx.getPayload());
            return this.$http.signUp(msg);
          });
      });
  }
}

export {
  AuthService
};
