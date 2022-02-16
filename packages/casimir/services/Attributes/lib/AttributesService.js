import {
  CreateAttributeCmd,
  UpdateAttributeCmd,
  DeleteAttributeCmd,
  UpdateAttributeSettingsCmd
} from '@deip/commands';
import { JsonDataMsg } from '@deip/messages';
import { createInstanceGetter } from '@deip/toolbox';
import { AttributesHttp } from './AttributesHttp';

export class AttributesService {
  attributesHttp = AttributesHttp.getInstance();

  async getList() {
    return this.attributesHttp.getList();
  }

  async getListByScope(scope) {
    return this.attributesHttp.getListByScope(scope);
  }

  async getOne(id) {
    return this.attributesHttp.getOne(id);
  }

  async getNetworkAttributes() {
    return this.attributesHttp.getNetworkAttributes();
  }

  async getNetworkAttributesByScope(scope) {
    return this.attributesHttp.getNetworkAttributesByScope(scope);
  }

  async getSystemAttributes() {
    return this.attributesHttp.getSystemAttributes();
  }

  async create(attribute) {
    const createAttributeCmd = new CreateAttributeCmd(attribute);
    const msg = new JsonDataMsg({ appCmds: [createAttributeCmd] });
    return this.attributesHttp.create(msg);
  }

  async update(attribute) {
    const updateAttributeCmd = new UpdateAttributeCmd(attribute);
    const msg = new JsonDataMsg({ appCmds: [updateAttributeCmd] });
    return this.attributesHttp.update(msg);
  }

  async delete(attributeId) {
    const deleteAttributeCmd = new DeleteAttributeCmd({ attributeId });
    const msg = new JsonDataMsg({ appCmds: [deleteAttributeCmd] });
    return this.attributesHttp.delete(msg);
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
