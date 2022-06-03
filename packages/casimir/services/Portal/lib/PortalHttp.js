import { HttpService } from '@deip/http-service';
import { makeSingletonInstance } from '@deip/toolbox';

/**
 * Portal HTTP transport
 */
export class PortalHttp {
  http = HttpService.getInstance();

  /**
   * Get portal
   * @returns {Promise<Object>}
   */
  async getPortal() {
    return this.http.get('/portal');
  }

  /**
   * Get network portal by portal id
   * @param {string} portalId
   * @returns {Promise<Object>}
   */
  async getNetworkPortal(portalId) {
    return this.http.get(`/api/network/portals/${portalId}`);
  }

  /**
   * Get network portal list
   * @returns {Promise<Object>}
   */
  async getNetworkPortals() {
    return this.http.get('/api/network/portals/listing');
  }

  /**
   * Update portal profile
   * @param {Object} req
   * @returns {Promise<Object>}
   */
  async updatePortalProfile(req) {
    return this.http.put('/portal/profile', req.getHttpBody());
  }

  /**
   * Update portal network settings
   * @param {Object} req
   * @returns {Promise<Object>}
   */
  async updateNetworkSettings(req) {
    return this.http.put('/portal/network-settings', req.getHttpBody());
  }

  /**
   * Update portal settings
   * @param {Object} req
   * @returns {Promise<Object>}
   */
  async updatePortalSettings(req) {
    return this.http.put('/portal/settings', req.getHttpBody(), { headers: req.getHttpHeaders() });
  }

  /**
   * Post sign up
   * @param {Object} req
   * @returns {Promise<Object>}
   */
  async postSignUp(req) {
    return this.http.post('/portal/v2/registry/sign-up', req.getHttpBody());
  }

  /**
   * Approve sign up request
   * @param {Object} req
   * @returns {Promise<Object>}
   */
  async approveSignUpRequest(req) {
    return this.http.post('/portal/v2/registry/sign-ups/approve', req.getHttpBody());
  }

  /**
   * Get sign up requests
   * @returns {Promise<Object>}
   */
  async getSignUpRequests() {
    return this.http.get('/portal/registry/sign-ups');
  }

  /**
   * Reject sign up request
   * @param {Object} req
   * @returns {Promise<Object>}
   */
  async rejectSignUpRequest(req) {
    return this.http.put('/portal/registry/sign-ups/reject', req.getHttpBody());
  }

  /** @type {() => PortalHttp} */
  static getInstance = makeSingletonInstance(() => new PortalHttp());
}
