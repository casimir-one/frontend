import { HttpService } from '@deip/http-service';
import { createInstanceGetter } from '@deip/toolbox';

export class PortalHttp {
  http = HttpService.getInstance();

  async getPortal() {
    return this.http.get('/portal');
  }

  async getNetworkPortal(portalId) {
    return this.http.get(`/api/network/portals/${portalId}`);
  }

  async getNetworkPortals() {
    return this.http.get('/api/network/portals/listing');
  }

  async updatePortalProfile(req) {
    return this.http.put('/portal/profile', req.getHttpBody());
  }

  async updateNetworkSettings(req) {
    return this.http.put('/portal/network-settings', req.getHttpBody());
  }

  async updatePortalSettings(req) {
    return this.http.put('/portal/settings', req.getHttpBody(), { headers: req.getHttpHeaders() });
  }

  async postSignUp(req) {
    return this.http.post('/portal/v2/registry/sign-up', req.getHttpBody());
  }

  async approveSignUpRequest(req) {
    return this.http.post('/portal/v2/registry/sign-ups/approve', req.getHttpBody());
  }

  async getSignUpRequests() {
    return this.http.get('/portal/registry/sign-ups');
  }

  async rejectSignUpRequest(req) {
    return this.http.put('/portal/registry/sign-ups/reject', req.getHttpBody());
  }

  /** @type {() => PortalHttp} */
  static getInstance = createInstanceGetter(PortalHttp);
}
