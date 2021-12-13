import { collectionMerge, genObjectId, createInstanceGetter } from '@deip/toolbox';
import { JsonDataMsg } from '@deip/message-models';
import {
  UpdateLayoutCmd,
  UpdateLayoutSettingsCmd
} from '@deip/command-models';
import { LayoutHttp } from './LayoutHttp';

export class LayoutService {
  layoutHttp = LayoutHttp.getInstance();

  async getLayouts() {
    return this.layoutHttp.getLayouts();
  }

  async getOne(_id) {
    return this.getLayouts()
      .then((res) => res.find((l) => l._id === _id));
  }

  async updateLayouts(data) {
    const updateLayoutCmd = new UpdateLayoutCmd(data);
    const msg = new JsonDataMsg({ appCmds: [updateLayoutCmd] });
    return this.layoutHttp.updateLayouts(msg);
  }

  async create(data) {
    return this.getLayouts()
      .then((res) => {
        const _id = genObjectId({ salt: Math.random() + new Date().getTime().toString() });

        const updated = collectionMerge(res, {
          _id, ...data
        }, { key: '_id' });

        return this.updateLayouts(updated);
      });
  }

  async update(_id, data) {
    return this.getLayouts()
      .then((res) => {
        const exist = res.find((l) => l._id === _id);
        if (!exist) {
          throw new Error('Layout not found');
        }
        const updated = collectionMerge(res, {
          _id, ...data
        }, { key: '_id' });
        return this.updateLayouts(updated);
      });
  }

  async remove(_id) {
    return this.getLayouts()
      .then((res) => {
        const updated = res.filter((l) => l._id !== _id);

        return this.updateLayouts(updated);
      });
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
