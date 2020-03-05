import { Singleton } from '@deip/toolbox';
import { TenantHttp } from './TenantHttp';

class TenantService extends Singleton {
  tenantHttp = TenantHttp.getInstance();

  getTenantProfile(tenant) {
    return this.tenantHttp.getTenantProfile(tenant);
  }

  getTenantsProfiles() {
    return this.tenantHttp.getTenantsProfiles();
  }
}

export {
  TenantService
};
