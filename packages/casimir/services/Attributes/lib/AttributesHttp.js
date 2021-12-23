import { HttpService } from '@deip/http-service';
import { createInstanceGetter } from '@deip/toolbox';

export class AttributesHttp {
  http = HttpService.getInstance();

  async getAttributes() {
    return this.http.get('/api/v2/attributes');
  }

  async getAttributesByScope(scope) {
    return this.http.get(`/api/v2/attributes/scope/${scope}`);
  }

  async getNetworkAttributesByScope(scope) {
    return this.http.get(`/api/v2/attributes/scope/network/${scope}`);
  }

  async getAttribute(id) {
    return this.http.get(`/api/v2/attribute/${id}`);
  }

  async getNetworkAttributes() {
    return this.http.get('/api/v2/attributes/network');
  }

  async getSystemAttributes() {
    return this.http.get('/api/v2/attributes/system');
  }

  async createAttribute(req) {
    return this.http.post('/api/v2/attribute', req.getHttpBody());
  }

  async updateAttribute(req) {
    return this.http.put('/api/v2/attribute', req.getHttpBody());
  }

  async deleteAttribute(req) {
    return this.http.put('/api/v2/attribute/delete', req.getHttpBody());
  }

  async getSettings() {
    return this.http.get('/portal/settings/attribute-settings');
  }

  async updateSettings(req) {
    return this.http.put('/portal/settings/attribute-settings', req.getHttpBody());
  }

  /** @type {() => AttributesHttp} */
  static getInstance = createInstanceGetter(AttributesHttp);
}
