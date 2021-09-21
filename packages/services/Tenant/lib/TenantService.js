import { Singleton } from '@deip/toolbox';
import { proxydi } from '@deip/proxydi';
import crypto from '@deip/lib-crypto';
import { CreateAccountCmd } from '@deip/command-models';
import { ChainService } from '@deip/chain-service';
import { JsonDataMsg } from '@deip/message-models';
import { TenantHttp } from './TenantHttp';

class TenantService extends Singleton {
  tenantHttp = TenantHttp.getInstance();

  proxydi = proxydi;

  getTenant() {
    return this.tenantHttp.getTenant();
  }

  getNetworkTenant(tenantId) {
    return this.tenantHttp.getNetworkTenant(tenantId);
  }

  getNetworkTenants() {
    return this.tenantHttp.getNetworkTenants();
  }

  updateTenantProfile(updatedProfile) {
    return this.tenantHttp.updateTenantProfile(updatedProfile);
  }

  updateNetworkSettings(data) {
    return this.tenantHttp.updateNetworkSettings(data);
  }

  updateTenantSettings(form) {
    return this.tenantHttp.updateTenantSettings(form);
  }

  createTenantResearchAttribute(researchAttribute) {
    return this.tenantHttp.createTenantResearchAttribute(researchAttribute);
  }

  updateTenantResearchAttribute(researchAttribute) {
    return this.tenantHttp.updateTenantResearchAttribute(researchAttribute);
  }

  deleteTenantResearchAttribute(researchAttribute) {
    return this.tenantHttp.deleteTenantResearchAttribute(researchAttribute);
  }

  postSignUp({
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
        const chainTxBuilder = chainService.getChainTxBuilder();
        return chainTxBuilder.begin()
          .then((txBuilder) => {
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
            });
            txBuilder.addCmd(createAccountCmd);

            return txBuilder.end();
          })
          .then((packedTx) => {
            // const chainNodeClient = chainService.getChainNodeClient();
            // return txEnvelop.signAsync(privKey, chainNodeClient);
            const msg = new JsonDataMsg(packedTx.getPayload());
            return this.tenantHttp.postSignUp(msg);
          });
      });
  }

  getSignUpRequests() {
    return this.tenantHttp.getSignUpRequests();
  }

  approveSignUpRequest(username) {
    return this.tenantHttp.approveSignUpRequest(username);
  }

  rejectSignUpRequest(username) {
    return this.tenantHttp.rejectSignUpRequest(username);
  }
}

export {
  TenantService
};
