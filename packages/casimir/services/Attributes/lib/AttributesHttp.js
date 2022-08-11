import { HttpService } from '@casimir/http-service';
import { makeSingletonInstance } from '@casimir/toolbox';

/**
 * Attributes HTTP transport
 */
export class AttributesHttp {
  http = HttpService.getInstance();

  /**
   * Get attributes list
   * @return {Promise<Object>}
   */
  async getList() {
    return this.http.get('/api/v2/attributes');
  }

  /**
   * Get attribute info
   * @param {string} id
   * @return {Promise<Object>}
   */
  async getOne(id) {
    return this.http.get(`/api/v2/attribute/${id}`);
  }

  /**
   * Get attributes list by scope
   * @param {string} scope
   * @return {Promise<Object>}
   */
  async getListByScope(scope) {
    return this.http.get(`/api/v2/attributes/scope/${scope}`);
  }

  /**
   * Get network attributes by scope
   * @param {string} scope
   * @return {Promise<Object>}
   */
  async getNetworkAttributesByScope(scope) {
    return this.http.get(`/api/v2/attributes/scope/network/${scope}`);
  }

  /**
   * Get all network attributes
   * @return {Promise<Object>}
   */
  async getNetworkAttributes() {
    return this.http.get('/api/v2/attributes/network');
  }

  /**
   * Deprecated
   * @return {Promise<Object>}
   */
  async getSystemAttributes() {
    return this.http.get('/api/v2/attributes/system');
  }

  /**
   * Create new attribute
   * @param {Object} req
   * @return {Promise<Object>}
   */
  async create(req) {
    return this.http.post('/api/v2/attribute', req.getHttpBody());
  }

  /**
   * Update current attribute
   * @param {Object} req
   * @return {Promise<Object>}
   */
  async update(req) {
    return this.http.put('/api/v2/attribute', req.getHttpBody());
  }

  /**
   * Delete attribute
   * @param {Object} req
   * @return {Promise<Object>}
   */
  async delete(req) {
    return this.http.put('/api/v2/attribute/delete', req.getHttpBody());
  }

  /**
   * Get attributes settings
   * @return {Promise<Object>}
   */
  async getSettings() {
    return this.http.get('/portal/settings/attribute-settings');
  }

  /**
   * Update attributes settings
   * @param {Object} req
   * @return {Promise<Object>}
   */
  async updateSettings(req) {
    return this.http.put('/portal/settings/attribute-settings', req.getHttpBody());
  }

  /** @type {() => AttributesHttp} */
  static getInstance = makeSingletonInstance(() => new AttributesHttp());
}
