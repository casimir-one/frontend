import { proxydi } from '@deip/proxydi';
import { MultFormDataMsg, JsonDataMsg } from '@deip/messages';
import {
  UpdateDaoCmd,
  AlterDaoAuthorityCmd,
  SendRegistrationCodeByEmailCmd
} from '@deip/commands';
import { ChainService } from '@deip/chain-service';
import { WebSocketService } from '@deip/web-socket-service';
import {
  replaceFileWithName,
  createFormData,
  genSha256Hash,
  makeSingletonInstance
} from '@deip/toolbox';
import { APP_EVENT } from '@deip/constants';
import { UserHttp } from './UserHttp';

export class UserService {
  userHttp = UserHttp.getInstance();
  webSocketService = WebSocketService.getInstance();

  proxydi = proxydi;

  /**
   * Update user information
   * @param {Object} payload
   * @param {Object} payload.initiator
   * @param {string} payload.initiator.privKey
   * @param {string} payload.initiator.username
   * @param {string} payload.email
   * @param {number} payload.status
   * @param {Object[]} payload.attributes
   * @return {Promise<Object>}
   */
  async update(payload) {
    const env = this.proxydi.get('env');
    const {
      initiator: {
        privKey,
        username: updater
      },
      ...data
    } = payload;

    const {
      email,
      status
    } = data;

    const formData = createFormData(data);
    const attributes = replaceFileWithName(data.attributes);

    const response = await ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const chainTxBuilder = chainService.getChainTxBuilder();
        const chainNodeClient = chainService.getChainNodeClient();

        return chainTxBuilder.begin()
          .then((txBuilder) => {
            const updateDaoCmd = new UpdateDaoCmd({
              isTeamAccount: false,
              entityId: updater,
              description: genSha256Hash(attributes),
              attributes,
              email,
              status
            });

            txBuilder.addCmd(updateDaoCmd);
            return txBuilder.end();
          })
          .then((packedTx) => packedTx.signAsync(privKey, chainNodeClient))
          .then((packedTx) => {
            const msg = new MultFormDataMsg(
              formData,
              packedTx.getPayload(),
              { 'entity-id': updater }
            );

            if (env.RETURN_MSG === true) {
              return msg;
            }

            return this.userHttp.update(msg);
          });
      });

    await this.webSocketService.waitForMessage((message) => {
      const [, eventBody] = message;
      return eventBody.event.eventNum === APP_EVENT.DAO_UPDATED
              && eventBody.event.eventPayload.daoId === updater;
    });

    return response;
  }

  /**
   * Change user password
   * @param {Object} payload
   * @param {Object} payload.initiator
   * @param {string} payload.initiator.privKey
   * @param {string} payload.initiator.username
   * @param {Object} payload.authority
   * @return {Promise<Object>}
   */
  async changePassword(payload) {
    const env = this.proxydi.get('env');
    const {
      initiator: {
        privKey,
        username
      },
      authority
    } = payload;

    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const chainTxBuilder = chainService.getChainTxBuilder();
        const chainNodeClient = chainService.getChainNodeClient();

        return chainTxBuilder.begin()
          .then((txBuilder) => {
            const alterDaoAuthorityCmd = new AlterDaoAuthorityCmd({
              entityId: username,
              isTeamAccount: false,
              authority
            });

            txBuilder.addCmd(alterDaoAuthorityCmd);
            return txBuilder.end();
          })
          .then((packedTx) => packedTx.signAsync(privKey, chainNodeClient))
          .then((packedTx) => {
            const msg = new JsonDataMsg(packedTx.getPayload(), { 'entity-id': username });

            if (env.RETURN_MSG === true) {
              return msg;
            }

            return this.userHttp.changePassword(msg);
          });
      });
  }

  /**
   * Send registration code by email
   * @param {string} token
   * @return {Promise<Object>}
   */
  async sendRegistrationCodeByEmail(payload) {
    const sendRegistrationCodeByEmailCmd = new SendRegistrationCodeByEmailCmd(payload);
    const msg = new JsonDataMsg({ appCmds: [sendRegistrationCodeByEmailCmd] });
    return this.userHttp.sendRegistrationCodeByEmail(msg);
  }

  /**
   * Get users by ids
   * @param {string[]} ids
   * @return {Promise<Object>}
   */
  async getListByIds(ids) {
    return this.userHttp.getListByIds(ids);
  }

  /**
   * Get users by team id
   * @param {string} teamId
   * @return {Promise<Object>}
   */
  async getListByTeam(teamId) {
    return this.userHttp.getListByTeam(teamId);
  }

  /**
   * Get users by portal id
   * @param {string} portalId
   * @return {Promise<Object>}
   */
  async getListByPortal(portalId) {
    return this.userHttp.getListByPortal(portalId);
  }

  /**
   * Get users by several parameters
   * @param {Object} query
   * @return {Promise<Object>}
   */
  async getList(query = {}) {
    return this.userHttp.getList(query);
  }

  /**
   * Get user by username or email
   * @param {string} username
   * @return {Promise<Object>}
   */
  async getOne(username) {
    if (username.includes('@')) {
      return this.userHttp.getOneByEmail(username);
    }
    return this.userHttp.getOne(username);
  }

  /** @type {() => UserService} */
  static getInstance = makeSingletonInstance(() => new UserService());
}
