import { HttpService } from '@deip/http-service';
import { Singleton } from '@deip/toolbox';

class TenantHttp extends Singleton {
  http = HttpService.getInstance();

  getTenantProfile(tenant) {
    return this.http.get(`/tenants/profile/${tenant}`);
  }

  getTenantsProfiles() {
    return this.http.get('/tenants/profiles');
  }
}

export {
  TenantHttp
};
