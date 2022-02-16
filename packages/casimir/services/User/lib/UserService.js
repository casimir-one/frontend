import { proxydi } from '@deip/proxydi';
import { MultFormDataMsg, JsonDataMsg } from '@deip/messages';
import {
  UpdateDaoCmd,
  AlterDaoAuthorityCmd
} from '@deip/commands';
import { ChainService } from '@deip/chain-service';
import {
  replaceFileWithName,
  createFormData,
  genSha256Hash,
  createInstanceGetter
} from '@deip/toolbox';
import { UserHttp } from './UserHttp';

export class UserService {
  userHttp = UserHttp.getInstance();

  proxydi = proxydi;

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

    return ChainService.getInstanceAsync(env)
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
            const msg = new MultFormDataMsg(formData, packedTx.getPayload(), { 'entity-id': updater });
            return this.userHttp.update(msg);
          });
      });
  }

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
            return this.userHttp.changePassword(msg);
          });
      });
  }

  async getUserInvites(username) {
    return this.userHttp.getInvitesByUser(username);
  }

  async getListByIds(usernames) {
    return this.userHttp.getListByIds(usernames);
  }

  async getListByTeam(teamId) {
    return this.userHttp.getListByTeam(teamId);
  }

  async getListByPortal(portalId) {
    return this.userHttp.getListByPortal(portalId);
  }

  async getList(query = {}) {
    return this.userHttp.getList(query);
  }

  async getOne(username) {
    if (username.includes('@')) {
      return this.userHttp.getOneByEmail(username);
    }
    return this.userHttp.getOne(username);
  }

  async checkIfUserExists(username) {
    return new Promise((resolve) => this.getOne(username)
      .then(() => resolve(true))
      .catch((error) => {
        if (error.statusCode === 404) {
          resolve(false);
        } else {
          throw error;
        }
      }));
  }

  /** @type {() => UserService} */
  static getInstance = createInstanceGetter(UserService);
}
