import { HttpService } from '@deip/http-service';
import { Singleton } from '@deip/toolbox';

class TenantHttp extends Singleton {
  http = HttpService.getInstance();

  getTenantProfile() {
    return this.http.get(`/tenant/profile`);
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
}

export {
  TenantHttp
};
