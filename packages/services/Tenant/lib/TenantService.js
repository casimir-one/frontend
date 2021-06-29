import { Singleton } from '@deip/toolbox';
import { BlockchainService } from '@deip/blockchain-service';
import { proxydi } from '@deip/proxydi';
import crypto from '@deip/lib-crypto';
import {
  ProtocolRegistry,
  CreateAccountCmd
} from '@deip/command-models';
import { ApplicationJsonMessage } from '@deip/request-models';
import { TenantHttp } from './TenantHttp';

class TenantService extends Singleton {
  tenantHttp = TenantHttp.getInstance();

  blockchainService = BlockchainService.getInstance();

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
        return this.tenantHttp.postSignUp(msg);
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
