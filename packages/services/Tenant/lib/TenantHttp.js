import { HttpService } from '@deip/http-service';
import { Singleton } from '@deip/toolbox';

class TenantHttp extends Singleton {
  http = HttpService.getInstance();

  getTenant() {
    return this.http.get('/tenant');
  }

  getNetworkTenant(tenantId) {
    return this.http.get(`/api/network/tenants/${tenantId}`);
  }

  getNetworkTenants() {
    return this.http.get('/api/network/tenants/listing');
  }

  updateTenantProfile(req) {
    return this.http.put('/tenant/profile', req.getHttpBody());
  }

  updateNetworkSettings(req) {
    return this.http.put('/tenant/network-settings', req.getHttpBody());
  }

  updateTenantSettings(req) {
    return this.http.put('/tenant/settings', req.getHttpBody(), { headers: req.getHttpHeaders() });
  }

  postSignUp(req) {
    return this.http.post('/tenant/v2/registry/sign-up', req.getHttpBody());
  }

  approveSignUpRequest(req) {
    return this.http.post('/tenant/v2/registry/sign-ups/approve', req.getHttpBody());
  }

  getSignUpRequests() {
    return this.http.get('/tenant/registry/sign-ups');
  }

  rejectSignUpRequest(req) {
    return this.http.put('/tenant/registry/sign-ups/reject', req.getHttpBody());
  }
}

export {
  TenantHttp
};
