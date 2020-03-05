import { AccessService } from '@deip/access-service';
import { BlockchainService } from '@deip/blockchain-service';

import { Singleton } from '@deip/toolbox';
import { UserHttp } from './UserHttp';

class UserService extends Singleton {
  userHttp = UserHttp.getInstance();

  accessService = AccessService.getInstance();

  blockchainService = BlockchainService.getInstance();

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

  approveInvite(groupId, owner) {
    const invite = {
      research_group_invite_id: groupId,
      owner
    };

    const operation = ['approve_research_group_invite', invite];
    return this.blockchainService.signOperation(operation, this.accessService.getOwnerWif())
      .then((signedTx) => this.userHttp.sendApproveInvite(signedTx));
  }

  rejectInvite(groupId, owner) {
    const invite = {
      research_group_invite_id: groupId,
      owner
    };

    const operation = ['reject_research_group_invite', invite];
    return this.blockchainService.signOperation(operation, this.accessService.getOwnerWif())
      .then((signedTx) => this.userHttp.sendRejectInvite(signedTx));
  }
}

export {
  UserService
};
