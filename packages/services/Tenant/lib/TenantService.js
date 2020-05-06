import { Singleton } from '@deip/toolbox';
import { TenantHttp } from './TenantHttp';
import { ResearchGroupService } from '@deip/research-group-service';

class TenantService extends Singleton {
  tenantHttp = TenantHttp.getInstance();
  researchGroupService = ResearchGroupService.getInstance();

  getTenantByPermlink(permlink) {
    return this.researchGroupService.getResearchGroupByPermlink(permlink);
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
