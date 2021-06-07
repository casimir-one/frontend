import crypto from '@deip/lib-crypto';
import { proxydi } from '@deip/proxydi';
import { MultipartFormDataMessage } from '@deip/request-models';
import {
  ProtocolRegistry,
  UpdateAccountCmd
} from '@deip/command-models';

import { Singleton } from '@deip/toolbox';
import { UserHttp } from './UserHttp';

class UserService extends Singleton {
  userHttp = UserHttp.getInstance();

  proxydi = proxydi;

  updateUser({ privKey },
    {
      attributes,
      email,
      status,
      formData,
      updater,
      accountOwnerAuth,
      accountActiveAuth,
      memoKey
    }) {
    const { PROTOCOL } = this.proxydi.get('env');
    const protocolRegistry = new ProtocolRegistry(PROTOCOL);
    const txBuilder = protocolRegistry.getTransactionsBuilder();

    return txBuilder.begin()
      .then(() => {
        const updateAccountCmd = new UpdateAccountCmd({
          isTeamAccount: false,
          entityId: updater,
          creator: updater,
          ownerAuth: accountOwnerAuth,
          activeAuth: accountActiveAuth,
          memoKey,
          description: attributes ? crypto.hexify(crypto.sha256(new TextEncoder('utf-8').encode(JSON.stringify(attributes)).buffer)) : undefined,
          attributes,
          email,
          status
        }, txBuilder.getTxCtx());

        txBuilder.addCmd(updateAccountCmd);

        return txBuilder.end();
      })
      .then((txEnvelop) => {
        txEnvelop.sign(privKey);
        const msg = new MultipartFormDataMessage(formData, txEnvelop, { 'entity-id': updater });
        return this.userHttp.updateUser(msg);
      });
  }

  getNotificationsByUser(username) {
    return this.userHttp.getNotificationsByUser(username);
  }

  markUserNotificationAsRead(username, notificationId) {
    return this.userHttp.markUserNotificationAsRead(username, notificationId);
  }

  markAllUserNotificationAsRead(username) {
    return this.userHttp.markAllUserNotificationAsRead(username);
  }

  getResearchBookmarks(username) {
    return this.userHttp.getResearchBookmarks(username);
  }

  createResearchBookmark(username, researchId) {
    return this.userHttp.createResearchBookmark(username, researchId);
  }

  removeResearchBookmark(username, bookmarkId) {
    return this.userHttp.removeResearchBookmark(username, bookmarkId);
  }

  getUserInvites(username) {
    return this.userHttp.getInvitesByUser(username);
  }
}

export {
  UserService
};
