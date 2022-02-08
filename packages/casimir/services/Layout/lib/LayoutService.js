import { createInstanceGetter } from '@deip/toolbox';
import { JsonDataMsg } from '@deip/messages';
import {
  CreateLayoutCmd, UpdateLayoutCmd, DeleteLayoutCmd, UpdateLayoutSettingsCmd
} from '@deip/command-models';
import { LayoutHttp } from './LayoutHttp';

export class LayoutService {
  layoutHttp = LayoutHttp.getInstance();

  async getOne(layoutId) {
    return this.layoutHttp.getLayout(layoutId);
  }

  async getList() {
    return this.layoutHttp.getLayouts();
  }

  async getListByScope(scope) {
    return this.layoutHttp.getLayoutsByScope(scope);
  }

  async create(payload) {
    const createLayoutCmd = new CreateLayoutCmd(payload);
    const msg = new JsonDataMsg({ appCmds: [createLayoutCmd] });
    return this.layoutHttp.createLayout(msg);
  }

  async update(payload) {
    const updateLayoutCmd = new UpdateLayoutCmd(payload);
    const msg = new JsonDataMsg({ appCmds: [updateLayoutCmd] });
    return this.layoutHttp.updateLayout(msg);
  }

  async remove(layoutId) {
    const deleteLayoutCmd = new DeleteLayoutCmd({ layoutId });
    const msg = new JsonDataMsg({ appCmds: [deleteLayoutCmd] });
    return this.layoutHttp.deleteLayout(msg);
  }

  async getSettings() {
    return this.layoutHttp.getSettings();
  }

  async updateSettings(data) {
    const updateLayoutSettingsCmd = new UpdateLayoutSettingsCmd(data);
    const msg = new JsonDataMsg({ appCmds: [updateLayoutSettingsCmd] });
    return this.layoutHttp.updateSettings(msg);
  }

  /** @type {() => LayoutService} */
  static getInstance = createInstanceGetter(LayoutService);
}
