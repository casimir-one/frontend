import { collectionMerge, genObjectId, Singleton } from '@deip/toolbox';
import { JsonDataMsg } from '@deip/message-models';
import {
  UpdateLayoutCmd,
  UpdateLayoutSettingsCmd
} from '@deip/command-models';
import { LayoutHttp } from './LayoutHttp';

class LayoutService extends Singleton {
  layoutHttp = LayoutHttp.getInstance();

  getLayouts() {
    return this.layoutHttp.getLayouts();
  }

  getOne(_id) {
    return this.getLayouts()
      .then((res) => res.find((l) => l._id === _id));
  }

  updateLayouts(data) {
    const updateLayoutCmd = new UpdateLayoutCmd(data);
    const msg = new JsonDataMsg({ appCmds: [updateLayoutCmd] });
    return this.layoutHttp.updateLayouts(msg);
  }

  create(data) {
    return this.getLayouts()
      .then((res) => {
        const _id = genObjectId({ salt: Math.random() + new Date().getTime().toString() });

        const updated = collectionMerge(res, {
          _id, ...data
        }, { key: '_id' });

        return this.updateLayouts(updated);
      });
  }

  update(_id, data) {
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

  remove(_id) {
    return this.getLayouts()
      .then((res) => {
        const updated = res.filter((l) => l._id !== _id);

        return this.updateLayouts(updated);
      });
  }

  getSettings() {
    return this.layoutHttp.getSettings();
  }

  updateSettings(data) {
    const updateLayoutSettingsCmd = new UpdateLayoutSettingsCmd(data);
    const msg = new JsonDataMsg({ appCmds: [updateLayoutSettingsCmd] });
    return this.layoutHttp.updateSettings(msg);
  }
}

export {
  LayoutService
};
