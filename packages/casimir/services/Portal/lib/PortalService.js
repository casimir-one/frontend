import { createFormData, createInstanceGetter, genSha256Hash } from '@deip/toolbox';
import { proxydi } from '@deip/proxydi';
import {
  CreateDaoCmd,
  DeleteUserProfileCmd,
  UpdateNetworkSettingsCmd,
  UpdatePortalProfileCmd,
  UpdatePortalSettingsCmd
} from '@deip/command-models';
import { ChainService } from '@deip/chain-service';
import { MultFormDataMsg, JsonDataMsg } from '@deip/messages';
import { PortalHttp } from './PortalHttp';

export class PortalService {
  portalHttp = PortalHttp.getInstance();

  proxydi = proxydi;

  async getPortal() {
    return this.portalHttp.getPortal();
  }

  async getNetworkPortal(portalId) {
    return this.portalHttp.getNetworkPortal(portalId);
  }

  async getNetworkPortals() {
    return this.portalHttp.getNetworkPortals();
  }

  async updatePortalProfile(data) {
    const updatePortalProfileCmd = new UpdatePortalProfileCmd(data);
    const msg = new JsonDataMsg({ appCmds: [updatePortalProfileCmd] });
    return this.portalHttp.updatePortalProfile(msg);
  }

  async updateNetworkSettings(data) {
    const updateNetworkSettingsCmd = new UpdateNetworkSettingsCmd(data);
    const msg = new JsonDataMsg({ appCmds: [updateNetworkSettingsCmd] });
    return this.portalHttp.updateNetworkSettings(msg);
  }

  async updatePortalSettings(data) {
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
    return this.portalHttp.updatePortalSettings(msg);
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
            const createDaoCmd = new CreateDaoCmd({
              isTeamAccount: false,
              fee: { ...CORE_ASSET, amount: 0 },
              creator: creator || FAUCET_ACCOUNT_USERNAME,
              authority: {
                owner: {
                  auths: [{ key: pubKey, weight: 1 }],
                  weight: 1
                }
              },
              description: genSha256Hash(JSON.stringify(attributes)),
              attributes,
              email,
              roles,
              entityId: username
            });
            txBuilder.addCmd(createDaoCmd);

            return txBuilder.end();
          })
          .then((packedTx) => {
            // const chainNodeClient = chainService.getChainNodeClient();
            // return txEnvelop.signAsync(privKey, chainNodeClient);
            const msg = new JsonDataMsg(packedTx.getPayload());
            return this.portalHttp.postSignUp(msg);
          });
      });
  }

  async getSignUpRequests() {
    return this.portalHttp.getSignUpRequests();
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
                const createDaoCmd = new CreateDaoCmd({
                  isTeamAccount: false,
                  fee: { ...CORE_ASSET, amount: 0 },
                  creator: FAUCET_ACCOUNT_USERNAME,
                  authority: {
                    owner: {
                      auths: [{ key: signupRequest.signUpPubKey, weight: 1 }],
                      weight: 1
                    }
                  },
                  description: genSha256Hash(JSON.stringify(signupRequest.attributes)),
                  attributes: signupRequest.attributes,
                  email: signupRequest.email,
                  roles: signupRequest.roles,
                  entityId: username
                });
                txBuilder.addCmd(createDaoCmd);
                return txBuilder.end();
              })
              .then((packedTx) => {
                // const chainNodeClient = chainService.getChainNodeClient();
                // return txEnvelop.signAsync(privKey, chainNodeClient);
                const msg = new JsonDataMsg(packedTx.getPayload());
                return this.portalHttp.approveSignUpRequest(msg);
              });
          });
      });
  }

  async rejectSignUpRequest(username) {
    const deleteUserProfileCmd = new DeleteUserProfileCmd({ username });
    const msg = new JsonDataMsg({ appCmds: [deleteUserProfileCmd] });
    return this.portalHttp.rejectSignUpRequest(msg);
  }

  /** @type {() => PortalService} */
  static getInstance = createInstanceGetter(PortalService);
}
