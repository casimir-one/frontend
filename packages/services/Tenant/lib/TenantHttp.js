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

  updateTenantProfile(updatedProfile) {
    return this.http.put('/tenant/profile', updatedProfile);
  }

  updateNetworkSettings(data) {
    return this.http.put('/tenant/network-settings', data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  updateTenantSettings(form) {
    return this.http.put('/tenant/settings', form, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  createTenantResearchAttribute(researchAttribute) {
    return this.http.post('/tenant/research-attributes', researchAttribute);
  }

  updateTenantResearchAttribute(researchAttribute) {
    return this.http.put('/tenant/research-attributes', researchAttribute);
  }

  deleteTenantResearchAttribute(researchAttributeId) {
    return this.http.delete_(`/tenant/research-attributes/${researchAttributeId}`);
  }

  postSignUp(req) {
    return this.http.post('/tenant/v2/registry/sign-up', req.getHttpBody());
  }

  getSignUpRequests() {
    return this.http.get('/tenant/registry/sign-ups');
  }

  approveSignUpRequest(username) {
    return this.http.put('/tenant/registry/sign-ups/approve', { username });
  }

  rejectSignUpRequest(username) {
    return this.http.put('/tenant/registry/sign-ups/reject', { username });
  }
}

export {
  TenantHttp
};
