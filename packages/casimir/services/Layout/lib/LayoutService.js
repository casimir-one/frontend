import { collectionMerge, createInstanceGetter, genObjectId } from '@deip/toolbox';
import { JsonDataMsg } from '@deip/message-models';
import {
  CreateLayoutCmd, UpdateLayoutCmd, DeleteLayoutCmd, UpdateLayoutSettingsCmd
} from '@deip/command-models';
import { LayoutHttp } from './LayoutHttp';

export class LayoutService {
  layoutHttp = LayoutHttp.getInstance();

  async getLayout(layoutId) {
    return this.layoutHttp.getLayout(layoutId);
  }

  async getLayouts() {
    return this.layoutHttp.getLayouts();
  }

  async getLayoutsByScope(scope) {
    return this.layoutHttp.getLayoutsByScope(scope);
  }

  async createLayout(payload) {
    const createLayoutCmd = new CreateLayoutCmd(payload);
    const msg = new JsonDataMsg({ appCmds: [createLayoutCmd] });
    return this.layoutHttp.createLayout(msg);
  }

  async updateLayout(payload) {
    const updateLayoutCmd = new UpdateLayoutCmd(payload);
    const msg = new JsonDataMsg({ appCmds: [updateLayoutCmd] });
    return this.layoutHttp.updateLayout(msg);
  }

  async deleteLayout(layoutId) {
    const deleteLayoutCmd = new DeleteLayoutCmd({ layoutId });
    const msg = new JsonDataMsg({ appCmds: [deleteLayoutCmd] });
    return this.layoutHttp.deleteLayout(msg);
  }

  async #getLayoutsList() {
    const { data: { items: layouts } } = await this.getLayouts();
    return layouts;
  }

  async getOne(_id) {
    const layouts = await this.#getLayoutsList();
    return layouts.find((l) => l._id === _id);
  }

  async #updateLayouts(payload) {
    const updateLayoutCmd = new UpdateLayoutCmd(payload);
    const msg = new JsonDataMsg({ appCmds: [updateLayoutCmd] });
    return this.layoutHttp.updateLayouts(msg);
  }

  async create(payload) {
    const layouts = await this.#getLayoutsList();
    const _id = genObjectId({ salt: Math.random() + new Date().getTime().toString() });

    const updated = collectionMerge(layouts, {
      _id, ...payload
    }, { key: '_id' });

    return this.#updateLayouts(updated);
  }

  async update(payload) {
    const layouts = await this.#getLayoutsList();
    const { _id } = payload;

    const exist = layouts.find((l) => l._id === _id);
    if (!exist) {
      throw new Error('Layout not found');
    }

    const updated = collectionMerge(layouts, payload, { key: '_id' });
    return this.#updateLayouts(updated);
  }

  async remove(_id) {
    const layouts = await this.#getLayoutsList();
    const updated = layouts.filter((l) => l._id !== _id);
    return this.#updateLayouts(updated);
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
