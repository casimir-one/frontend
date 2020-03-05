import { HttpService } from '@deip/http-service';
import { Singleton } from '@deip/toolbox';
import organizations from './organizations.json';

class OrganizationsHttp extends Singleton {
  http = HttpService.getInstance();

  getAllOrganizations() {
    return organizations;
  }
}

export {
  OrganizationsHttp
};
