import { HttpService } from '@deip/http-service';
import { Singleton } from '@deip/toolbox';

class AttributesHttp extends Singleton {
  http = HttpService.getInstance();

  getAttributes() {
    return this.http.get('/api/v2/attributes');
  }

  getAttributesByScope(scope) {
    return this.http.get(`/api/v2/attributes/scope/${scope}`);
  }

  getNetworkAttributesByScope(scope) {
    return this.http.get(`/api/v2/attributes/scope/network/${scope}`);
  }

  getAttribute(id) {
    return this.http.get(`/api/v2/attribute/${id}`);
  }

  getNetworkAttributes() {
    return this.http.get('/api/v2/attributes/network');
  }

  getSystemAttributes() {
    return this.http.get('/api/v2/attributes/system');
  }

  createAttribute(req) {
    return this.http.post('/api/v2/attribute', req.getRequestBody());
  }

  updateAttribute(req) {
    return this.http.put('/api/v2/attribute', req.getRequestBody());
  }

  deleteAttribute(req) {
    return this.http.put('/api/v2/attribute/delete', req.getRequestBody());
  }

  getSettings() {
    return this.http.get('/tenant/settings/attribute-settings');
  }

  // temp solution, need change to msg

  updateSettings(data) {
    return this.http.put('/tenant/settings/attribute-settings', data);
  }
}

export {
  AttributesHttp
};
