import { createFormData, createInstanceGetter } from '@deip/toolbox';
import { proxydi } from '@deip/proxydi';
import crypto from '@deip/lib-crypto';
import {
  CreateAccountCmd,
  DeleteUserProfileCmd,
  UpdateNetworkSettingsCmd,
  UpdatePortalProfileCmd,
  UpdatePortalSettingsCmd
} from '@deip/command-models';
import { ChainService } from '@deip/chain-service';
import { MultFormDataMsg, JsonDataMsg } from '@deip/message-models';
import { TenantHttp } from './TenantHttp';

export class TenantService {
  tenantHttp = TenantHttp.getInstance();

  proxydi = proxydi;

  async getTenant() {
    return this.tenantHttp.getTenant();
  }

  async getNetworkTenant(tenantId) {
    return this.tenantHttp.getNetworkTenant(tenantId);
  }

  async getNetworkTenants() {
    return this.tenantHttp.getNetworkTenants();
  }

  async updateTenantProfile(data) {
    const updatePortalProfileCmd = new UpdatePortalProfileCmd(data);
    const msg = new JsonDataMsg({ appCmds: [updatePortalProfileCmd] });
    return this.tenantHttp.updateTenantProfile(msg);
  }

  async updateNetworkSettings(data) {
    const updateNetworkSettingsCmd = new UpdateNetworkSettingsCmd(data);
    const msg = new JsonDataMsg({ appCmds: [updateNetworkSettingsCmd] });
    return this.tenantHttp.updateNetworkSettings(msg);
  }

  async updateTenantSettings(data) {
    const {
      title,
      banner,
      logo
    } = data;

    const formData = createFormData(data);

    const updatePortalSettingsCmd = new UpdatePortalSettingsCmd({
      title,
      banner,
      logo
    });
    const msg = new MultFormDataMsg(formData, { appCmds: [updatePortalSettingsCmd] });
    return this.tenantHttp.updateTenantSettings(msg);
  }

  async postSignUp({
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
      CORE_ASSET
    } = env;

    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const chainTxBuilder = chainService.getChainTxBuilder();
        return chainTxBuilder.begin()
          .then((txBuilder) => {
            const createAccountCmd = new CreateAccountCmd({
              isTeamAccount: false,
              fee: { ...CORE_ASSET, amount: 0 },
              creator: creator || FAUCET_ACCOUNT_USERNAME,
              authority: {
                owner: {
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

  async getSignUpRequests() {
    return this.tenantHttp.getSignUpRequests();
  }

  async approveSignUpRequest(username) {
    // TODO: replace with a specific command
    return this.getSignUpRequests()
      .then((signupRequests) => {
        const signupRequest = signupRequests.find((r) => r._id === username);

        const env = this.proxydi.get('env');
        const {
          FAUCET_ACCOUNT_USERNAME,
          CORE_ASSET
        } = env;

        return ChainService.getInstanceAsync(env)
          .then((chainService) => {
            const chainTxBuilder = chainService.getChainTxBuilder();
            return chainTxBuilder.begin()
              .then((txBuilder) => {
                const createAccountCmd = new CreateAccountCmd({
                  isTeamAccount: false,
                  fee: { ...CORE_ASSET, amount: 0 },
                  creator: FAUCET_ACCOUNT_USERNAME,
                  authority: {
                    owner: {
                      auths: [{ key: signupRequest.signUpPubKey, weight: 1 }],
                      weight: 1
                    }
                  },
                  memoKey: signupRequest.signUpPubKey,
                  description: crypto.hexify(crypto.sha256(new TextEncoder('utf-8').encode(JSON.stringify(signupRequest.attributes)).buffer)),
                  attributes: signupRequest.attributes,
                  email: signupRequest.email,
                  roles: signupRequest.roles,
                  entityId: username
                });
                txBuilder.addCmd(createAccountCmd);
                return txBuilder.end();
              })
              .then((packedTx) => {
                // const chainNodeClient = chainService.getChainNodeClient();
                // return txEnvelop.signAsync(privKey, chainNodeClient);
                const msg = new JsonDataMsg(packedTx.getPayload());
                return this.tenantHttp.approveSignUpRequest(msg);
              });
          });
      });
  }

  async rejectSignUpRequest(username) {
    const deleteUserProfileCmd = new DeleteUserProfileCmd({ username });
    const msg = new JsonDataMsg({ appCmds: [deleteUserProfileCmd] });
    return this.tenantHttp.rejectSignUpRequest(msg);
  }

  /** @type {() => TenantService} */
  static getInstance = createInstanceGetter(TenantService);
}
