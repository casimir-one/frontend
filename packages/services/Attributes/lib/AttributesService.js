import { Singleton } from '@deip/toolbox';
import {
  CmdEnvelope,
  CreateAttributeCmd,
  UpdateAttributeCmd,
  DeleteAttributeCmd
} from '@deip/command-models';
import { ApplicationJsonMessage } from '@deip/request-models';
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
    const cmdEnvelope = new CmdEnvelope([createAttributeCmd]);
    const msg = new ApplicationJsonMessage({}, cmdEnvelope);
    return this.attributesHttp.createAttribute(msg);
  }

  updateAttribute(attribute) {
    const updateAttributeCmd = new UpdateAttributeCmd(attribute);
    const cmdEnvelope = new CmdEnvelope([updateAttributeCmd]);
    const msg = new ApplicationJsonMessage({}, cmdEnvelope);
    return this.attributesHttp.updateAttribute(msg);
  }

  deleteAttribute(attributeId) {
    const deleteAttributeCmd = new DeleteAttributeCmd({ attributeId });
    const cmdEnvelope = new CmdEnvelope([deleteAttributeCmd]);
    const msg = new ApplicationJsonMessage({}, cmdEnvelope);
    return this.attributesHttp.deleteAttribute(msg);
  }

  getSettings(tenantId) {
    return this.attributesHttp.getSettings(tenantId);
  }

  // temp solution need change to cmd and send msg

  updateSettings(data) {
    return this.attributesHttp.updateSettings(data);
  }
}

export {
  AttributesService
};
