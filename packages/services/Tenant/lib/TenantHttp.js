import { HttpService } from '@deip/http-service';
import { createInstanceGetter } from '@deip/toolbox';

export class TenantHttp {
  http = HttpService.getInstance();

  async getTenant() {
    return this.http.get('/tenant');
  }

  async getNetworkTenant(tenantId) {
    return this.http.get(`/api/network/tenants/${tenantId}`);
  }

  async getNetworkTenants() {
    return this.http.get('/api/network/tenants/listing');
  }

  async updateTenantProfile(req) {
    return this.http.put('/tenant/profile', req.getHttpBody());
  }

  async updateNetworkSettings(req) {
    return this.http.put('/tenant/network-settings', req.getHttpBody());
  }

  async updateTenantSettings(req) {
    return this.http.put('/tenant/settings', req.getHttpBody(), { headers: req.getHttpHeaders() });
  }

  async postSignUp(req) {
    return this.http.post('/tenant/v2/registry/sign-up', req.getHttpBody());
  }

  async approveSignUpRequest(req) {
    return this.http.post('/tenant/v2/registry/sign-ups/approve', req.getHttpBody());
  }

  async getSignUpRequests() {
    return this.http.get('/tenant/registry/sign-ups');
  }

  async rejectSignUpRequest(req) {
    return this.http.put('/tenant/registry/sign-ups/reject', req.getHttpBody());
  }

  /** @type {() => TenantHttp} */
  static getInstance = createInstanceGetter(TenantHttp);
}
