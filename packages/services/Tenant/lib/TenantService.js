import deipRpc from '@deip/rpc-client';
import { Singleton } from '@deip/toolbox';
import { TenantHttp } from './TenantHttp';

class TenantService extends Singleton {
  tenantHttp = TenantHttp.getInstance();

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

}

export {
  TenantService
};
