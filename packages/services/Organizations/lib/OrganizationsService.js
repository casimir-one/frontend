import { Singleton } from '@deip/toolbox';
import { OrganizationsHttp } from './OrganizationsHttp';

class OrganizationsService extends Singleton {
  organizationsHttp = OrganizationsHttp.getInstance();

  constructor() {
    super();
    console.log('Organizations', 'constructed');
  }

  getAllOrganizations() {
    return this.organizationsHttp.getAllOrganizations();
  }

  getResearchOrganization(researchId) {
    const orgs = this.getAllOrganizations();
    return orgs.find((org) => org.researches.some((id) => id === researchId));
  }
}

export {
  OrganizationsService
};
