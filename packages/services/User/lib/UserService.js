import { proxydi } from '@deip/proxydi';
import { MultFormDataMsg } from '@deip/message-models';
import {
  UpdateAccountCmd
} from '@deip/command-models';
import { ChainService } from '@deip/chain-service';
import {
  Singleton,
  replaceFileWithName,
  createFormData,
  genSha256Hash
} from '@deip/toolbox';
import { UserHttp } from './UserHttp';

class UserService extends Singleton {
  userHttp = UserHttp.getInstance();

  proxydi = proxydi;

  updateUser(payload) {
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
      status,
      accountOwnerAuth,
      memoKey
    } = data;

    const formData = createFormData(data);
    const attributes = replaceFileWithName(data.attributes);

    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const chainTxBuilder = chainService.getChainTxBuilder();
        const chainNodeClient = chainService.getChainNodeClient();

        return chainTxBuilder.begin()
          .then((txBuilder) => {
            const updateAccountCmd = new UpdateAccountCmd({
              isTeamAccount: false,
              entityId: updater,
              ownerAuth: accountOwnerAuth,
              memoKey,
              description: genSha256Hash(attributes),
              attributes,
              email,
              status
            });

            txBuilder.addCmd(updateAccountCmd);
            return txBuilder.end();
          })
          .then((packedTx) => packedTx.signAsync(privKey, chainNodeClient))
          .then((packedTx) => {
            const msg = new MultFormDataMsg(formData, packedTx.getPayload(), { 'entity-id': updater });
            return this.userHttp.updateUser(msg);
          });
      });
  }

  getUserInvites(username) {
    return this.userHttp.getInvitesByUser(username);
  }

  getUsers(usernames) {
    return this.userHttp.getUsers(usernames);
  }

  getUsersByTeam(teamId) {
    return this.userHttp.getUsersByTeam(teamId);
  }

  getUsersByTenant(tenantId) {
    return this.userHttp.getUsersByTenant(tenantId);
  }

  getUsersListing(query = {}) {
    return this.userHttp.getUsersListing(query);
  }

  // ONE

  getUser(username) {
    if (username.includes('@')) {
      return this.userHttp.getUserByEmail(username);
    }
    return this.userHttp.getUser(username);
  }

  checkIfUserExists(username) {
    return new Promise((resolve) => this.getUser(username)
      .then(() => resolve(true))
      .catch((error) => {
        if (error.response.status === 404) {
          resolve(false);
        } else {
          throw error;
        }
      }));
  }
}

export {
  UserService
};
