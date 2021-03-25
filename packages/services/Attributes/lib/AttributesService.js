import { AttributesHttp } from './AttributesHttp';
import { Singleton } from '@deip/toolbox';

class AttributesService extends Singleton {
  attributesHttp = AttributesHttp.getInstance();

  getAttributes() {
    return this.attributesHttp.getAttributes();
  }

  getAttributesByScope(scope) {
    return this.attributesHttp.getAttributesByScope(scope);
  }

  getNetworkAttributesByScope(scope) {
    return this.attributesHttp.getNetworkAttributesByScope(scope);
  }

  getAttribute(id) {
    return this.attributesHttp.getAttribute(id);
  }

  getNetworkAttributes() {
    return this.attributesHttp.getNetworkAttributes();
  }

  getSystemAttributes() {
    return this.attributesHttp.getSystemAttributes();
  }

  createAttribute(attribute) {
    return this.attributesHttp.createAttribute(attribute);
  }

  updateAttribute(attribute) {
    return this.attributesHttp.updateAttribute(attribute);
  }

  deleteAttribute(attributeId) {
    return this.attributesHttp.deleteAttribute(attributeId);
  }
}

export {
  AttributesService
};
