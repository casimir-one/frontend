import { Singleton } from '@deip/toolbox';
import { proxydi } from '@deip/proxydi';
import crypto from '@deip/lib-crypto';
import {
  ProtocolRegistry,
  CreateAccountCmd
} from '@deip/command-models';
import { ApplicationJsonMessage } from '@deip/request-models';
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
    const {
      FAUCET_ACCOUNT_USERNAME,
      PROTOCOL,
      IS_TESTNET
    } = this.proxydi.get('env');

    const protocolRegistry = new ProtocolRegistry(PROTOCOL);
    const txBuilder = protocolRegistry.getTransactionsBuilder();

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
          description: crypto.hexify(crypto.sha256(new TextEncoder('utf-8').encode(JSON.stringify(attributes)).buffer)),
          attributes,
          email,
          roles,
          entityId: username
        }, txBuilder.getTxCtx());

        txBuilder.addCmd(createAccountCmd);

        return txBuilder.end();
      })
      .then((txEnvelop) => {
        // txEnvelop.sign(privKey);
        const msg = new ApplicationJsonMessage({}, txEnvelop);
        return this.$http.signUp(msg);
      });
  }
}

export {
  AuthService
};
