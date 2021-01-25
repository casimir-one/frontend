import { HttpService } from '@deip/http-service';
import { Singleton } from '@deip/toolbox';

class TenantHttp extends Singleton {
  http = HttpService.getInstance();

  getTenant(tenantId) {
    return this.http.get(`/tenant/${tenantId}`);
  }

  updateTenantProfile(updatedProfile) {
    return this.http.put(`/tenant/profile`, updatedProfile);
  }

  createTenantResearchAttribute(researchAttribute) {
    return this.http.post(`/tenant/research-attributes`, researchAttribute);
  }

  updateTenantResearchAttribute(researchAttribute) {
    return this.http.put(`/tenant/research-attributes`, researchAttribute);
  }

  deleteTenantResearchAttribute(researchAttributeId) {
    return this.http.delete_(`/tenant/research-attributes/${researchAttributeId}`);
  }

  postSignUp(data) {
    return this.http.post(`/tenant/registry/sign-up`, data);
  }

  getSignUpRequests() {
    return this.http.get(`/tenant/registry/sign-ups`);
  }

  approveSignUpRequest(username) {
    return this.http.put(`/tenant/registry/sign-ups/approve`, { username });
  }

  rejectSignUpRequest(username) {
    return this.http.put(`/tenant/registry/sign-ups/reject`, { username });
  }

  addAdminTenant({ tx }) {
    return this.http.put(`/tenant/admins/add`, { tx });
  }

  removeAdminTenant({ tx }) {
    return this.http.put(`/tenant/admins/remove`, { tx });
  }
}

export {
  TenantHttp
};
