import { Singleton } from '@deip/toolbox';
import {
  CreateAttributeCmd,
  UpdateAttributeCmd,
  DeleteAttributeCmd
} from '@deip/command-models';
import { JsonDataMsg } from '@deip/message-models';
import { AttributesHttp } from './AttributesHttp';

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
    const createAttributeCmd = new CreateAttributeCmd(attribute);
    const msg = new JsonDataMsg({ appCmds: [createAttributeCmd] });
    return this.attributesHttp.createAttribute(msg);
  }

  updateAttribute(attribute) {
    const updateAttributeCmd = new UpdateAttributeCmd(attribute);
    const msg = new JsonDataMsg({ appCmds: [updateAttributeCmd] });
    return this.attributesHttp.updateAttribute(msg);
  }

  deleteAttribute(attributeId) {
    const deleteAttributeCmd = new DeleteAttributeCmd({ attributeId });
    const msg = new JsonDataMsg({ appCmds: [deleteAttributeCmd] });
    return this.attributesHttp.deleteAttribute(msg);
  }

  getSettings() {
    return this.attributesHttp.getSettings();
  }

  // temp solution need change to cmd and send msg

  updateSettings(data) {
    return this.attributesHttp.updateSettings(data);
  }
}

export {
  AttributesService
};
