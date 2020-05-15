import { HttpService } from '@deip/http-service';
import { Singleton } from '@deip/toolbox';

class TenantHttp extends Singleton {
  http = HttpService.getInstance();

  getTenantProfile(tenant) {
    return this.http.get(`/tenant/profile/${tenant}`);
  }

  updateTenantProfile(updatedProfile) {
    return this.http.put(`/tenant/profile`, updatedProfile);
  }

  postSignUp(data) {
    return this.http.post(`/tenant/sign-up`, data);
  }

  getSignUpRequests() {
    return this.http.get(`/tenant/sign-ups`);
  }

  approveSignUpRequest(username) {
    return this.http.put(`/tenant/sign-ups/approve`, { username });
  }

  rejectSignUpRequest(username) {
    return this.http.put(`/tenant/sign-ups/reject`, { username });
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
