import { Singleton } from '@deip/toolbox';
import {
  CreateAttributeCmd,
  UpdateAttributeCmd,
  DeleteAttributeCmd,
  UpdateAttributeSettingsCmd
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

  updateSettings(data) {
    const updateAttributeSettingsCmd = new UpdateAttributeSettingsCmd(data);
    const msg = new JsonDataMsg({ appCmds: [updateAttributeSettingsCmd] });
    return this.attributesHttp.updateSettings(msg);
  }
}

export {
  AttributesService
};
