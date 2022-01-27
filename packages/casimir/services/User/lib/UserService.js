import { proxydi } from '@deip/proxydi';
import { MultFormDataMsg, JsonDataMsg } from '@deip/message-models';
import {
  UpdateDaoCmd,
  AlterDaoAuthorityCmd
} from '@deip/command-models';
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

  async updateUser(payload) {
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
            return this.userHttp.updateUser(msg);
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

  async getUsers(usernames) {
    return this.userHttp.getUsers(usernames);
  }

  async getUsersByTeam(teamId) {
    return this.userHttp.getUsersByTeam(teamId);
  }

  async getUsersByPortal(portalId) {
    return this.userHttp.getUsersByPortal(portalId);
  }

  async getUsersListing(query = {}) {
    return this.userHttp.getUsersListing(query);
  }

  // ONE

  async getUser(username) {
    if (username.includes('@')) {
      return this.userHttp.getUserByEmail(username);
    }
    return this.userHttp.getUser(username);
  }

  async checkIfUserExists(username) {
    return new Promise((resolve) => this.getUser(username)
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
