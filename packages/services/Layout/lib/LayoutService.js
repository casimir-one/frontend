import { collectionMerge, genObjectId, Singleton } from '@deip/toolbox';
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

  // temp solution need change to cmd and send msg

  updateLayouts(data) {
    return this.layoutHttp.updateLayouts(data);
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
        }, { key: 'entityId' });
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
    return this.layoutHttp.updateSettings(data);
  }
}

export {
  LayoutService
};
