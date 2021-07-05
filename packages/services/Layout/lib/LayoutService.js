import { collectionMerge, genObjectId, Singleton } from '@deip/toolbox';
import { LayoutHttp } from './LayoutHttp';

class LayoutService extends Singleton {
  layoutHttp = LayoutHttp.getInstance();

  getLayouts() {
    return this.layoutHttp.getLayouts();
  }

  getOne(id) {
    return this.getLayouts()
      .then((res) => res.find((l) => l.id === id));
  }

  // temp solution need change to cmd and send msg

  updateLayouts(data) {
    return this.layoutHttp.updateLayouts(data);
  }

  create(data) {
    return this.getLayouts()
      .then((res) => {
        const entityId = genObjectId({ salt: Math.random() + new Date().getTime().toString() });

        const updated = collectionMerge(res, {
          entityId, ...data
        }, { key: 'entityId' });

        return this.updateLayouts(updated);
      });
  }

  update(entityId, data) {
    return this.getLayouts()
      .then((res) => {
        const exist = res.find((l) => l.id === entityId);

        if (!exist) {
          throw new Error('Layout not found');
        }

        const updated = collectionMerge(res, {
          entityId, ...data
        }, { key: 'entityId' });
        return this.updateLayouts(updated);
      });
  }

  delete(entityId) {
    return this.getLayouts()
      .then((res) => {
        const updated = res.filter((l) => l.entityId !== entityId);

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
