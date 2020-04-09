import { Singleton } from '@deip/toolbox';
import { TenantHttp } from './TenantHttp';
import { ResearchGroupService } from '@deip/research-group-service';

class TenantService extends Singleton {
  tenantHttp = TenantHttp.getInstance();

  researchGroupService = ResearchGroupService.getInstance();

  getTenantByPermlink(permlink) {
    return this.researchGroupService.getResearchGroupByPermlink(permlink);
  }

}

export {
  TenantService
};
