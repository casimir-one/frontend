import { AccessService } from '@deip/access-service';
import { BlockchainService } from '@deip/blockchain-service';

import { Singleton } from '@deip/toolbox';
import { UserHttp } from './UserHttp';

class UserService extends Singleton {
  userHttp = UserHttp.getInstance();
  accessService = AccessService.getInstance();
  blockchainService = BlockchainService.getInstance();


  updateUserAccountViaOffchain(privKey, {
    account,
    accountOwnerAuth,
    accountActiveAuth,
    accountMemoPubKey,
    accountJsonMetadata,
    accountExtensions
  }) {

    const update_account_op = ['update_account', {
      account,
      owner: accountOwnerAuth,
      active: accountActiveAuth,
      active_overrides: undefined,
      memo_key: accountMemoPubKey,
      json_metadata: accountJsonMetadata,
      traits: undefined,
      extensions: accountExtensions
    }];
    
    return this.blockchainService.signOperations([update_account_op], privKey)
      .then((signedTx) => {
        return this.userHttp.updateUserAccount(account, { tx: signedTx });
      })
  }

  updateUserProfile(username, update) {
    return this.userHttp.updateUserProfile(username, update);
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

  getUserTransactions(status) {
    return this.userHttp.getUserTransactions(status);
  }  
  
}

export {
  UserService
};
