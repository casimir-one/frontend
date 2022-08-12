import { proxydi } from '@casimir/proxydi';
import { MultFormDataMsg, JsonDataMsg } from '@casimir/messages';
import {
  UpdateDaoCmd,
  AlterDaoAuthorityCmd
} from '@casimir/commands';
import { ChainService } from '@casimir/chain-service';
import { WebSocketService } from '@casimir/web-socket-service';
import {
  replaceFileWithName,
  createFormData,
  genSha256Hash,
  makeSingletonInstance
} from '@casimir/toolbox';
import { APP_EVENT } from '@casimir/platform-core';
import { walletSignTx } from '@casimir/platform-util';
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

    const chainService = await ChainService.getInstanceAsync(env);
    const chainTxBuilder = chainService.getChainTxBuilder();

    const txBuilder = await chainTxBuilder.begin();

    const updateDaoCmd = new UpdateDaoCmd({
      isTeamAccount: false,
      entityId: updater,
      description: genSha256Hash(attributes),
      attributes,
      email,
      status
    });

    txBuilder.addCmd(updateDaoCmd);

    const packedTx = await txBuilder.end();

    const chainNodeClient = chainService.getChainNodeClient();
    const chainInfo = chainService.getChainInfo();
    let signedTx;

    if (env.WALLET_URL) {
      signedTx = await walletSignTx(packedTx, chainInfo);
    } else {
      signedTx = await packedTx.signAsync(privKey, chainNodeClient);
    }

    const msg = new MultFormDataMsg(
      formData,
      signedTx.getPayload(),
      { 'entity-id': updater }
    );

    if (env.RETURN_MSG === true) {
      return msg;
    }

    const response = await this.userHttp.update(msg);

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

    const chainService = await ChainService.getInstanceAsync(env);
    const chainTxBuilder = chainService.getChainTxBuilder();

    const txBuilder = await chainTxBuilder.begin();

    const alterDaoAuthorityCmd = new AlterDaoAuthorityCmd({
      entityId: username,
      isTeamAccount: false,
      authority
    });

    txBuilder.addCmd(alterDaoAuthorityCmd);

    const packedTx = await txBuilder.end();

    const chainNodeClient = chainService.getChainNodeClient();
    const chainInfo = chainService.getChainInfo();
    let signedTx;

    if (env.WALLET_URL) {
      signedTx = await walletSignTx(packedTx, chainInfo);
    } else {
      signedTx = await packedTx.signAsync(privKey, chainNodeClient);
    }

    const msg = new JsonDataMsg(signedTx.getPayload(), { 'entity-id': username });

    if (env.RETURN_MSG === true) {
      return msg;
    }

    return this.userHttp.changePassword(msg);
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
