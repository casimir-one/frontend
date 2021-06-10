import { Singleton } from '@deip/toolbox';
import { LayoutHttp } from './LayoutHttp';

class LayoutService extends Singleton {
  layoutHttp = LayoutHttp.getInstance();

  getLayouts(tenantId) {
    return this.layoutHttp.getLayouts(tenantId);
  }

  // temp solution need change to cmd and send msg

  updateLayouts(data) {
    return this.layoutHttp.updateLayouts(data);
  }
}

export {
  LayoutService
};
