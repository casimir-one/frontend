import deipRpc from '@deip/rpc-client';
import { Singleton } from '@deip/toolbox';
import { TenantHttp } from './TenantHttp';
import { BlockchainService } from '@deip/blockchain-service';

class TenantService extends Singleton {
  tenantHttp = TenantHttp.getInstance();
  blockchainService = BlockchainService.getInstance();

  getTenant(tenantId) {
    return Promise.all([
      this.getTenantAccount(tenantId),
      this.getTenantProfile(tenantId)
    ])
      .then(([ account, profile ]) => {
        return { account, profile };
    });
  }

  getTenantAccount(tenantId) {
    return deipRpc.api.getResearchGroupAsync(tenantId);
  }

  getTenantProfile(tenantId) {
    return this.tenantHttp.getTenantProfile(tenantId);
  }

  updateTenantProfile(updatedProfile) {
    return this.tenantHttp.updateTenantProfile(updatedProfile);
  }

  createTenantResearchAttribute(researchAttribute) {
    return this.tenantHttp.createTenantResearchAttribute(researchAttribute);
  }

  updateTenantResearchAttribute(researchAttribute) {
    return this.tenantHttp.updateTenantResearchAttribute(researchAttribute);
  }

  deleteTenantResearchAttribute(researchAttribute) {
    return this.tenantHttp.deleteTenantResearchAttribute(researchAttribute);
  }

  postSignUp(data) {
    return this.tenantHttp.postSignUp(data);
  }

  getSignUpRequests() {
    return this.tenantHttp.getSignUpRequests();
  }

  approveSignUpRequest(username) {
    return this.tenantHttp.approveSignUpRequest(username);
  }

  rejectSignUpRequest(username) {
    return this.tenantHttp.rejectSignUpRequest(username);
  }

  addTenantAdmin(privKey, {
    tenantId,
    adminToAdd
  }) {

    return deipRpc.api.getAccountsAsync([tenantId])
      .then(([tenantAccount]) => {

        const update_account_op = ['update_account', {
          account: tenantId,
          owner: undefined,
          active: {
            account_auths: [...tenantAccount.active.account_auths, [adminToAdd, 1]],
            key_auths: [],
            weight_threshold: 1
          },
          active_overrides: undefined,
          memo_key: undefined,
          json_metadata: undefined,
          traits: undefined,
          extensions: []
        }];


        return this.blockchainService.signOperations([update_account_op], privKey)
          .then((signedTx) => {
            return this.tenantHttp.addAdminTenant({ tx: signedTx })
          })
      });
  }

  removeTenantAdmin(privKey, {
    tenantId,
    adminToRemove
  }) {

    return deipRpc.api.getAccountsAsync([tenantId])
      .then(([tenantAccount]) => {

        const update_account_op = ['update_account', {
          account: tenantId,
          owner: undefined,
          active: {
            account_auths: [...tenantAccount.active.account_auths.filter(([name, threshold]) => name != adminToRemove)],
            key_auths: [],
            weight_threshold: 1
          },
          active_overrides: undefined,
          memo_key: undefined,
          json_metadata: undefined,
          traits: undefined,
          extensions: []
        }];

        return this.blockchainService.signOperations([update_account_op], privKey)
          .then((signedTx) => {
            return this.tenantHttp.removeAdminTenant({ tx: signedTx })
          })
      });
  }

}

export {
  TenantService
};
