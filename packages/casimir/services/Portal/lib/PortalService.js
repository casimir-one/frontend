import { createFormData, createInstanceGetter, genSha256Hash } from '@deip/toolbox';
import { proxydi } from '@deip/proxydi';
import {
  CreateDaoCmd,
  DeleteUserProfileCmd,
  UpdateNetworkSettingsCmd,
  UpdatePortalProfileCmd,
  UpdatePortalSettingsCmd
} from '@deip/commands';
import { ChainService } from '@deip/chain-service';
import { MultFormDataMsg, JsonDataMsg } from '@deip/messages';
import { PortalHttp } from './PortalHttp';

/**
 * Portal data transport
 */
export class PortalService {
  portalHttp = PortalHttp.getInstance();

  proxydi = proxydi;

  /**
   * Get portal
   * @returns {Promise<Object>}
   */
  async getPortal() {
    return this.portalHttp.getPortal();
  }

  /**
   * Get network portal by portal id
   * @param {string} portalId
   * @returns {Promise<Object>}
   */
  async getNetworkPortal(portalId) {
    return this.portalHttp.getNetworkPortal(portalId);
  }

  /**
   * Get network portal list
   * @returns {Promise<Object>}
   */
  async getNetworkPortals() {
    return this.portalHttp.getNetworkPortals();
  }

  /**
   * Update portal profile
   * @param {Object} data
   * @param {Object} data.settings
   * @returns {Promise<Object>}
   */
  async updatePortalProfile(data) {
    const updatePortalProfileCmd = new UpdatePortalProfileCmd(data);
    const msg = new JsonDataMsg({ appCmds: [updatePortalProfileCmd] });
    return this.portalHttp.updatePortalProfile(msg);
  }

  /**
   * Update portal network settings
   * @param {Object} data - Network settings
   * @returns {Promise<Object>}
   */
  async updateNetworkSettings(data) {
    const updateNetworkSettingsCmd = new UpdateNetworkSettingsCmd(data);
    const msg = new JsonDataMsg({ appCmds: [updateNetworkSettingsCmd] });
    return this.portalHttp.updateNetworkSettings(msg);
  }

  /**
   * Update portal settings
   * @param {Object} data
   * @param {string} data.title
   * @param {string} data.banner
   * @param {string} data.logo
   * @returns {Promise<Object>}
   */
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

  /**
   * Post sign up
   * @param {Object} obj
   * @param {string} obj.creator
   * @param {string} obj.email
   * @param {Array.<Object>} obj.attributes
   * @param {string} obj.username
   * @param {string} obj.pubKey
   * @param {Array.<Object>} obj.roles
   * @returns {Promise<Object>}
   */
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

  /**
   * Get sign up requests
   * @returns {Promise<Object>}
   */
  async getSignUpRequests() {
    return this.portalHttp.getSignUpRequests();
  }

  /**
   * Approve sign up request
   * @param {string} username
   * @returns {Promise<Object>}
   */
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

  /**
   * Reject sign up request
   * @param {string} username
   * @returns {Promise<Object>}
   */
  async rejectSignUpRequest(username) {
    const deleteUserProfileCmd = new DeleteUserProfileCmd({ username });
    const msg = new JsonDataMsg({ appCmds: [deleteUserProfileCmd] });
    return this.portalHttp.rejectSignUpRequest(msg);
  }

  /** @type {() => PortalService} */
  static getInstance = createInstanceGetter(PortalService);
}
