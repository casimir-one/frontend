import { HttpService } from '@deip/http-service';
import { Singleton } from '@deip/toolbox';

class AttributesHttp extends Singleton {
  http = HttpService.getInstance();

  getAttributes() {
    return this.http.get(`/api/attributes`);
  }

  getAttributesByScope(scope) {
    return this.http.get(`/api/attributes/scope/${scope}`);
  }

  getNetworkAttributesByScope(scope) {
    return this.http.get(`/api/attributes/scope/network/${scope}`);
  }

  getAttribute(id) {
    return this.http.get(`/api/attribute/${id}`);
  }

  getNetworkAttributes() {
    return this.http.get(`/api/attributes/network`);
  }

  getSystemAttributes() {
    return this.http.get(`/api/attributes/system`);
  }

  createAttribute(attribute) {
    return this.http.post(`/api/attribute`, attribute);
  }

  updateAttribute(attribute) {
    return this.http.put(`/api/attribute`, attribute);
  }

  deleteAttribute(attributeId) {
    return this.http.delete_(`/api/attribute/${attributeId}`);
  }
}

export {
  AttributesHttp
};
