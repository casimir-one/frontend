import { Singleton } from '@deip/toolbox';
import { GrantsHttp } from './GrantsHttp';

class GrantsService extends Singleton {
  grantsHttp = GrantsHttp.getInstance();

  getApplicationPackageRef(agency, foaId, hash) {
    return this.grantsHttp.getApplicationPackageRef(agency, foaId, hash);
  }

  getApplicationsRefsByResearch(researchId) {
    return this.grantsHttp.getApplicationsRefsByResearch(researchId);
  }

  getApplicationsRefsByFoa(foaId) {
    return this.grantsHttp.getApplicationsRefsByFoa(foaId);
  }
}

export {
  GrantsService
};
