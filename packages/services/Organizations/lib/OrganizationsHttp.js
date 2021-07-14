import { HttpService } from '@deip/http-service';
import { Singleton } from '@deip/toolbox';
import organizations from './organizations.json';

class OrganizationsHttp extends Singleton {
  organizations = organizations

  http = HttpService.getInstance();

  getAllOrganizations() {
    return this.organizations;
  }
}

export {
  OrganizationsHttp
};
