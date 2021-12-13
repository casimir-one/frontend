import {
  CreateAttributeCmd,
  UpdateAttributeCmd,
  DeleteAttributeCmd,
  UpdateAttributeSettingsCmd
} from '@deip/command-models';
import { JsonDataMsg } from '@deip/message-models';
import { createInstanceGetter } from '@deip/toolbox';
import { AttributesHttp } from './AttributesHttp';

export class AttributesService {
  attributesHttp = AttributesHttp.getInstance();

  async getAttributes() {
    return this.attributesHttp.getAttributes();
  }

  async getAttributesByScope(scope) {
    return this.attributesHttp.getAttributesByScope(scope);
  }

  async getNetworkAttributesByScope(scope) {
    return this.attributesHttp.getNetworkAttributesByScope(scope);
  }

  async getAttribute(id) {
    return this.attributesHttp.getAttribute(id);
  }

  async getNetworkAttributes() {
    return this.attributesHttp.getNetworkAttributes();
  }

  async getSystemAttributes() {
    return this.attributesHttp.getSystemAttributes();
  }

  async createAttribute(attribute) {
    const createAttributeCmd = new CreateAttributeCmd(attribute);
    const msg = new JsonDataMsg({ appCmds: [createAttributeCmd] });
    return this.attributesHttp.createAttribute(msg);
  }

  async updateAttribute(attribute) {
    const updateAttributeCmd = new UpdateAttributeCmd(attribute);
    const msg = new JsonDataMsg({ appCmds: [updateAttributeCmd] });
    return this.attributesHttp.updateAttribute(msg);
  }

  async deleteAttribute(attributeId) {
    const deleteAttributeCmd = new DeleteAttributeCmd({ attributeId });
    const msg = new JsonDataMsg({ appCmds: [deleteAttributeCmd] });
    return this.attributesHttp.deleteAttribute(msg);
  }

  async getSettings() {
    return this.attributesHttp.getSettings();
  }

  async updateSettings(data) {
    const updateAttributeSettingsCmd = new UpdateAttributeSettingsCmd(data);
    const msg = new JsonDataMsg({ appCmds: [updateAttributeSettingsCmd] });
    return this.attributesHttp.updateSettings(msg);
  }

  /** @type {() => AttributesService} */
  static getInstance = createInstanceGetter(AttributesService);
}
